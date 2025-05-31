import { IMemoryMessage } from "xpander-sdk";
export interface Step {
  id: number;
  text: string;
}

export interface Task {
  id: string;
  createdAt: string;
  title: string;
  status: "pending" | "executing" | "completed" | "error";
  result?: string;
  steps: Step[];
  messages?: IMemoryMessage[];
  metadata: Record<string, any>;
}
