import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services/api';

/**
 * Hook to fetch current student's real-time metrics and workflows.
 */
export function useStudentMe() {
    const metricsQuery = useQuery({
        queryKey: ['student', 'me', 'metrics'],
        queryFn: () => studentsApi.getMeMetrics(),
        select: (res) => res.data,
        refetchInterval: 10000 // Refetch every 10s for live feel
    });

    const workflowsQuery = useQuery({
        queryKey: ['student', 'me', 'workflows'],
        queryFn: () => studentsApi.getMeWorkflows(),
        select: (res) => res.data,
        refetchInterval: 10000 // Refetch every 10s for live feel
    });

    return {
        metrics: metricsQuery.data,
        workflowData: workflowsQuery.data,
        isLoading: metricsQuery.isLoading || workflowsQuery.isLoading,
        isError: metricsQuery.isError || workflowsQuery.isError,
        refetch: () => {
            metricsQuery.refetch();
            workflowsQuery.refetch();
        }
    };
}
