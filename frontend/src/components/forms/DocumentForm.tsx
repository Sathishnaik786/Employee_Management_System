import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

// Local types for Document management
export type DocumentType = 'ID_PROOF' | 'ADDRESS_PROOF' | 'EDUCATION' | 'EXPERIENCE' | 'CONTRACT' | 'OTHER';

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: string;
  employeeId?: string;
}

interface DocumentFormProps {
  document?: Document;
  employeeId?: string;
  onSubmit: (data: { file: File; type: DocumentType; employeeId: string }) => void;
  onCancel: () => void;
}

export function DocumentForm({ document, employeeId: initialEmployeeId, onSubmit, onCancel }: DocumentFormProps) {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  // Using generic user list instead of employees
  const [targetUsers, setTargetUsers] = useState<{ id: string, firstName: string, lastName: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<{
    type: DocumentType;
    employeeId: string;
  }>({
    defaultValues: {
      type: 'OTHER',
      employeeId: initialEmployeeId || (user && (hasPermission('ems:documents:student-upload') || hasPermission('ems:documents:faculty-upload')) ? user.id : '') || '',
    },
  });

  // Fetch users for Admin to select
  const fetchTargetUsers = async () => {
    if (hasPermission('ems:documents:manage') && targetUsers.length === 0) {
      // Mock selection list for IERS
      setTargetUsers([
        { id: '1', firstName: 'Alice', lastName: 'Stark' },
        { id: '2', firstName: 'Robert', lastName: 'Oppenheimer' }
      ]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit: SubmitHandler<{ type: DocumentType; employeeId: string }> = async (data) => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    // Validate user selection for Admin
    if (hasPermission('ems:documents:manage') && !data.employeeId) {
      toast({
        title: 'Error',
        description: 'Please select a text user',
        variant: 'destructive',
      });
      return;
    }

    // For non-admins, they can only upload for themselves
    const targetId = hasPermission('ems:documents:manage') ? data.employeeId : user?.id;

    if (!targetId) {
      toast({
        title: 'Error',
        description: 'Target User ID is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await onSubmit({ file, type: data.type, employeeId: targetId });
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine if user selection should be shown
  const showUserSelection = hasPermission('ems:documents:manage') && !initialEmployeeId;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ID_PROOF">ID Proof</SelectItem>
                  <SelectItem value="ADDRESS_PROOF">Address Proof</SelectItem>
                  <SelectItem value="EDUCATION">Education</SelectItem>
                  <SelectItem value="EXPERIENCE">Experience</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showUserSelection && (
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target User</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} onOpenChange={(open) => open && fetchTargetUsers()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {targetUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.firstName} {u.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormItem>
          <FormLabel>File</FormLabel>
          <FormControl>
            <Input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !file}>
            {loading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </form>
    </Form>
  );
}