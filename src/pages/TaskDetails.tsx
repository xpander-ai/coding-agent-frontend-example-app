import { useParams } from "react-router-dom";
import { FormEvent, useMemo, useState, useEffect, useRef } from "react";
import { useTask } from "../hooks/useTask";
import Modal from "../components/Modal";
import { useLogs } from "../hooks/useLogs";
import { preserveScroll } from "../utils/scroll";
import { useCreateTask } from "../hooks/useTasks";
import ReactMarkdown from "react-markdown";
import { useQueryClient } from "@tanstack/react-query";

export default function TaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading, refetch } = useTask(taskId!);
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [openedModal, setOpenedModal] = useState<string>("");

  const createTask = useCreateTask();

  const isWorking = useMemo(
    () =>
      isLoading ||
      createTask.isLoading ||
      task?.status === "executing" ||
      task?.status === "pending",
    [task, isLoading, createTask.isLoading]
  );

  const { data: logs } = useLogs(task);

  const [lastLogs, setLastLogs] = useState<string | undefined>();
  const logsRef = useRef<HTMLDivElement>(null);

  // preserve scroll on logs updates
  useEffect(() => {
    if (!logs || !logsRef.current) return;
    preserveScroll(logsRef.current, () => {
      setLastLogs(logs);
    });
  }, [logs]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message || isWorking) return;

    const optimisticMessage = {
      role: "user",
      content: message,
      ts: new Date().toISOString(),
    };

    queryClient.setQueryData(["task", taskId], (old: any) => ({
      ...old,
      title: message,
      result: "",
      messages: [...(old?.messages || []), optimisticMessage],
    }));

    setMessage("");

    createTask.mutate(
      { title: message, threadId: task?.id },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  // auto open codex logs if its running (last tool with not result)
  useEffect(() => {
    if (
      task?.status === "executing" &&
      task?.messages?.[task?.messages?.length - 1]?.toolCalls?.[0].name ===
        "xpcoder-codex"
    ) {
      setOpenedModal("logs");
    } else if (task?.status === "completed" || task?.status === "error") {
      setOpenedModal("");
    }
  }, [task]);

  if (isLoading) return <p>Loading...</p>;
  if (!task) return <p>Task not found</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Input: {task.title}</h2>

      <div className="space-y-2">
        {!!task?.result && (
          <ReactMarkdown
            className="p-2 border rounded"
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#753cff] underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {task.result}
          </ReactMarkdown>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex space-x-2">
        <input
          className="flex-1 border rounded p-2 bg-white dark:bg-gray-800"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          disabled={isWorking}
        />
        <button
          type="submit"
          className="px-4 py-2 w-24 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
          disabled={!message || isWorking}
        >
          {isWorking ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            "Send"
          )}
        </button>
      </form>

      <div className="flex flex-row gap-2 items-center">
        <button
          onClick={() => setOpenedModal("logs")}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          View Codex Logs
        </button>
        <button
          onClick={() => setOpenedModal("messages")}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          View Messages
        </button>
      </div>

      <Modal open={openedModal === "logs"} onClose={() => setOpenedModal("")}>
        <h3 className="font-bold mb-2">Logs</h3>
        <div
          ref={logsRef}
          className="h-full max-h-full overflow-auto bg-gray-100 dark:bg-gray-900 p-4 rounded"
        >
          <pre className="whitespace-pre-wrap break-words text-sm">
            {lastLogs || "No logs available."}
          </pre>
        </div>
      </Modal>

      <Modal
        open={openedModal === "messages"}
        onClose={() => setOpenedModal("")}
      >
        <h3 className="font-bold mb-2">Messages</h3>
        <div className="h-full max-h-full overflow-auto bg-gray-100 dark:bg-gray-900 p-4 rounded">
          <pre className="whitespace-pre-wrap break-words text-sm">
            {JSON.stringify(task.messages, null, 2)}
          </pre>
        </div>
      </Modal>
    </div>
  );
}
