import type { Task } from "../types";
import {
  XpanderClient,
  Memory,
  Execution,
  Agent,
  UserDetails,
} from "xpander-sdk";

/**
 * Defers synchronous code to the next event loop cycle using setTimeout.
 * Helps avoid blocking the browser's main thread.
 */
function deferSync<T>(fn: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = fn();
      resolve(result);
    }, 0);
  });
}

const xpanderClient = new XpanderClient(import.meta.env.VITE_APP_API_KEY!);

const config: Agent = {
  id: import.meta.env.VITE_APP_AGENT_ID!,
  userDetails: new UserDetails("xpander-user"),
  configuration: xpanderClient.configuration,
} as Agent;

export async function fetchTasks(): Promise<Task[]> {
  const threadsRaw = await deferSync(() => Memory.fetchUserThreads(config));

  let threads: Task[] = threadsRaw.map((thread) => ({
    id: thread.id,
    createdAt: thread.createdAt,
    title: thread.id,
    status: "completed",
    steps: [],
    metadata: thread.metadata,
  }));

  threads = threads.slice(0, 10); // keep last 10

  await Promise.all(
    threads.map(async (thread) => {
      if (thread.metadata?.executionId) {
        const execution = await deferSync(() =>
          Execution.fetch(config, thread.metadata.executionId)
        );
        thread.status = execution?.status;
        thread.title = execution?.input?.text;
        thread.result = execution?.result;
      }
    })
  );

  return threads;
}

export async function createTask({
  title,
  threadId,
}: {
  title: string;
  threadId?: string;
}): Promise<Task> {
  const threadMetadata: Record<string, any> = { agent_id: config.id };
  const isUsingExistingThread = !!threadId;
  if (!threadId) {
    const createdThread = await deferSync(() =>
      Memory.create(config, config.userDetails, threadMetadata)
    );
    threadId = createdThread.id;
  }

  const createdExecution = await deferSync(() =>
    Execution.create(config, title, [], undefined, threadId)
  );

  threadMetadata.execution_id = createdExecution.id;

  await deferSync(() =>
    Memory.update(config, threadId!, { metadata: threadMetadata })
  );

  return {
    id: createdExecution.id,
    createdAt: createdExecution.createdAt,
    metadata: threadMetadata,
    title: createdExecution.input.text,
    status: isUsingExistingThread ? "executing" : createdExecution.status,
    steps: [],
  };
}

export async function fetchTask(id: string): Promise<Task> {
  const thread = await deferSync(() => Memory.fetch(config, id));
  const execution = await deferSync(() =>
    Execution.fetch(config, thread.metadata.executionId)
  );

  return {
    id: thread.id,
    createdAt: execution.createdAt,
    metadata: thread.metadata,
    title: execution?.input?.text,
    status: execution?.status,
    result: execution?.result,
    steps: [],
  };
}

export async function fetchLogs(task: Task): Promise<any> {
  const url = `https://actions.xpander.ai/coding_agents/codex/${
    import.meta.env.VITE_APP_ORGANIZATION_ID
  }/${import.meta.env.VITE_APP_AGENT_ID}/${task.metadata.executionId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": import.meta.env.VITE_APP_API_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch execution data: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  return data.map(({ message }: any) => message).join("\n");
}
