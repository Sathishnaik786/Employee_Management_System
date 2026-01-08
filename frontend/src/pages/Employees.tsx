import { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DataTableSkeleton } from '@/components/common/Skeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { employeesApi } from '@/services/api';
import { Employee, EmployeeFormData, PaginationMeta } from '@/types';
import {
  Plus,
  Search,
  Mail,
  Phone,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Filter,
  Users,
  Briefcase,
  Download,
  MoreVertical,
  UserCircle
} from 'lucide-react';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { CrudModal } from '@/components/modals/CrudModal';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { canChat } from '@/utils/canChat';
import ChatDrawer from '@/components/common/ChatDrawer';
import { staggerContainer, slideUpVariants } from '@/animations/motionVariants';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

      const response = await employeesApi.getAll({
        page: 1,
        limit: 1000,
        sortBy,
        sortOrder
      });

      setEmployees(response.data || []);
      setMeta(response.meta);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      const errorMessage = error.message || 'Failed to fetch employees';
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

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
        fetchAllEmployees();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete employee',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      if (editingEmployee) {
        await employeesApi.update(editingEmployee.id, data);
        toast({
          title: 'Success',
          description: 'Employee updated successfully',
        });
      } else {
        await employeesApi.create(data);
        toast({
          title: 'Success',
          description: 'Employee created successfully',
        });
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      fetchAllEmployees();
    } catch (error: any) {
      throw error;
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openChatWithUser = (employee: Employee) => {
    if (user && canChat(user.role, employee.role)) {
      setChatDrawerOpen(true);
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

  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(emp =>
        (emp.firstName && emp.firstName.toLowerCase().includes(s)) ||
        (emp.lastName && emp.lastName.toLowerCase().includes(s)) ||
        (emp.email && emp.email.toLowerCase().includes(s)) ||
        (emp.department?.name && emp.department.name.toLowerCase().includes(s)) ||
        (emp.position && emp.position.toLowerCase().includes(s))
      );
    }

    if (roleFilter && roleFilter !== 'all') {
      result = result.filter(emp => emp.role === roleFilter);
    }

    if (departmentFilter && departmentFilter !== 'all') {
      result = result.filter(emp =>
        emp.department?.name?.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }

    result.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'first_name': aValue = a.firstName; bValue = b.firstName; break;
        case 'last_name': aValue = a.lastName; bValue = b.lastName; break;
        case 'department': aValue = a.department?.name || ''; bValue = b.department?.name || ''; break;
        case 'position': aValue = a.position || ''; bValue = b.position || ''; break;
        case 'status': aValue = a.status; bValue = b.status; break;
        default: aValue = (a as any)[sortBy] || ''; bValue = (b as any)[sortBy] || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === 'asc' ? ((aValue as any) > (bValue as any) ? 1 : -1) : ((aValue as any) < (bValue as any) ? 1 : -1);
    });

    return result;
  }, [employees, search, roleFilter, departmentFilter, sortBy, sortOrder]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * 8;
    return filteredEmployees.slice(startIndex, startIndex + 8);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / 8);

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(e => e.status === 'ACTIVE').length,
    onLeave: employees.filter(e => e.status === 'ON_LEAVE').length,
  }), [employees]);

  if (authLoading) return <div className="p-8 flex justify-center"><DataTableSkeleton /></div>;
  if (!user) return <div className="p-8 text-center text-rose-500 font-bold">Unauthorized Access</div>;

  if (user.role !== 'ADMIN' && user.role !== 'HR' && user.role !== 'MANAGER') {
    return (
      <div className="p-12 text-center h-[60vh] flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 text-rose-500 shadow-xl shadow-rose-500/5">
          <Trash2 size={40} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Access Denied</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">Your current account role does not have the permissions required to access the team directory.</p>
        <Link to="/app/dashboard">
          <Button variant="outlinePremium" size="lg">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="p-6 lg:p-8 space-y-8"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="Team Directory"
          description="Manage and monitor your organization's talent pool."
          className="bg-header-gradient p-8 rounded-3xl border border-border/30 shadow-premium"
        >
          <div className="flex items-center gap-3">
            <Button variant="outlinePremium" size="sm" className="hidden sm:flex">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="premium" size="sm" onClick={handleCreateEmployee}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </PageHeader>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={slideUpVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-lg shadow-indigo-500/5 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Personnel</p>
                <h3 className="text-2xl font-black mt-0.5">{loading ? '...' : stats.total}</h3>
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-lg shadow-emerald-500/5 group-hover:scale-110 transition-transform">
                <StatusBadge status="ACTIVE" showIcon={false} />
              </div>
              <div className="ml-[-10px]">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Now</p>
                <h3 className="text-2xl font-black mt-0.5">{loading ? '...' : stats.active}</h3>
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 shadow-lg shadow-amber-500/5 group-hover:scale-110 transition-transform">
                <StatusBadge status="ON_LEAVE" showIcon={false} />
              </div>
              <div className="ml-[-10px]">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">On Leave</p>
                <h3 className="text-2xl font-black mt-0.5">{loading ? '...' : stats.onLeave}</h3>
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
        </Card>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={slideUpVariants}>
        <Card className="border-border/40 shadow-premium bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-5">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search by name, email, or position..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 h-12 bg-background/50 border-border/40 focus:border-primary/50 transition-all rounded-xl"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[160px] h-12 bg-background/50 rounded-xl border-border/40 font-medium">
                    <Filter className="mr-2 h-4 w-4 opacity-50" />
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl border border-border/40">
                  <Button
                    variant={sortOrder === 'asc' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-9 px-3 rounded-lg text-xs font-bold"
                    onClick={() => setSortOrder('asc')}
                  >
                    ASC
                  </Button>
                  <Button
                    variant={sortOrder === 'desc' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-9 px-3 rounded-lg text-xs font-bold"
                    onClick={() => setSortOrder('desc')}
                  >
                    DESC
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Employees Table */}
      <motion.div variants={slideUpVariants}>
        <Card className="border-border/30 shadow-premium overflow-hidden bg-card/40 backdrop-blur-sm rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20">
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('first_name')}>
                    Employee {sortBy === 'first_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('position')}>
                    Role & Title {sortBy === 'position' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('department')}>
                    Division {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground text-right pr-10">Acions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin h-10 w-10 border-[3px] border-primary border-t-transparent rounded-full" />
                          <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase">Synchronizing Talent Pool...</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee, idx) => (
                      <motion.tr
                        key={employee.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.04 }}
                        className="group hover:bg-muted/40 transition-all duration-300"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-muted/80 border border-border/50 group-hover:scale-105 transition-transform shadow-sm group-hover:shadow-lg group-hover:shadow-primary/5">
                              {employee.profile_image ? (
                                <img
                                  src={employee.profile_image}
                                  alt=""
                                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent text-primary text-xl font-black">
                                  {employee.firstName[0]}{employee.lastName[0]}
                                </div>
                              )}
                              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium italic">
                                <Mail size={12} className="opacity-60" />
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Briefcase size={13} className="text-primary/60" />
                              <span className="text-sm font-bold text-foreground">{employee.position || 'Strategic Partner'}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] h-5 font-black uppercase tracking-widest bg-background/80 border-primary/10 text-primary/70">
                              {employee.role}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-muted/40 text-[11px] font-black tracking-wider text-muted-foreground border border-border/30 group-hover:bg-primary/5 group-hover:text-primary transition-colors uppercase">
                            {employee.department?.name || 'Central Div'}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={employee.status} />
                        </td>
                        <td className="px-6 py-5 text-right pr-8">
                          <div className="flex items-center justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary active:scale-95 transition-all shadow-sm hover:shadow-md"
                                    onClick={() => openChatWithUser(employee)}
                                  >
                                    <MessageCircle size={18} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="rounded-lg font-bold">Initiate Chat</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted active:scale-95 transition-all">
                                  <MoreVertical size={18} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-2xl glass-panel-dark p-2">
                                <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold" onClick={() => handleEditEmployee(employee)}>
                                  <Edit size={16} className="text-primary" /> Edit Credentials
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold">
                                  <UserCircle size={16} className="text-indigo-500" /> Member Insights
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2 bg-white/10" />
                                <DropdownMenuItem
                                  className="rounded-xl text-rose-500 flex items-center gap-3 p-3 font-bold focus:bg-rose-500/10 focus:text-rose-600"
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                >
                                  <Trash2 size={16} /> Decommission
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-28 text-center">
                        <div className="flex flex-col items-center gap-5">
                          <div className="w-20 h-20 rounded-[2rem] bg-muted/40 flex items-center justify-center text-muted-foreground/30 shadow-inner group">
                            <Search size={40} className="group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-xl font-black text-foreground uppercase tracking-widest">No Intelligence Found</p>
                            <p className="text-sm text-muted-foreground font-medium">We couldn't find any team members matching those parameters.</p>
                          </div>
                          <Button
                            variant="outlinePremium"
                            onClick={() => { setSearch(''); setRoleFilter('all'); setDepartmentFilter('all'); }}
                            className="mt-2"
                          >
                            Reset Directories
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-8 py-5 bg-muted/10 border-t border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Resource Coverage: <span className="text-primary">{filteredEmployees.length}</span> / {employees.length}
              </p>
              <div className="h-4 w-[1px] bg-border/40" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Page: <span className="text-primary">{currentPage}</span> of {totalPages || 1}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/40 disabled:opacity-30"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-border/40 disabled:opacity-30"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0 || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Modals */}
      <CrudModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingEmployee ? 'Update Member Profile' : 'Onboard New Member'}
        size="xl"
      >
        <EmployeeForm
          employee={editingEmployee || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </CrudModal>

      <ChatDrawer
        ref={chatDrawerRef}
        isOpen={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
      />
    </motion.div>
  );
};

export default Employees;