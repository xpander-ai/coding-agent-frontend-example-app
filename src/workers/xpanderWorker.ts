/// <reference lib="webworker" />

import {
  XpanderClient,
  Memory,
  Execution,
  Agent,
  UserDetails,
} from "xpander-sdk";
import type { Task } from "../types";

/* -------------------------------------------------------------------------- */
/* 1.  Initialise SDK inside the worker (safe to block here)                  */
/* -------------------------------------------------------------------------- */

const xpanderClient = new XpanderClient(import.meta.env.VITE_APP_API_KEY!);

const config: Agent = {
  id: import.meta.env.VITE_APP_AGENT_ID!,
  userDetails: new UserDetails(import.meta.env.VITE_APP_AGENT_ID),
  configuration: xpanderClient.configuration,
} as Agent;

/* -------------------------------------------------------------------------- */
/* 2.  Typed worker actions                                                   */
/* -------------------------------------------------------------------------- */

type WorkerRequest =
  | { id: number; type: "fetchTasks" }
  | {
      id: number;
      type: "createTask";
      payload: { title: string; threadId?: string };
    }
  | { id: number; type: "fetchTask"; payload: { id: string } }
  | { id: number; type: "fetchLogs"; payload: { task: Task } };

type WorkerResponse<T = unknown> = { id: number; result?: T; error?: string };

/* ----- utilities ---------------------------------------------------------- */

function ok<T>(id: number, result: T): WorkerResponse<T> {
  return { id, result };
}
function fail(id: number, error: unknown): WorkerResponse {
  return { id, error: (error as Error).message ?? String(error) };
}

/* ----- core SDK wrappers -------------------------------------------------- */

async function fetchTasks(): Promise<Task[]> {
  const threadsRaw = Memory.fetchUserThreads(config);

  let threads: Task[] = threadsRaw.map((t) => ({
    id: t.id,
    createdAt: t.createdAt,
    title: t.id,
    status: "completed",
    steps: [],
    metadata: t.metadata,
  }));

  threads = threads.slice(0, 5);

  await Promise.all(
    threads.map(async (thread) => {
      if (thread.metadata?.executionId) {
        const execution = Execution.fetch(config, thread.metadata.executionId);
        thread.status = execution?.status;
        thread.title = execution?.input?.text;
        thread.result = execution?.result;
      }
    })
  );

  return threads;
}

async function createTask({
  title,
  threadId,
}: {
  title: string;
  threadId?: string;
}): Promise<Task> {
  const metadata: Record<string, any> = { agent_id: config.id };
  const continuing = !!threadId;

  if (!threadId) {
    const newThread = Memory.create(config, config.userDetails, metadata);
    threadId = newThread.id;
  }

  const execution = Execution.create(config, title, [], undefined, threadId);
  metadata.executionId = execution.id;
  Memory.update(config, threadId!, { metadata });

  return {
    id: threadId,
    createdAt: execution.createdAt,
    metadata,
    title: execution.input.text,
    status: continuing ? "executing" : execution.status,
    steps: [],
  };
}

async function fetchTask({ id }: { id: string }): Promise<Task> {
  const thread = Memory.fetch(config, id);
  const execution = Execution.fetch(config, thread.metadata.executionId);

  return {
    id: thread.id,
    createdAt: execution.createdAt,
    metadata: thread.metadata,
    title: execution?.input?.text,
    status: execution?.status,
    result: execution?.result,
    steps: [],
    messages: thread.messages,
  };
}

async function fetchLogs({ task }: { task: Task }) {
  const url = `https://logs.xpander.ai/${
    import.meta.env.VITE_APP_ORGANIZATION_ID
  }/${import.meta.env.VITE_APP_AGENT_ID}/${task.metadata.executionId}`;

  const resp = await fetch(url, {
    headers: { "x-api-key": import.meta.env.VITE_APP_API_KEY },
  });
  if (!resp.ok) {
    throw new Error(`${resp.status} · ${await resp.text()}`);
  }
  const data = await resp.json();
  return data.map(({ message }: any) => message).join("\n");
}

/* -------------------------------------------------------------------------- */
/* 3.  Message handler                                                        */
/* -------------------------------------------------------------------------- */

self.addEventListener("message", (e: MessageEvent<WorkerRequest>) => {
  const { id, type } = e.data;

  (async () => {
    try {
      switch (type) {
        case "fetchTasks":
          self.postMessage(ok(id, await fetchTasks()));
          break;
        case "createTask":
          self.postMessage(ok(id, await createTask(e.data.payload)));
          break;
        case "fetchTask":
          self.postMessage(ok(id, await fetchTask(e.data.payload)));
          break;
        case "fetchLogs":
          self.postMessage(ok(id, await fetchLogs(e.data.payload)));
          break;
      }
    } catch (err) {
      self.postMessage(fail(id, err));
    }
  })();
});
