import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { useTableQuery } from './useTableQuery';
import { Project } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { ListQueryParams } from '@/services/employee.service';

export function useProjects(initialParams?: ListQueryParams) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const tableQuery = useTableQuery<Project>({
        queryKey: ['projects'],
        fetchFn: projectService.getAll,
        initialPage: initialParams?.page,
        initialLimit: initialParams?.limit,
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => projectService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast({ title: 'Success', description: 'Project deployed successfully.' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => projectService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast({ title: 'Success', description: 'Project updated successfully.' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => projectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast({ title: 'Success', description: 'Project decommissioned.' });
        }
    });

    return {
        ...tableQuery,
        createProject: createMutation.mutateAsync,
        updateProject: updateMutation.mutateAsync,
        deleteProject: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
    };
}
