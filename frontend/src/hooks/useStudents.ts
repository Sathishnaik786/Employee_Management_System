import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '@/services/student.service';
import { useTableQuery } from './useTableQuery';
import { Student } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { ListQueryParams } from '@/services/faculty.service';

/**
 * Hook for managing students in IERS.
 */
export function useStudents(initialParams?: ListQueryParams & { enabled?: boolean }) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const tableQuery = useTableQuery<Student>({
        queryKey: ['students'],
        fetchFn: studentService.getAll as any,
        initialPage: initialParams?.page,
        initialLimit: initialParams?.limit,
        initialSort: initialParams?.sortBy ? {
            sortBy: initialParams.sortBy,
            sortOrder: (initialParams.sortOrder as 'asc' | 'desc') || 'desc'
        } : undefined,
        enabled: initialParams?.enabled,
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => studentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast({ title: 'Success', description: 'Student profile created.' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => studentService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast({ title: 'Success', description: 'Student profile updated.' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    return {
        ...tableQuery,
        createStudent: createMutation.mutateAsync,
        updateStudent: updateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
    };
}
