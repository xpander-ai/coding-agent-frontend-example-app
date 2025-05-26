export interface Step {
  id: number;
  text: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'running' | 'completed' | 'failed';
  steps: Step[];
}
