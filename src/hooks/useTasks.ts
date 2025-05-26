import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/tasks';
import { Task } from '../types';

export const useTasks = () =>
  useQuery<Task[], Error>(['tasks'], fetchTasks);