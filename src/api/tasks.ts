import { api } from './client';
import type { Task } from '../types';

export async function fetchTasks(): Promise<Task[]> {
  return api('/tasks');
}

export async function createTask(title: string): Promise<Task> {
  return api('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function fetchTask(id: string): Promise<Task> {
  return api(`/tasks/${id}`);
}

export async function fetchLogs(id: string): Promise<string> {
  const res = await api<{ logs: string }>(`/tasks/${id}/logs`);
  return res.logs;
}
