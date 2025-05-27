import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "../api/tasks";
import { Task } from "../types";

export function useLogs(task?: Task | undefined) {
  return useQuery({
    queryKey: ["logs", task],
    enabled: !!task?.id,
    refetchOnWindowFocus: false,
    queryFn: () => fetchLogs(task!),
    refetchInterval: 2000,
  });
}
