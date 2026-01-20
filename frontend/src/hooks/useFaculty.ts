import { useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyService, ListQueryParams } from '@/services/faculty.service';
import { useTableQuery } from './useTableQuery';
import { Faculty } from '@/types';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing faculty directory in IERS.
 */
export function useFaculty(initialParams?: ListQueryParams & { enabled?: boolean }) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const tableQuery = useTableQuery<Faculty>({
        queryKey: ['faculty'],
        fetchFn: facultyService.getAll,
        initialPage: initialParams?.page,
        initialLimit: initialParams?.limit,
        initialSort: initialParams?.sortBy ? {
            sortBy: initialParams.sortBy,
            sortOrder: (initialParams.sortOrder as 'asc' | 'desc') || 'desc'
        } : undefined,
        enabled: initialParams?.enabled,
    });

    const createMutation = useMutation({
        mutationFn: (data: Partial<Faculty>) => facultyService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faculty'] });
            toast({ title: 'Success', description: 'Faculty onboarded successfully.' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    return {
        ...tableQuery,
        createFaculty: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
    };
}
