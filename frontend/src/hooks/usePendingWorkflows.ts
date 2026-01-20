import { useQuery } from '@tanstack/react-query';
import { workflowApi } from '@/services/api';

/**
 * Hook to fetch pending workflow tasks for the current user's role.
 */
export function usePendingWorkflows() {
    return useQuery({
        queryKey: ['workflows', 'pending'],
        queryFn: () => workflowApi.getPendingActions(),
        select: (res) => res.data
    });
}
