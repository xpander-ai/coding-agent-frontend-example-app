import { useQuery } from '@tanstack/react-query';
import { fetchTaskDetail } from '../api/tasks';
import { TaskDetail } from '../types';

export const useTaskDetail = (taskId: string) =>
  useQuery<TaskDetail, Error>(['task', taskId], () => fetchTaskDetail(taskId), {
    enabled: !!taskId,
  });