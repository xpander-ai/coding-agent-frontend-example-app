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

/** Initialize Xpander SDK client using API key from environment variables. */
const xpanderClient = new XpanderClient(import.meta.env.VITE_APP_API_KEY!);

/** Agent configuration: agent ID, user details, and SDK configuration. */
const config: Agent = {
  id: import.meta.env.VITE_APP_AGENT_ID!,
  userDetails: new UserDetails("xpander-user"),
  configuration: xpanderClient.configuration,
} as Agent;

/**
 * Fetches the list of tasks (threads) for the configured agent.
 * Maps raw thread data to Task objects and enriches with execution status and results.
 */
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

  threads = threads.slice(0, 5);

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

/**
 * Creates a new execution task thread or continues an existing one.
 * @param params.title - The title or prompt for the task execution.
 * @param params.threadId - Optional existing thread ID to continue an ongoing task.
 * @returns A Promise resolving to a Task object representing the created or updated execution.
 */
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

/**
 * Retrieves a single task by thread ID, including its execution details and messages.
 * @param id - The thread ID for the task.
 * @returns A Promise resolving to the Task with full details.
 */
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
    messages: thread.messages,
  };
}

/**
 * Fetches raw execution logs for a given task from the Xpander logging service.
 * @param task - The Task object containing the execution ID and metadata.
 * @returns A Promise resolving to the combined log messages string.
 * @throws Error if the HTTP request is not successful.
 */
export async function fetchLogs(task: Task): Promise<any> {
  const url = `https://logs.xpander.ai/${
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
