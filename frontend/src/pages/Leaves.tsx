import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { leavesApi } from '@/services/api';
import { LeaveRequest, LeaveFormData } from '@/types';
import { Plus, Check, X, Calendar, ClipboardList, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { LeaveForm } from '@/components/forms/LeaveForm';
import { CrudModal } from '@/components/modals/CrudModal';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { staggerContainer, slideUpVariants, scaleInVariants } from '@/animations/motionVariants';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function Leaves() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leavesApi.getAll();
      setLeaves(response.data || []);
    } catch (error: any) {
      console.error('Error fetching leaves:', error);
      const errorMessage = error.message || 'Failed to fetch leave requests';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = () => {
    setEditingLeave(null);
    setIsModalOpen(true);
  };

  const handleApproveLeave = async (leaveId: string) => {
    try {
      await leavesApi.approve(leaveId, user?.id || '', 'Leave approved');
      toast({
        title: 'Success',
        description: 'Leave request approved',
      });
      fetchLeaves();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve leave request',
        variant: 'destructive',
      });
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    try {
      await leavesApi.reject(leaveId, user?.id || '', 'Leave rejected');
      toast({
        title: 'Success',
        description: 'Leave request rejected',
      });
      fetchLeaves();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject leave request',
        variant: 'destructive',
      });
    }
  };

  const handleFormSubmit = async (data: LeaveFormData) => {
    try {
      if (editingLeave) {
        // Handle update if implemented
      } else {
        await leavesApi.apply({
          employeeId: user?.employeeId || '',
          leaveTypeId: data.leaveTypeId,
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason,
        });
      }
      setIsModalOpen(false);
      fetchLeaves();
    } catch (error: any) {
      throw error;
    }
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
        <Card className="border-border/30 shadow-premium overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl">
          <CardHeader className="px-8 py-6 border-b border-border/20 bg-muted/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                <ClipboardList size={20} className="text-primary" />
                Request History
              </CardTitle>
              <Badge variant="outline" className="bg-background/50">{leaves.length} Total</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/20">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Synchronizing...</p>
                  </div>
                ) : leaves.length > 0 ? (
                  leaves.map((leave, idx) => (
                    <motion.div
                      key={leave.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-muted/30 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                          <Calendar size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-foreground group-hover:text-primary transition-colors">
                            {leave.employee?.firstName} {leave.employee?.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                            <Badge variant="secondary" className="bg-muted/50 rounded-lg">{leave.leaveType?.name}</Badge>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {leave.startDate} to {leave.endDate}
                            </span>
                            <span className="text-primary/70">({leave.totalDays} Days)</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 bg-muted/30 p-2 rounded-lg border border-border/10">
                            <AlertCircle size={10} className="inline mr-1 opacity-50" />
                            {leave.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                        <StatusBadge status={leave.status} />

                        {leave.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'MANAGER' || user.role === 'HR') && (
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outlinePremium"
                              className="h-10 w-10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10 shadow-sm"
                              onClick={() => handleApproveLeave(leave.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-10 w-10 text-rose-600 border-rose-500/20 hover:bg-rose-500/10 shadow-sm"
                              onClick={() => handleRejectLeave(leave.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary group/btn h-10 w-10">
                          <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-20 text-center">
                    <div className="w-20 h-20 bg-muted/40 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted-foreground/30 shadow-inner">
                      <ClipboardList size={40} />
                    </div>
                    <p className="text-xl font-black text-foreground uppercase tracking-widest">No Active Requests</p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">There are currently no leave requests in the queue. Everything is handled.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}