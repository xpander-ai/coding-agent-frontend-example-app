export type Task = {
  id: string;
  title: string;
  status: 'running' | 'completed';
};

export interface TaskDetail {
  id: string;
  title: string;
  status: 'running' | 'completed';
  steps: string[];
}

export type TaskLog = string;