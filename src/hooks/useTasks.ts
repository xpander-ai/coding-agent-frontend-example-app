import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask } from '../api/tasks';
import type { Task } from '../types';

export function useTasks() {
  return useQuery<Task[]>({ queryKey: ['tasks'], queryFn: fetchTasks });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onMutate: async (title: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const prev = queryClient.getQueryData<Task[]>(['tasks']);
      if (prev) {
        queryClient.setQueryData<Task[]>(['tasks'], [
          ...prev,
          { id: 'temp-' + Date.now(), title, status: 'running', steps: [] },
        ]);
      }
      return { prev };
    },
    onError: (_err, _title, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['tasks'], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
