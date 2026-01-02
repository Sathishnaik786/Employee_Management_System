import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/layout/PageHeader';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { departmentsApi, authApi, employeesApi } from '@/services/api';
import { Department, Employee } from '@/types';

interface CreateUserFormData {
  email: string;
  role: string;
  departmentId?: string;
  managerId?: string;
}

const AdminUsers: React.FC = () => {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '',
    role: 'EMPLOYEE',
    departmentId: '',
    managerId: '',
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    console.log('USER:', user);
    console.log('API DATA: AdminUsers data:', employees);
  }, [user, employees]);

  useEffect(() => {
    // Only fetch data when user is available
    if (user) {
      fetchDepartments();
      fetchEmployees();
    }
  }, [user]); // Removed user dependency to prevent unnecessary re-renders

  const fetchDepartments = async () => {
    try {
      const deptList = await departmentsApi.getAll();
      setDepartments(deptList);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        variant: 'destructive',
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      setUsersLoading(true);
      const response = await employeesApi.getAll({ limit: 100 });
      console.log('API DATA: Employees response for AdminUsers:', response);
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load employees',
        variant: 'destructive',
      });
      setEmployees([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.createUser({
        email: formData.email,
        role: formData.role,
        departmentId: formData.departmentId || undefined,
        managerId: formData.managerId || undefined,
      });
      
      if (response.success) {
        toast({
          title: 'Success',
          description: response.message || `User ${formData.email} created successfully with role ${formData.role}`,
        });

        // Reset form
        setFormData({
          email: '',
          role: 'EMPLOYEE',
          departmentId: '',
          managerId: '',
        });
      } else {
        throw new Error(response.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      // Refresh the employee list after creating a user
      fetchEmployees();
    }
  };

  // Safe rendering patterns
  if (authLoading) {
    return (
      <>
        <div className="p-4">Initializing session…</div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <div className="p-4">Unauthorized</div>
      </>
    );
  }

  if (usersLoading) {
    return (
      <>
        <div className="p-4">Loading...</div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Admin User Management" description="Create and manage users with different roles and permissions" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="MANAGER">MANAGER</SelectItem>
                    <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId">Department</Label>
                <Select 
                  value={formData.departmentId} 
                  onValueChange={(value) => handleSelectChange('departmentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Admin can create all users from Admin UI</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Never expose Service Role Key to frontend</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Always validate role in backend middleware</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                <span>Prevent deleting the last ADMIN</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        employee.role === 'HR' ? 'bg-blue-100 text-blue-800' :
                        employee.role === 'MANAGER' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.role}
                      </span>
                    </TableCell>
                    <TableCell>{employee.department?.name || 'N/A'}</TableCell>
                    <TableCell>{employee.managerId ? 'Manager' : 'Self'}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" disabled={employee.role === 'ADMIN' && employee.email === 'admin@yvi.com'}>
                        {employee.role === 'ADMIN' && employee.email === 'admin@yvi.com' ? 'Cannot Delete' : 'Delete'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default AdminUsers;