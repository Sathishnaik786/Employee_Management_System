import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import {
  SearchIcon,
  PlusIcon,
  MoreVertical,
  User,
  CheckCircle2,
  Briefcase,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  Target,
  Clock,
  ArrowUpRight,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useEmployees } from '@/hooks/useEmployees';
import { Project, Employee } from '@/types';
import ProjectStatusBadge from '@/components/common/ProjectStatusBadge';
import { ProjectStepForm as ProjectForm } from '@/components/forms/ProjectStepForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { staggerContainer, slideUpVariants } from '@/animations/motionVariants';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { PERMISSIONS } from '@/access/permissions';
import { Can } from '@/access/Can';

import { DataGrid } from '@/components/data-grid/DataGrid';
import { ColumnConfig } from '@/components/data-grid/types';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasPermission, isLoading: authLoading } = useAuth();

  const {
    items: projects,
    meta,
    isLoading: loading,
    handlePageChange,
    handleFilterChange,
    createProject,
    updateProject,
    deleteProject,
    filters
  } = useProjects({ limit: 12 });

  const { items: employees } = useEmployees({ limit: 1000 });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columns: ColumnConfig<Project>[] = [
    {
      id: 'name',
      label: 'Operation Signature',
      sortable: true,
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Briefcase size={16} />
          </div>
          <div>
            <p className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">{row.name}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">{row.project_type?.replace('_', ' ')}</p>
          </div>
        </div>
      )
    },
    {
      id: 'manager',
      label: 'Lead Strategist',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={row.manager?.profile_image} />
            <AvatarFallback className="text-[8px] bg-primary/5 text-primary">{row.manager?.firstName?.[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-bold text-foreground/80">{row.manager?.firstName} {row.manager?.lastName}</span>
        </div>
      )
    },
    {
      id: 'progress',
      label: 'System Progress',
      accessor: (row) => {
        const tasks = row.project_tasks || [];
        const doneTasks = tasks.filter(t => t.status === 'DONE').length;
        const progress = tasks.length > 0 ? (doneTasks / tasks.length) * 100 : 0;
        return (
          <div className="w-full max-w-[120px] space-y-1.5">
            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground">
              <span>Sync</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1 bg-muted/30" />
          </div>
        );
      }
    },
    {
      id: 'members',
      label: 'Unit Composition',
      accessor: (row) => (
        <div className="flex -space-x-1.5">
          {row.project_members?.slice(0, 3).map((member, i) => (
            <Avatar key={i} className="h-5 w-5 border border-background ring-1 ring-border/30">
              <AvatarImage src={member.employee?.profile_image} />
              <AvatarFallback className="text-[6px] bg-muted text-muted-foreground">{member.employee?.firstName?.[0]}</AvatarFallback>
            </Avatar>
          ))}
          {row.project_members?.length > 3 && (
            <div className="h-5 w-5 rounded-full bg-muted border border-background flex items-center justify-center text-[6px] font-black text-muted-foreground">
              +{row.project_members.length - 3}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'status',
      label: 'Archive Status',
      accessor: (row) => <ProjectStatusBadge status={row.status} />
    },
    {
      id: 'actions',
      label: 'Actions',
      className: "text-right pr-6",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted active:scale-95 transition-all">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl glass-panel-dark border-white/10 p-1">
              <DropdownMenuItem className="rounded-lg gap-2 font-bold focus:bg-primary/20" onClick={(e) => { e.stopPropagation(); setEditingProject(row); setIsEditDialogOpen(true); }}>
                <Target size={14} className="text-primary" /> Recalibrate
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="rounded-lg gap-2 font-bold text-rose-400 focus:bg-rose-500/10 focus:text-rose-500" onClick={(e) => { e.stopPropagation(); handleDeleteProject(row.id); }}>
                <Trash2 size={14} /> Decommission
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navigate(`/app/projects/${row.id}`)}>
            <ChevronRight size={16} />
          </Button>
        </div>
      )
    }
  ];

  const handleCreateProject = async (data: any) => {
    await createProject(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateProject = async (data: any) => {
    if (!editingProject) return;
    await updateProject({ id: editingProject.id, data });
    setIsEditDialogOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (!hasPermission(PERMISSIONS.PROJECTS_DELETE)) return;
    if (!window.confirm('Commence project decommissioning? This action is irreversible.')) return;
    await deleteProject(id);
  };

  const handleBulkDecommission = async (ids: string[]) => {
    if (window.confirm(`Decommission ${ids.length} projects from the active grid? This action is fatal.`)) {
      for (const id of ids) {
        await deleteProject(id);
      }
      setSelectedIds([]);
    }
  };

  const stats = useMemo(() => ({
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
  }), [projects]);

  if (authLoading) return <div className="p-12 flex justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="p-6 lg:p-8 space-y-8"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="Project Intelligence"
          description="Orchestrate organizational initiatives and track milestone delivery."
          className="bg-header-gradient p-8 rounded-3xl border border-border/30 shadow-premium"
        >
          <div className="flex items-center gap-3">
            <Can permission={PERMISSIONS.PROJECTS_CREATE}>
              <Button variant="premium" size="sm" onClick={() => setIsCreateDialogOpen(true)} className="shadow-lg shadow-primary/20">
                <PlusIcon size={16} className="mr-2" /> INITIATE PROJECT
              </Button>
            </Can>
          </div>
        </PageHeader>
      </motion.div>

      {/* Analytics Overview */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/30 bg-card/60 backdrop-blur-md shadow-premium rounded-3xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Initiatives</p>
                <h3 className="text-3xl font-black mt-1">{loading ? '...' : meta.total}</h3>
              </div>
              <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/30 bg-card/60 backdrop-blur-md shadow-premium rounded-3xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">In Operation</p>
                <h3 className="text-3xl font-black mt-1 text-amber-500">{loading ? '...' : stats.inProgress}</h3>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/30 bg-card/60 backdrop-blur-md shadow-premium rounded-3xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Successful Delivery</p>
                <h3 className="text-3xl font-black mt-1 text-emerald-500">{loading ? '...' : stats.completed}</h3>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search & Filtering */}
      <motion.div variants={slideUpVariants} className="max-w-md">
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Filter projects by signature..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="pl-12 h-12 bg-background/50 backdrop-blur-sm border-border/30 focus:border-primary/40 rounded-xl transition-all"
          />
        </div>
      </motion.div>

      {/* ERP Data Grid Implementation */}
      <motion.div variants={slideUpVariants}>
        <DataGrid
          title="Projects"
          columns={columns}
          data={projects}
          isLoading={loading}
          getRowId={(row) => row.id}
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
          onSortChange={() => { }} // Hook not yet supporting server-side sort triggers
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          bulkActions={[
            {
              label: 'Decommission Selected',
              icon: <Trash2 size={10} />,
              variant: 'destructive',
              permission: PERMISSIONS.PROJECTS_DELETE,
              requireConfirmation: true,
              onClick: handleBulkDecommission
            }
          ]}
        />
      </motion.div>

      {/* Project Form Dialogs */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl glass-panel-dark border-white/10 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="text-2xl font-black uppercase tracking-widest text-primary flex items-center gap-3">
              <PlusIcon /> Initiative Deployment
            </DialogTitle>
          </DialogHeader>
          <div className="p-8">
            <ProjectForm
              employees={employees}
              onSubmit={handleCreateProject}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl glass-panel-dark border-white/10 rounded-[3rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-10 pb-4">
            <DialogTitle className="text-2xl font-black uppercase tracking-[0.2em] text-primary flex items-center gap-4">
              <ArrowUpRight size={28} /> Parameter Calibration
            </DialogTitle>
          </DialogHeader>
          <div className="px-10 pb-10">
            {editingProject && (
              <ProjectForm
                initialData={editingProject || undefined}
                employees={employees}
                onSubmit={handleUpdateProject}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingProject(null);
                }}
              />
            )}

          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProjectsPage;