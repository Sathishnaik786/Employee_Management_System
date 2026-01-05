import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  UserCheck, 
  UserX,
  Clock,
  TrendingUp 
} from 'lucide-react';
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview';
import { StatCard } from '@/components/dashboard/StatCard';
import { reportsApi } from '@/services/api';
import { DashboardStats } from '@/types';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await reportsApi.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600">Please log in to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back, ${user.firstName || user.email}! Here's what's happening today.`} 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees?.toLocaleString() || '0'}
          icon={Users}
          change="+2.5% from last month"
        />
        <StatCard
          title="Pending Leaves"
          value={stats?.pendingLeaves?.toLocaleString() || '0'}
          icon={FileText}
          change="+5% from last month"
        />
        <StatCard
          title="Present Today"
          value={stats?.presentToday?.toLocaleString() || '0'}
          icon={UserCheck}
          change="+1.2% from yesterday"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendanceRate?.toFixed(1) || '0'}%`}
          icon={TrendingUp}
          change="+3.1% from last week"
        />
      </div>

      {/* Analytics Overview */}
      <AnalyticsOverview role={user?.role || ''} />
    </div>
  );
}