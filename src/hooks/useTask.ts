import { useQuery } from "@tanstack/react-query";
import { fetchTask } from "../api/tasks";
import type { Task } from "../types";

/**
 * React hook to fetch a single task by its ID using React Query.
 * @param id - The thread ID of the task to retrieve.
 * @returns The React Query result containing task data and status.
 */
export function useTask(id: string) {
  return useQuery<Task, Error>(["task", id], {
    refetchOnWindowFocus: false,
    refetchInterval: 3000,
    queryFn: () => fetchTask(id),
    enabled: Boolean(id), // Ensure the query only runs when an ID is provided
  });
}
