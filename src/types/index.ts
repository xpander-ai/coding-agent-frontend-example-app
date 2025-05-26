export interface Step {
  id: number;
  text: string;
}

export interface Task {
  id: string;
  createdAt: string;
  title: string;
  status: "executing" | "completed" | "failed";
  result?: string;
  steps: Step[];
  metadata: Record<string, any>;
}
