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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { departmentsApi, authApi, employeesApi } from '@/services/api';
import { Department, Employee, Role } from '@/types';

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
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleUpdateModal, setShowRoleUpdateModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>('');

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

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async (updatedData: any) => {
    if (!editingEmployee) return;
    
    try {
      await employeesApi.update(editingEmployee.id, updatedData);
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      });
      setShowEditModal(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to update employee',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedEmployeeId || !newRole) return;
    
    try {
      await employeesApi.update(selectedEmployeeId, { role: newRole as Role });
      toast({
        title: 'Success',
        description: 'Employee role updated successfully',
      });
      setShowRoleUpdateModal(false);
      setSelectedEmployeeId(null);
      setNewRole('');
      fetchEmployees();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update employee role',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (employeeId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await employeesApi.update(employeeId, { status: newStatus });
      toast({
        title: 'Success',
        description: `Employee status updated to ${newStatus}`,
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update employee status',
        variant: 'destructive',
      });
    }
  };

  const handleRemove = async (employeeId: string) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) {
      return;
    }
    
    try {
      await employeesApi.delete(employeeId);
      toast({
        title: 'Success',
        description: 'Employee removed successfully',
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error removing employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove employee',
        variant: 'destructive',
      });
    }
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
                <TableHead>S.NO</TableHead>
                <TableHead>First_Name</TableHead>
                <TableHead>Last_Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned_Manager</TableHead>
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
                employees.map((employee, index) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{employee.firstName}</TableCell>
                    <TableCell>{employee.lastName}</TableCell>
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
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department?.name || 'N/A'}</TableCell>
                    <TableCell>{employee.manager?.firstName + ' ' + employee.manager?.lastName || 'N/A'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(employee)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('Edit Permission', employee.id)}>
                            Edit Permission
                          </DropdownMenuItem>
                          {employee.status === 'ACTIVE' ? (
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(employee.id, employee.status)}
                              className="text-red-600 focus:text-red-700"
                            >
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(employee.id, employee.status)}
                              className="text-green-600 focus:text-green-700"
                            >
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleRemove(employee.id)}
                            className="text-red-600 focus:text-red-700"
                          >
                            Remove
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {setSelectedEmployeeId(employee.id); setNewRole(employee.role); setShowRoleUpdateModal(true);}}>
                            Update Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      {/* Role Update Dialog */}
      <Dialog open={showRoleUpdateModal} onOpenChange={setShowRoleUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Role</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="MANAGER">MANAGER</SelectItem>
                <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleUpdateModal(false)}>Cancel</Button>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsers;