import type { Task } from "../types";

/* -------------------------------------------------------------------------- */
/* 1.  Spawn / memoise the worker                                             */
/* -------------------------------------------------------------------------- */

const worker = new Worker(
  new URL("../workers/xpanderWorker.ts", import.meta.url),
  {
    type: "module",
  }
);

let msgId = 0;
function callWorker<T>(type: string, payload?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    const listener = (evt: MessageEvent) => {
      if (evt.data.id !== id) return;
      worker.removeEventListener("message", listener);
      const { result, error } = evt.data;
      error ? reject(new Error(error)) : resolve(result);
    };
    worker.addEventListener("message", listener);
    worker.postMessage({ id, type, payload });
  });
}

/* -------------------------------------------------------------------------- */
/* 2.  Public API identical to before – now non-blocking                      */
/* -------------------------------------------------------------------------- */

export const fetchTasks = () => callWorker<Task[]>("fetchTasks");

export const createTask = (p: { title: string; threadId?: string }) =>
  callWorker<Task>("createTask", p);

export const fetchTask = (id: string) => callWorker<Task>("fetchTask", { id });

export const fetchLogs = (task: Task) =>
  callWorker<string>("fetchLogs", { task });
