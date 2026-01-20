import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, ListQueryParams } from '@/services/employee.service';
import { useTableQuery } from './useTableQuery';
import { Employee, EmployeeFormData } from '@/types';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing employee data with server-side features.
 */
export function useEmployees(initialParams?: ListQueryParams) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const tableQuery = useTableQuery<Employee>({
        queryKey: ['employees'],
        fetchFn: employeeService.getAll,
        initialPage: initialParams?.page,
        initialLimit: initialParams?.limit,
        initialSort: initialParams?.sortBy ? {
            sortBy: initialParams.sortBy,
            sortOrder: initialParams.sortOrder || 'desc'
        } : undefined,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data: EmployeeFormData) => employeeService.create(data as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast({ title: 'Success', description: 'Employee onboarded successfully.' });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to onboard employee.',
                variant: 'destructive'
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeFormData> }) =>
            employeeService.update(id, data as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast({ title: 'Success', description: 'Employee profile updated.' });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update profile.',
                variant: 'destructive'
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => employeeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast({ title: 'Success', description: 'Employee record removed.' });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to remove record.',
                variant: 'destructive'
            });
        }
    });

    return {
        ...tableQuery,
        createEmployee: createMutation.mutateAsync,
        updateEmployee: updateMutation.mutateAsync,
        deleteEmployee: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
