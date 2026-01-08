import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { departmentsApi, authApi, employeesApi } from '@/services/api';
import { Department, Employee, Role } from '@/types';
import {
  UserPlus,
  ShieldCheck,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  UserCog,
  Mail,
  Key,
  Activity,
  Search,
  ChevronRight,
  AtSign,
  Briefcase,
  Loader2
} from 'lucide-react';
import { staggerContainer, slideUpVariants } from '@/animations/motionVariants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDepartments = async () => {
    try {
      const deptList = await departmentsApi.getAll();
      setDepartments(deptList || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      setUsersLoading(true);
      const response = await employeesApi.getAll({ limit: 100 });
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({ title: 'Error', description: 'Failed to synchronize user directory', variant: 'destructive' });
      setEmployees([]);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDepartments();
      fetchEmployees();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateRole = async () => {
    if (!selectedEmployeeId || !newRole) return;
    try {
      await employeesApi.update(selectedEmployeeId, { role: newRole as Role });
      toast({ title: 'Success', description: 'Permissions recalibrated successfully' });
      setShowRoleUpdateModal(false);
      fetchEmployees();
    } catch (error) {
      toast({ title: 'Error', description: 'Recalibration failed', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (employeeId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await employeesApi.update(employeeId, { status: newStatus });
      toast({ title: 'Success', description: `User status set to ${newStatus}` });
      fetchEmployees();
    } catch (error) {
      toast({ title: 'Error', description: 'Status update failed', variant: 'destructive' });
    }
  };

  const handleRemove = async (employeeId: string) => {
    if (!window.confirm('Commence user decommissioning? This action is irreversible.')) return;
    try {
      await employeesApi.delete(employeeId);
      toast({ title: 'Success', description: 'Identity record decommissioned' });
      fetchEmployees();
    } catch (error) {
      toast({ title: 'Error', description: 'Decommissioning failed', variant: 'destructive' });
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
      });
      if (response.success) {
        toast({ title: 'Success', description: `Identity created for ${formData.email}` });
        setFormData({ email: '', role: 'EMPLOYEE', departmentId: '' });
        fetchEmployees();
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Identity creation failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return employees;
    const s = searchTerm.toLowerCase();
    return employees.filter(e =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(s) ||
      e.email?.toLowerCase().includes(s) ||
      e.position?.toLowerCase().includes(s)
    );
  }, [employees, searchTerm]);

  if (authLoading) return <div className="p-12 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="p-6 lg:p-8 space-y-8"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="Executive Administration"
          description="Global user orchestration and permission management system."
          className="bg-header-gradient p-8 rounded-3xl border border-border/30 shadow-premium"
        >
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black tracking-widest px-3 py-1">ADMINISTRATIVE ACCESS GRANTED</Badge>
        </PageHeader>
      </motion.div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Creation Form */}
        <motion.div variants={slideUpVariants} className="lg:col-span-1">
          <Card className="border-border/30 shadow-premium bg-white/40 backdrop-blur-md rounded-3xl overflow-hidden sticky top-24">
            <CardHeader className="bg-muted/10 border-b border-border/20 px-8 py-6">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                <UserPlus size={20} className="text-primary" />
                Initiate Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Universal Email</Label>
                  <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="user@yvitechnologies.com"
                      className="pl-12 h-12 bg-background/50 rounded-xl border-border/30 focus:bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Tier</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange('role', value)}
                  >
                    <SelectTrigger className="h-12 bg-background/50 rounded-xl border-border/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="ADMIN">ADMIN (Full Access)</SelectItem>
                      <SelectItem value="HR">HR (Management)</SelectItem>
                      <SelectItem value="MANAGER">MANAGER (Supervisory)</SelectItem>
                      <SelectItem value="EMPLOYEE">EMPLOYEE (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Deployment Division</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => handleSelectChange('departmentId', value)}
                  >
                    <SelectTrigger className="h-12 bg-background/50 rounded-xl border-border/30">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 text-sm font-black uppercase tracking-widest">
                  {loading ? <Loader2 className="animate-spin" /> : 'Deploy Identity'}
                </Button>
              </form>

              <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ShieldCheck size={14} /> Security Protocol
                </p>
                <ul className="space-y-2 text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
                  <li>• Identities must be globally unique</li>
                  <li>• Tier assignments grant immediate scope</li>
                  <li>• Removal is documented in audit logs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* User List */}
        <motion.div variants={slideUpVariants} className="lg:col-span-2 space-y-6">
          <Card className="border-border/30 shadow-premium bg-white/40 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                <Users size={20} className="text-primary" />
                Directory Control
              </CardTitle>
              <div className="relative w-full md:w-80 group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search by name, role or position..."
                  className="h-11 pl-12 rounded-xl bg-background/50 border-border/30 focus:bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/20 border-b border-border/10">
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Personnel</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Access Tier</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Division</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right pr-12">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  <AnimatePresence mode="popLayout">
                    {usersLoading ? (
                      <tr>
                        <td colSpan={4} className="p-20 text-center">
                          <div className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Fetching records...</p>
                        </td>
                      </tr>
                    ) : filteredUsers.map((emp, idx) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group hover:bg-muted/30 transition-all font-medium"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-11 w-11 rounded-2xl border border-border/40 shadow-sm group-hover:scale-110 transition-transform">
                              <AvatarImage src={emp.profile_image} />
                              <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                                {emp.firstName?.[0]}{emp.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5">
                              <p className="text-sm font-black group-hover:text-primary transition-colors">{emp.firstName} {emp.lastName}</p>
                              <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 uppercase tracking-tighter italic">
                                <Mail size={10} className="opacity-50" /> {emp.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <Badge className={cn(
                            "font-black text-[10px] tracking-widest rounded-lg px-2.5 py-1 uppercase",
                            emp.role === 'ADMIN' ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                              emp.role === 'HR' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                emp.role === 'MANAGER' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                  "bg-slate-500/10 text-slate-600 border-slate-500/20"
                          )}>
                            {emp.role}
                          </Badge>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">{emp.department?.name || 'CENTRAL'}</span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">{emp.position || 'INITIATED'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right pr-10">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted active:scale-95 transition-all">
                                <MoreVertical size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 glass-panel-dark rounded-2xl p-2 shadow-2xl border-white/10">
                              <DropdownMenuItem
                                className="p-3 rounded-xl gap-3 font-bold cursor-pointer"
                                onClick={() => { setSelectedEmployeeId(emp.id); setNewRole(emp.role); setShowRoleUpdateModal(true); }}
                              >
                                <UserCog size={16} className="text-indigo-400" /> Adjust Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="p-3 rounded-xl gap-3 font-bold cursor-pointer"
                                onClick={() => handleToggleStatus(emp.id, emp.status)}
                              >
                                <Activity size={16} className={emp.status === 'ACTIVE' ? "text-amber-400" : "text-emerald-400"} />
                                {emp.status === 'ACTIVE' ? 'Suspend Identity' : 'Restore Identity'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem
                                className="p-3 rounded-xl gap-3 font-bold text-rose-400 focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer"
                                onClick={() => handleRemove(emp.id)}
                              >
                                <Trash2 size={16} /> Decommission Record
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

      <Dialog open={showRoleUpdateModal} onOpenChange={setShowRoleUpdateModal}>
        <DialogContent className="max-w-md glass-panel-dark border-white/10 rounded-[2rem] p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-black uppercase tracking-widest text-primary flex items-center gap-3">
              <ShieldCheck /> Tier Recalibration
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest text-center">Select New Security Clearance Level</p>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold">
                <SelectValue placeholder="Select Identity Level" />
              </SelectTrigger>
              <SelectContent className="glass-panel-dark border-white/10 rounded-2xl text-white">
                <SelectItem value="ADMIN" className="p-3 font-bold">ADMIN (Global Scope)</SelectItem>
                <SelectItem value="HR" className="p-3 font-bold">HR (Management Access)</SelectItem>
                <SelectItem value="MANAGER" className="p-3 font-bold">MANAGER (Unit Supervisory)</SelectItem>
                <SelectItem value="EMPLOYEE" className="p-3 font-bold">EMPLOYEE (Standard Operations)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="ghost" className="rounded-xl font-bold uppercase tracking-widest text-white/60 hover:text-white" onClick={() => setShowRoleUpdateModal(false)}>Abort</Button>
            <Button className="bg-primary rounded-xl font-black uppercase tracking-widest px-8" onClick={handleUpdateRole}>Confirm Recalibration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminUsers;