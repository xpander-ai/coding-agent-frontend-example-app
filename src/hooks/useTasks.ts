import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask } from "../api/tasks";
import type { Task } from "../types";

/**
 * React hook to fetch the list of tasks using React Query.
 * @returns The React Query result containing the array of tasks and status.
 */
export function useTasks() {
  return useQuery<Task[]>({
    refetchOnWindowFocus: false,
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    retry: false,
  });
}

/**
 * React hook to create a new task and refresh the task list on completion.
 * @returns The React Query mutation object for creating tasks.
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
