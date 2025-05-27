import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "../api/tasks";
import { Task } from "../types";

/**
 * React hook to fetch execution logs for a given task using React Query.
 * Polls logs every 2 seconds when a valid task ID is present.
 * @param task - The Task object containing execution metadata.
 */
export function useLogs(task?: Task | undefined) {
  return useQuery({
    queryKey: ["logs", task],
    enabled: !!task?.id, // Only run when a task ID exists
    refetchOnWindowFocus: false,
    queryFn: () => fetchLogs(task!),
    refetchInterval: 2000, // Poll logs every 2 seconds
  });
}
