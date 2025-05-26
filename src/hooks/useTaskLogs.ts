import { useQuery } from '@tanstack/react-query';
import { fetchTaskLogs } from '../api/tasks';
import { TaskLog } from '../types';

export const useTaskLogs = (taskId: string) =>
  useQuery<TaskLog[], Error>(['logs', taskId], () => fetchTaskLogs(taskId), {
    enabled: !!taskId,
    refetchInterval: 2000,
  });