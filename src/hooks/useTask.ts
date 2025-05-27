import { useQuery } from "@tanstack/react-query";
import { fetchTask } from "../api/tasks";
import type { Task } from "../types";

export function useTask(id: string) {
  return useQuery<Task, Error>(["task", id], {
    refetchOnWindowFocus: false,
    refetchInterval: 3000,
    queryFn: () => fetchTask(id),
  });
}
