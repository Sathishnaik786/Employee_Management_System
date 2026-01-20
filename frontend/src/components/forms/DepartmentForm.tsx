import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { employeesApi, departmentsApi } from '@/services/api';
import { Department, DepartmentFormData, Employee } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

interface DepartmentFormProps {
  department?: Department;
  onSubmit: (data: DepartmentFormData) => void;
  onCancel: () => void;
}

export function DepartmentForm({ department, onSubmit, onCancel }: DepartmentFormProps) {
  const { user: _user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<DepartmentFormData>({
    defaultValues: {
      name: department?.name || '',
      description: department?.description || '',
      managerId: department?.managerId || '',
    },
  });

  useEffect(() => {
    // Only fetch employees if user has permission to assign managers
    if (hasPermission('ems:departments:manage')) {
      const fetchEmployees = async () => {
        try {
          setLoading(true);
          const response = await employeesApi.getAll({});
          setEmployees(response.data || []);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to load employees',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchEmployees();
    }
  }, [hasPermission, toast]);

  const handleSubmit: SubmitHandler<DepartmentFormData> = async (data) => {
    try {
      setLoading(true);
      await onSubmit(data);
      toast({
        title: 'Success',
        description: department ? 'Department updated successfully' : 'Department created successfully',
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save department',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine if form should be readonly
  const isReadOnly = !hasPermission('ems:departments:manage');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter department description" disabled={isReadOnly} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasPermission('ems:departments:manage') && (
          <FormField
            control={form.control}
            name="managerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manager</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReadOnly}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          {!isReadOnly && (
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : department ? 'Update Department' : 'Create Department'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}