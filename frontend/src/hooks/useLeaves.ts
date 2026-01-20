import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { leaveService } from '@/services/leave.service';
import { useToast } from '@/components/ui/use-toast';
import { LeaveFormData } from '@/types';

export function useLeaves(params?: { status?: string; employeeId?: string }) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['leaves', params],
        queryFn: () => leaveService.getAll(params),
    });

    const applyMutation = useMutation({
        mutationFn: (data: any) => leaveService.apply(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaves'] });
            toast({ title: 'Success', description: 'Leave application submitted.' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    const approveMutation = useMutation({
        mutationFn: ({ id, approverId, comments }: { id: string; approverId: string; comments?: string }) =>
            leaveService.approve(id, approverId, comments),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaves'] });
            toast({ title: 'Success', description: 'Leave request approved.' });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, approverId, comments }: { id: string; approverId: string; comments?: string }) =>
            leaveService.reject(id, approverId, comments),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaves'] });
            toast({ title: 'Success', description: 'Leave request rejected.' });
        }
    });

    return {
        leaves: data?.data || [],
        isLoading,
        refetch,
        applyLeave: applyMutation.mutateAsync,
        approveLeave: approveMutation.mutateAsync,
        rejectLeave: rejectMutation.mutateAsync,
        isApplying: applyMutation.isPending,
    };
}
