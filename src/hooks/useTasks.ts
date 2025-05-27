import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask } from "../api/tasks";
import type { Task } from "../types";

/**
 * React hook to fetch the list of tasks using React Query.
 * @returns The React Query result containing the array of tasks and status.
 */
export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    retry: false, // Do not retry failures by default
  });
}

/**
 * React hook to create a new task with optimistic updates to the task list.
 * Provides mutation function and handles caching logic.
 * @returns The React Query mutation object for creating tasks.
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onMutate: async ({
      title,
      threadId,
    }: {
      title: string;
      threadId?: string;
    }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const prev = queryClient.getQueryData<Task[]>(["tasks"]);

      if (prev) {
        const optimisticTask: Task = {
          id: threadId || "temp-" + Date.now(),
          createdAt: new Date().toISOString(), // mock creation time
          title,
          status: "executing",
          steps: [],
          metadata: {}, // or populate with mock values if needed
          result: "",
        };

        queryClient.setQueryData<Task[]>(["tasks"], [...prev, optimisticTask]);
      }

      return { prev };
    },
    onError: (_err, _title, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["tasks"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
