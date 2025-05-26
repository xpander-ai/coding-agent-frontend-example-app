import { useQuery } from '@tanstack/react-query';
import { fetchLogs } from '../api/tasks';

export function useLogs(id: string) {
  return useQuery({
    queryKey: ['logs', id],
    queryFn: () => fetchLogs(id),
    refetchInterval: 2000,
  });
}
