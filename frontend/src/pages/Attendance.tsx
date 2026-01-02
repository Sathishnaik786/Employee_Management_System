import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { attendanceApi } from '@/services/api';
import { Attendance } from '@/types';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AttendancePage = () => {
  // const { user } = useAuth();
  // const [attendance, setAttendance] = useState<Attendance[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Removed debug logs
  }, [user, attendance, loading, error]);
  
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error when fetching
        const response = await attendanceApi.getReport();
        setAttendance(response.data || []);
      } catch (error: any) {
        console.error('Error fetching attendance:', error);
        const errorMessage = error.message || 'Failed to fetch attendance data';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendance();
  }, []);

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

  if (loading) {
    return (
      <>
        <PageHeader title="Attendance" description="Track daily attendance">
          <Button disabled><LogIn className="h-4 w-4 mr-2" />Check In</Button>
          <Button variant="outline" disabled><LogOut className="h-4 w-4 mr-2" />Check Out</Button>
        </PageHeader>
        <div className="p-4">Loading...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Attendance" description="Track daily attendance">
          <Button><LogIn className="h-4 w-4 mr-2" />Check In</Button>
          <Button variant="outline"><LogOut className="h-4 w-4 mr-2" />Check Out</Button>
        </PageHeader>
        <div className="p-4 text-red-500">
          Error: {error}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Attendance" description="Track daily attendance">
        <Button><LogIn className="h-4 w-4 mr-2" />Check In</Button>
        <Button variant="outline"><LogOut className="h-4 w-4 mr-2" />Check Out</Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-success">{attendance.filter(a => a.status === 'PRESENT').length}</div><p className="text-sm text-muted-foreground">Present</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-warning">{attendance.filter(a => a.status === 'LATE').length}</div><p className="text-sm text-muted-foreground">Late</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-info">{attendance.filter(a => a.status === 'ON_LEAVE').length}</div><p className="text-sm text-muted-foreground">On Leave</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-destructive">{attendance.filter(a => a.status === 'ABSENT').length}</div><p className="text-sm text-muted-foreground">Absent</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Today's Records</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendance ? (
              attendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback>{record.employee?.firstName?.[0]}{record.employee?.lastName?.[0]}</AvatarFallback></Avatar>
                    <div><p className="font-medium">{record.employee?.firstName} {record.employee?.lastName}</p><p className="text-xs text-muted-foreground">{record.checkIn && `In: ${record.checkIn}`}{record.checkOut && ` • Out: ${record.checkOut}`}</p></div>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No attendance records found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default AttendancePage;