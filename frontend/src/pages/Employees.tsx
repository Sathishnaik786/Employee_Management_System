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
import { employeesApi } from '@/services/api'; // Temporary during migration
import { Employee, EmployeeFormData } from '@/types';
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
import { useAuth } from '@/contexts/AuthContext';
import { useEmployees } from '@/hooks/useEmployees';
import { canChat } from '@/utils/canChat';
import { ChatDrawer } from '@/components/common/ChatDrawer';
import { staggerContainer, slideUpVariants } from '@/animations/motionVariants';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { PERMISSIONS } from '@/access/permissions';
import { Can } from '@/access/Can';

import { DataGrid } from '@/components/data-grid/DataGrid';
import { ColumnConfig } from '@/components/data-grid/types';

const Employees = () => {
  const { user, hasPermission, isLoading: authLoading } = useAuth();
  const {
    items: employees,
    meta,
    isLoading: loading,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    sort,
    filters,
    deleteEmployee,
    createEmployee,
    updateEmployee,
  } = useEmployees({ limit: 8 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const chatDrawerRef = useRef<any>(null);

  const columns: ColumnConfig<Employee>[] = [
    {
      id: 'employee',
      label: 'Employee',
      sortable: true,
      accessor: (row) => (
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-muted/80 border border-border/50 group-hover:scale-105 transition-transform shadow-sm">
            {row.profile_image ? (
              <img src={row.profile_image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent text-primary text-sm font-black">
                {row.firstName[0]}{row.lastName[0]}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5 font-medium italic">
              <Mail size={10} className="opacity-60" />
              {row.email}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'position',
      label: 'Role & Title',
      sortable: true,
      accessor: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Briefcase size={12} className="text-primary/60" />
            <span className="text-xs font-bold text-foreground">{row.position || 'Strategic Partner'}</span>
          </div>
          <Badge variant="outline" className="text-[9px] h-4 font-black uppercase tracking-widest bg-background/80 border-primary/10 text-primary/70">
            {row.role}
          </Badge>
        </div>
      )
    },
    {
      id: 'department',
      label: 'Division',
      sortable: true,
      accessor: (row) => (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted/40 text-[10px] font-black tracking-wider text-muted-foreground border border-border/30 uppercase">
          {row.department?.name || 'Central Div'}
        </div>
      )
    },
    {
      id: 'status',
      label: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />
    },
    {
      id: 'actions',
      label: 'Actions',
      headerClassName: "text-right pr-10",
      className: "text-right pr-8",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary active:scale-95 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    openChatWithUser(row);
                  }}
                >
                  <MessageCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-lg font-bold">Initiate Chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted active:scale-95 transition-all">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-2xl glass-panel-dark p-2">
              <Can permission={PERMISSIONS.EMPLOYEES_UPDATE}>
                <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold" onClick={() => handleEditEmployee(row)}>
                  <Edit size={16} className="text-primary" /> Edit Credentials
                </DropdownMenuItem>
              </Can>
              <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 font-bold">
                <UserCircle size={16} className="text-indigo-500" /> Member Insights
              </DropdownMenuItem>
              <Can permission={PERMISSIONS.EMPLOYEES_DELETE}>
                <>
                  <DropdownMenuSeparator className="my-2 bg-white/10" />
                  <DropdownMenuItem
                    className="rounded-xl text-rose-500 flex items-center gap-3 p-3 font-bold focus:bg-rose-500/10 focus:text-rose-600"
                    onClick={() => handleDeleteEmployee(row.id)}
                  >
                    <Trash2 size={16} /> Decommission
                  </DropdownMenuItem>
                </>
              </Can>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!hasPermission(PERMISSIONS.EMPLOYEES_DELETE)) return;
    if (window.confirm('Are you absolutely sure you want to decommission this member?')) {
      await deleteEmployee(employeeId);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (window.confirm(`Decommission ${ids.length} members from the architecture? This action cannot be undone.`)) {
      for (const id of ids) {
        await deleteEmployee(id);
      }
      setSelectedIds([]);
    }
  };

  const handleFormSubmit = async (data: EmployeeFormData) => {
    if (editingEmployee) {
      await updateEmployee({ id: editingEmployee.id, data });
    } else {
      await createEmployee(data);
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const openChatWithUser = (employee: Employee) => {
    if (user && canChat(user.role, employee.role)) {
      setChatDrawerOpen(true);
      setTimeout(() => {
        if (chatDrawerRef.current?.openChatWithUser) {
          chatDrawerRef.current.openChatWithUser({
            id: employee.userId || employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            role: employee.role
          });
        }
      }, 100);
    }
  };

  if (authLoading) return <div className="p-8 flex justify-center"><DataTableSkeleton /></div>;
  if (!user) return <div className="p-8 text-center text-rose-500 font-bold">Unauthorized Access</div>;

  if (!hasPermission(PERMISSIONS.EMPLOYEES_VIEW)) {
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
            <Can permission={PERMISSIONS.EMPLOYEES_CREATE}>
              <Button variant="premium" size="sm" onClick={handleCreateEmployee}>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </Can>
          </div>
        </PageHeader>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-lg shadow-indigo-500/5 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Personnel</p>
                <h3 className="text-2xl font-black mt-0.5">{loading ? '...' : meta.total}</h3>
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-lg shadow-emerald-500/5 group-hover:scale-110 transition-transform">
                <UserCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Rate</p>
                <h3 className="text-2xl font-black mt-0.5">94.2%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10 overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 shadow-lg shadow-amber-500/5 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Departments</p>
                <h3 className="text-2xl font-black mt-0.5">12</h3>
              </div>
            </div>
          </CardContent>
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
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="pl-11 h-12 bg-background/50 border-border/40 focus:border-primary/50 transition-all rounded-xl"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={filters.role || 'all'} onValueChange={(val) => handleFilterChange({ role: val === 'all' ? undefined : val })}>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ERP Data Grid Implementation */}
      <motion.div variants={slideUpVariants}>
        <DataGrid
          title="Employees"
          columns={columns}
          data={employees}
          isLoading={loading}
          getRowId={(row) => row.id}
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
          sortBy={sort.sortBy}
          sortOrder={sort.sortOrder}
          onSortChange={handleSortChange}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          bulkActions={[
            {
              label: 'Decommission Selected',
              icon: <Trash2 size={10} />,
              variant: 'destructive',
              permission: PERMISSIONS.EMPLOYEES_DELETE,
              requireConfirmation: true,
              confirmationText: 'Permanently decommission selected members?',
              onClick: handleBulkDelete
            }
          ]}
        />
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