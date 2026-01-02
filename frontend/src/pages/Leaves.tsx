import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { leavesApi } from '@/services/api';
import { LeaveRequest, LeaveFormData } from '@/types';
import { Plus, Check, X } from 'lucide-react';
import { LeaveForm } from '@/components/forms/LeaveForm';
import { CrudModal } from '@/components/modals/CrudModal';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Leaves() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);

  useEffect(() => {
    console.log('USER:', user);
    console.log('API DATA: Leaves data:', leaves);
    console.log('LOADING:', loading);
    console.log('ERROR:', error);
  }, [user, leaves, loading, error]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error when fetching
      const response = await leavesApi.getAll();
      console.log('API DATA: Leaves response:', response);
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
      fetchLeaves(); // Refresh the list
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
      fetchLeaves(); // Refresh the list
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
        // For approval/rejection, we handle it separately
        // This is for editing existing leave requests (if needed)
        // await leavesApi.update(editingLeave.id, data);
      } else {
        // Apply for new leave
        await leavesApi.apply({
          employeeId: user?.employeeId || '',
          leaveTypeId: data.leaveTypeId,
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason,
        });
      }
      setIsModalOpen(false);
      fetchLeaves(); // Refresh the list
    } catch (error: any) {
      throw error;
    }
  };

  if (authLoading) {
    return (
      <>
        <PageHeader title="Leave Management" description="Manage leave requests">
          <Button disabled><Plus className="h-4 w-4 mr-2" />Apply Leave</Button>
        </PageHeader>
        <div className="p-4">Initializing session…</div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader title="Leave Management" description="Manage leave requests">
          <Button><Plus className="h-4 w-4 mr-2" />Apply Leave</Button>
        </PageHeader>
        <div className="p-4">Unauthorized</div>
      </>
    );
  }

  // Safe rendering patterns
  if (loading) {
    return (
      <>
        <PageHeader title="Leave Management" description="Manage leave requests">
          <Button onClick={handleApplyLeave} disabled><Plus className="h-4 w-4 mr-2" />Apply Leave</Button>
        </PageHeader>
        <div className="p-4">Loading...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Leave Management" description="Manage leave requests">
          <Button onClick={handleApplyLeave}><Plus className="h-4 w-4 mr-2" />Apply Leave</Button>
        </PageHeader>
        <div className="p-4 text-red-500">
          Error: {error}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Leave Management" description="Manage leave requests">
        <Button onClick={handleApplyLeave}><Plus className="h-4 w-4 mr-2" />Apply Leave</Button>
      </PageHeader>
      
      <CrudModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingLeave ? 'Review Leave Request' : 'Apply for Leave'}
        size="lg"
      >
        <LeaveForm
          leave={editingLeave || undefined}
          employeeId={user?.employeeId}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </CrudModal>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{leaves.filter(l => l.status === 'PENDING').length}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{leaves.filter(l => l.status === 'APPROVED').length}</div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{leaves.filter(l => l.status === 'REJECTED').length}</div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Leave Requests</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaves ? (
              leaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{leave.employee?.firstName} {leave.employee?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{leave.leaveType?.name} • {leave.startDate} to {leave.endDate} ({leave.totalDays} days)</p>
                    <p className="text-sm mt-1">{leave.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={leave.status} />
                    {leave.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-success"
                          onClick={() => handleApproveLeave(leave.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive"
                          onClick={() => handleRejectLeave(leave.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No leave requests found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}