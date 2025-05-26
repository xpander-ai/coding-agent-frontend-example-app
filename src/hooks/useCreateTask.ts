import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/tasks';
import { Task } from '../types';

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, string>(createTask, {
    onMutate: async (title: string) => {
      await queryClient.cancelQueries(['tasks']);
      const previous = queryClient.getQueryData<Task[]>(['tasks']) || [];
      const optimistic: Task = { id: Date.now().toString(), title, status: 'running' };
      queryClient.setQueryData<Task[]>(['tasks'], [optimistic, ...previous]);
      return { previous };
    },
    onError: (_err, _title, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });
};