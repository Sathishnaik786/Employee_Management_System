import { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DataTableSkeleton } from '@/components/common/Skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { employeesApi } from '@/services/api';
import { Employee, EmployeeFormData, PaginationMeta } from '@/types';
import { Plus, Search, Mail, Phone, Edit, Trash2, ArrowUp, ArrowDown, MessageCircle } from 'lucide-react';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { CrudModal } from '@/components/modals/CrudModal';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { canChat } from '@/utils/canChat';
import ChatDrawer from '@/components/common/ChatDrawer';

const Employees = () => {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState<Employee | null>(null);
  const chatDrawerRef = useRef<any>(null);
  
  useEffect(() => {
    fetchAllEmployees();
  }, []);
  
  const fetchAllEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching all employees...');
      
      // Fetch all employees without pagination for client-side filtering
      const response = await employeesApi.getAll({ 
        page: 1, 
        limit: 1000, // Large limit to get all employees
        sortBy, 
        sortOrder 
      });
      
      setEmployees(response.data || []);
      setMeta(response.meta);
    } catch (error: unknown) {
      console.error('Error fetching employees:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employees';
      console.log('Error:', errorMessage);
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeesApi.delete(employeeId);
        toast({
          title: 'Success',
          description: 'Employee deleted successfully',
        });
        fetchAllEmployees(); // Refresh the list
      } catch (error: unknown) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to delete employee',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      if (editingEmployee) {
        // Update existing employee
        await employeesApi.update(editingEmployee.id, data);
        toast({
          title: 'Success',
          description: 'Employee updated successfully',
        });
      } else {
        // Create new employee
        await employeesApi.create(data);
        toast({
          title: 'Success',
          description: 'Employee created successfully',
        });
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      fetchAllEmployees(); // Refresh the list
    } catch (error: unknown) {
      throw error;
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      // If clicking the same field, toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new field, sort by that field in descending order
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return null;
    }
    return sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 inline" /> : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  const openChatWithUser = (employee: Employee) => {
    if (user && canChat(user.role, employee.role)) {
      setChatDrawerOpen(true);
      // Give the drawer a moment to open, then call the openChatWithUser method
      setTimeout(() => {
        if (chatDrawerRef.current && chatDrawerRef.current.openChatWithUser) {
          chatDrawerRef.current.openChatWithUser({
            id: employee.userId || employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            role: employee.role
          });
        }
      }, 100);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(filteredEmployees.length / 5)) {
      setCurrentPage(newPage);
    }
  };

  // Apply filters and sorting with useMemo
  const filteredEmployees = useMemo(() => {
    let result = [...employees];
    
    // Apply search filter
    if (search) {
      result = result.filter(emp => 
        (emp.firstName && emp.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (emp.lastName && emp.lastName.toLowerCase().includes(search.toLowerCase())) ||
        (emp.email && emp.email.toLowerCase().includes(search.toLowerCase())) ||
        (emp.department?.name && emp.department.name.toLowerCase().includes(search.toLowerCase())) ||
        (emp.position && emp.position.toLowerCase().includes(search.toLowerCase())) ||
        (emp.status && emp.status.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply role filter
    if (roleFilter) {
      result = result.filter(emp => emp.role === roleFilter);
    }
    
    // Apply department filter
    if (departmentFilter) {
      result = result.filter(emp => 
        emp.department?.name?.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'first_name':
          aValue = a.firstName;
          bValue = b.firstName;
          break;
        case 'last_name':
          aValue = a.lastName;
          bValue = b.lastName;
          break;
        case 'department':
          aValue = a.department?.name || '';
          bValue = b.department?.name || '';
          break;
        case 'position':
          aValue = a.position || '';
          bValue = b.position || '';
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        default:
          aValue = a[sortBy as keyof Employee];
          bValue = b[sortBy as keyof Employee];
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        if (sortOrder === 'asc') {
          return (aValue as any) > (bValue as any) ? 1 : -1;
        } else {
          return (aValue as any) < (bValue as any) ? 1 : -1;
        }
      }
    });
    
    return result;
  }, [employees, search, roleFilter, departmentFilter, sortBy, sortOrder]);
  
  // Apply pagination
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, currentPage]);
  
  const totalPages = Math.ceil(filteredEmployees.length / 5);

  if (authLoading) {
    return (
      <div className="p-4">Initializing session…</div>
    );
  }

  if (!user) {
    return (
      <div className="p-4">Unauthorized</div>
    );
  }

  // Check if user has permission to view employees page
  if (user.role !== 'ADMIN' && user.role !== 'HR' && user.role !== 'MANAGER') {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You don't have permission to view the employees page.</p>
        <Link to="/app/dashboard" className="text-primary hover:underline">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  // Safe rendering patterns
  if (loading) {
    return (
      <>
        <PageHeader title="Employees" description="Manage your organization's workforce">
          <Button onClick={handleCreateEmployee} disabled><Plus className="h-4 w-4 mr-2" />Add Employee</Button>
        </PageHeader>
        <DataTableSkeleton columns={6} rows={8} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Employees" description="Manage your organization's workforce">
          <Button onClick={handleCreateEmployee}><Plus className="h-4 w-4 mr-2" />Add Employee</Button>
        </PageHeader>
        <div className="p-4 text-red-500">
          Error: {error}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Employees" description="Manage your organization's workforce">
        <Button onClick={handleCreateEmployee}><Plus className="h-4 w-4 mr-2" />Add Employee</Button>
      </PageHeader>
      
      <CrudModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingEmployee ? 'Edit Employee' : 'Create Employee'}
        size="xl"
      >
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </CrudModal>
      <div className="flex justify-between items-center mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search employees..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Select value={roleFilter || undefined} onValueChange={(value) => setRoleFilter(value || '')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="EMPLOYEE">Employee</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter || undefined} onValueChange={(value) => setDepartmentFilter(value || '')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* This loading state is now handled at the component level, so we don't need it here anymore */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full">
            <thead><tr className="table-header border-b">
              <th className="px-4 py-3 text-left">S.NO</th>
              <th onClick={() => handleSort('first_name')} className="px-4 py-3 text-left cursor-pointer hover:bg-gray-50">
                Name {getSortIcon('first_name')}
              </th>
              <th onClick={() => handleSort('department')} className="px-4 py-3 text-left cursor-pointer hover:bg-gray-50">
                Department {getSortIcon('department')}
              </th>
              <th onClick={() => handleSort('position')} className="px-4 py-3 text-left cursor-pointer hover:bg-gray-50">
                Position {getSortIcon('position')}
              </th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th onClick={() => handleSort('status')} className="px-4 py-3 text-left cursor-pointer hover:bg-gray-50">
                Status {getSortIcon('status')}
              </th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr></thead>
            <tbody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp, index) => (
                  <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{(currentPage - 1) * 5 + index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary">{emp.firstName[0]}{emp.lastName[0]}</AvatarFallback></Avatar>
                        <div><p className="font-medium">{emp.firstName} {emp.lastName}</p><p className="text-xs text-muted-foreground">{emp.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{emp.department?.name}</td>
                    <td className="px-4 py-3 text-sm">{emp.position}</td>
                    <td className="px-4 py-3"><div className="flex gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><Phone className="h-4 w-4 text-muted-foreground" />{user && canChat(user.role, emp.role) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <MessageCircle 
                              className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" 
                              onClick={(e) => {
                                e.stopPropagation();
                                openChatWithUser(emp);
                              }}
                              aria-label="Send message"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send message</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}</div></td>
                    <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditEmployee(emp)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(emp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-4 py-3 border-t bg-card">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, filteredEmployees.length)} of {filteredEmployees.length} employees
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                  const pageNum = startPage + i;
                  
                  if (pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={currentPage === pageNum ? "bg-primary" : ""}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      <ChatDrawer 
        ref={chatDrawerRef}
        isOpen={chatDrawerOpen} 
        onClose={() => setChatDrawerOpen(false)} 
      />
    </>
  );
}

export default Employees;