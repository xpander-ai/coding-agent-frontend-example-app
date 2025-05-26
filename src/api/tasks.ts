import { Task, TaskDetail, TaskLog } from '../types';

let tasks: Task[] = [];
const taskDetails: Record<string, TaskDetail> = {};
const taskLogs: Record<string, TaskLog[]> = {};

const simulateNetworkDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export async function fetchTasks(): Promise<Task[]> {
  await simulateNetworkDelay(500);
  return tasks;
}

export async function createTask(title: string): Promise<Task> {
  await simulateNetworkDelay(500);
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    status: 'running',
  };
  tasks = [newTask, ...tasks];
  taskDetails[newTask.id] = {
    id: newTask.id,
    title: newTask.title,
    status: newTask.status,
    steps: ['Task created'],
  };
  taskLogs[newTask.id] = [
    'Task created at ' + new Date().toLocaleTimeString(),
  ];
  return newTask;
}

export async function fetchTaskDetail(taskId: string): Promise<TaskDetail> {
  await simulateNetworkDelay(500);
  const detail = taskDetails[taskId];
  if (!detail) {
    throw new Error('Task not found');
  }
  return detail;
}

export async function fetchTaskLogs(taskId: string): Promise<TaskLog[]> {
  await simulateNetworkDelay(500);
  const logs = taskLogs[taskId] || [];
  const entry = `Log at ${new Date().toLocaleTimeString()}`;
  taskLogs[taskId] = [...logs, entry];
  return taskLogs[taskId];
}