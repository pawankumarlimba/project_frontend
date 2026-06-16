import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { queryKeys } from './Querykeys';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardApi.getStats,
    staleTime: 1000 * 15,      // 15s — dashboard reflects live counts
    refetchOnWindowFocus: true,
  });
}