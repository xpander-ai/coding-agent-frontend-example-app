import { useQuery } from "@tanstack/react-query";
import { fetchTask } from "../api/tasks";
import type { Task } from "../types";

export function useTask(id: string) {
  return useQuery<Task, Error>(["task", id], { queryFn: () => fetchTask(id) });
}
