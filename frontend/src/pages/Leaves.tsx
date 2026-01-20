import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeaves } from '@/hooks/useLeaves';
import { PERMISSIONS } from '@/access/permissions';
import { Can } from '@/access/Can';
import { LeaveRequest, LeaveFormData } from '@/types';
import { Plus, Check, X, Calendar, ClipboardList, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { LeaveForm } from '@/components/forms/LeaveForm';
import { CrudModal } from '@/components/modals/CrudModal';
import { useAuth } from '@/contexts/AuthContext';
import { staggerContainer, slideUpVariants } from '@/animations/motionVariants';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { DataGrid } from '@/components/data-grid/DataGrid';
import { ColumnConfig } from '@/components/data-grid/types';

export default function Leaves() {
  const { user, hasPermission, isLoading: authLoading } = useAuth();
  const {
    items: leaves,
    meta,
    isLoading: loading,
    handlePageChange,
    approveLeave,
    rejectLeave,
    createLeave
  } = useLeaves({ limit: 8 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columns: ColumnConfig<LeaveRequest>[] = [
    {
      id: 'employee',
      label: 'Employee',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-black text-xs shadow-inner">
            {row.employee?.firstName[0]}{row.employee?.lastName[0]}
          </div>
          <span className="font-bold">{row.employee?.firstName} {row.employee?.lastName}</span>
        </div>
      )
    },
    {
      id: 'leaveType',
      label: 'Type',
      accessor: (row) => (
        <Badge variant="secondary" className="bg-muted/50 rounded-lg text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
          {row.leaveType?.name}
        </Badge>
      )
    },
    {
      id: 'dates',
      label: 'Duration',
      accessor: (row) => (
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground whitespace-nowrap">
          <Clock size={12} className="text-primary/60" />
          {row.startDate} - {row.endDate}
        </div>
      )
    },
    {
      id: 'days',
      label: 'Days',
      accessor: (row) => (
        <span className="text-xs font-black text-primary/80 uppercase tracking-widest">{row.totalDays} Days</span>
      )
    },
    {
      id: 'reason',
      label: 'Reason',
      accessor: (row) => (
        <div className="text-xs text-muted-foreground max-w-[200px] truncate italic">
          "{row.reason}"
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
      className: "text-right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'PENDING' && (
            <Can permission={PERMISSIONS.LEAVES_APPROVE}>
              <div className="flex gap-1.5">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApproveLeave(row.id);
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 text-rose-600 border-rose-500/20 hover:bg-rose-500/10 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRejectLeave(row.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Can>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <ChevronRight size={16} />
          </Button>
        </div>
      )
    }
  ];

  const handleApplyLeave = () => {
    setEditingLeave(null);
    setIsModalOpen(true);
  };

  const handleApproveLeave = async (id: string) => {
    await approveLeave(id);
  };

  const handleRejectLeave = async (id: string) => {
    await rejectLeave(id);
  };

  const handleFormSubmit = async (data: LeaveFormData) => {
    await createLeave({
      ...data,
      employeeId: user?.employeeId,
      status: 'PENDING'
    });
    setIsModalOpen(false);
  };

  const stats = useMemo(() => ({
    pending: leaves.filter(l => l.status === 'PENDING').length,
    approved: leaves.filter(l => l.status === 'APPROVED').length,
    rejected: leaves.filter(l => l.status === 'REJECTED').length,
  }), [leaves]);

  if (authLoading) return <div className="p-12 flex justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <div className="p-12 text-center text-rose-500 font-bold">Unauthorized</div>;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="p-6 lg:p-8 space-y-8"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="Time-Off Requests"
          description="Manage absence requests and track leave balances."
          className="bg-header-gradient p-8 rounded-3xl border border-border/30 shadow-premium"
        >
          <Button variant="premium" onClick={handleApplyLeave}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </PageHeader>
      </motion.div>

      <CrudModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingLeave ? 'Review Request' : 'Time-Off Application'}
        size="lg"
      >
        <LeaveForm
          leave={editingLeave || undefined}
          employeeId={user?.employeeId}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </CrudModal>

      {/* Stats Cards */}
      <motion.div
        variants={slideUpVariants}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card className="border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-transparent relative overflow-hidden group">
          <CardContent className="pt-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pending Review</p>
                <div className="text-3xl font-black mt-2 text-amber-600">{stats.pending}</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl" />
        </Card>

        <Card className="border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-transparent relative overflow-hidden group">
          <CardContent className="pt-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Approved Requests</p>
                <div className="text-3xl font-black mt-2 text-emerald-600">{stats.approved}</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                <Check size={24} />
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl" />
        </Card>

        <Card className="border-rose-500/10 bg-gradient-to-br from-rose-500/5 to-transparent relative overflow-hidden group">
          <CardContent className="pt-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Declined</p>
                <div className="text-3xl font-black mt-2 text-rose-600">{stats.rejected}</div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 group-hover:scale-110 transition-transform">
                <X size={24} />
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/5 rounded-full blur-2xl" />
        </Card>
      </motion.div>

      <motion.div variants={slideUpVariants}>
        <DataGrid
          title="Leaves"
          columns={columns}
          data={leaves}
          isLoading={loading}
          getRowId={(row) => row.id}
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
          onSortChange={() => { }} // Not implemented in leaves hook yet
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          bulkActions={[
            {
              label: 'Approve Selected',
              icon: <Check size={10} />,
              variant: 'premium',
              permission: PERMISSIONS.LEAVES_APPROVE,
              onClick: async (ids) => {
                for (const id of ids) await approveLeave(id);
                setSelectedIds([]);
              }
            },
            {
              label: 'Reject Selected',
              icon: <X size={10} />,
              variant: 'outline',
              permission: PERMISSIONS.LEAVES_APPROVE,
              onClick: async (ids) => {
                for (const id of ids) await rejectLeave(id);
                setSelectedIds([]);
              }
            }
          ]}
        />
      </motion.div>
    </motion.div>
  );
}