import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { AnalyticsStatCard } from '@/components/dashboard/AnalyticsStatCard';
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CardSkeleton } from '@/components/common/Skeletons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { employeesApi, attendanceApi, leavesApi, reportsApi, analyticsApi } from '@/services/api';
import { Employee, Attendance, LeaveRequest, AttendanceReport, AdminOverviewData, ManagerTeamProgressData, HRWorkforceData, EmployeeSelfData } from '@/types';
import { Users, UserCheck, UserX, Clock, Calendar, TrendingUp, Briefcase, ClipboardList, User, UserRound, UsersRound, BarChart3, BarChartHorizontal, TrendingDown, CalendarDays, Users2 } from 'lucide-react';

interface DashboardData {
  employees: Employee[];
  attendance: Attendance[];
  leaveRequests: LeaveRequest[];

  attendanceReport: AttendanceReport | null;
  analyticsData?: {
    adminOverview?: AdminOverviewData;
    managerProgress?: ManagerTeamProgressData;
    hrWorkforce?: HRWorkforceData;
    employeeSelf?: EmployeeSelfData;
  };
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get data individually to handle permission errors
      let employees, attendanceReport, leaveRequests;
      
      try {
        employees = await employeesApi.getAll({ limit: 100 });
      } catch (err) {
        console.error('Error loading employees:', err);
        employees = { data: [], meta: { page: 1, limit: 100, total: 0, totalPages: 1 } };
      }
      
      try {
        attendanceReport = await reportsApi.getAttendanceReport();
      } catch (err) {
        console.error('Error loading attendance report:', err);
        attendanceReport = { success: true, data: null };
      }
      
      try {
        leaveRequests = await leavesApi.getAll({ status: 'PENDING' });
      } catch (err) {
        console.error('Error loading leave requests:', err);
        leaveRequests = { success: true, data: [] };
      }

      // Get analytics data based on user role
      let analyticsData: {
        adminOverview?: AdminOverviewData;
        managerProgress?: ManagerTeamProgressData;
        hrWorkforce?: HRWorkforceData;
        employeeSelf?: EmployeeSelfData;
      } = {};
      if (user?.role) {
        try {
          if (user.role === 'ADMIN') {
            const adminData = await analyticsApi.getAdminOverview();
            analyticsData.adminOverview = adminData.data;
          } else if (user.role === 'MANAGER') {
            const managerData = await analyticsApi.getManagerTeamProgress();
            analyticsData.managerProgress = managerData.data;
          } else if (user.role === 'HR') {
            const hrData = await analyticsApi.getHRWorkforce();
            analyticsData.hrWorkforce = hrData.data;
          } else if (user.role === 'EMPLOYEE') {
            const employeeData = await analyticsApi.getEmployeeSelf();
            analyticsData.employeeSelf = employeeData.data;
          }
        } catch (analyticsErr) {
          console.error('Error loading analytics data:', analyticsErr);
          // Continue without analytics data
        }
      }

      setData({
        employees: employees.data || [],
        attendance: [], // We don't have a direct API for today's attendance
        leaveRequests: leaveRequests.data || [],

        attendanceReport: attendanceReport.data || null,
        analyticsData
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Initializing session…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4">Unauthorized</div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error: {error}</div>
    );
  }

  // Safe rendering patterns
  if (!data) {
    return (
      <div className="p-4">No data available</div>
    );
  }

  const { employees, leaveRequests, attendanceReport } = data;

  // Calculate stats based on available data
  const totalEmployees = employees.length;
  const presentToday = attendanceReport?.presentToday || 0;
  const absentToday = attendanceReport?.absentToday || 0;
  const onLeaveToday = attendanceReport?.onLeave || 0;

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <PageHeader
          title={`Good ${getGreeting()}, ${user?.email?.split('@')[0] || 'User'}!`}
          description="Here's what's happening with your team today."
        />
        <button 
          onClick={refreshData}
          disabled={loading}
          className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
          <p className="text-destructive">{error}</p>
          <button 
            onClick={refreshData}
            className="ml-4 px-3 py-1 bg-destructive text-white rounded-md text-sm hover:bg-destructive/80"
          >
            Retry
          </button>
        </div>
      )}

      {/* Analytics Overview */}
      {typeof AnalyticsOverview !== 'undefined' && (
        <AnalyticsOverview 
          role={user?.role || ''} 
          analyticsData={data?.analyticsData}
          loading={loading}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              icon={Users}
              change="+2 from last month"
            />
            <StatCard
              title="Present Today"
              value={presentToday}
              icon={UserCheck}
              change="+5 from yesterday"
            />
            <StatCard
              title="Absent Today"
              value={absentToday}
              icon={UserX}
              change="-2 from yesterday"
            />
            <StatCard
              title="On Leave Today"
              value={onLeaveToday}
              icon={Calendar}
              change="±0 from yesterday"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attendance Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Attendance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Attendance chart would appear here
            </div>
          </CardContent>
        </Card>

        {/* Recent Work Items */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Leave Requests */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Pending Leave Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveRequests && leaveRequests.length > 0 ? (
              leaveRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-warning/10 text-warning text-sm">
                        {request.employee?.firstName?.[0] || ''}{request.employee?.lastName?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {request.employee?.firstName || ''} {request.employee?.lastName || ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {request.leaveType?.name || 'Unknown'} • {request.totalDays || 0} days
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={request.status || 'PENDING'} />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending leave requests
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}