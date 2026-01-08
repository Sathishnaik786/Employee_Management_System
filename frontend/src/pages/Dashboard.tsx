import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { staggerContainer, slideUpVariants } from '@/animations/motionVariants';
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
      <div className="p-6 space-y-8 animate-fade-in">
        <div className="flex justify-between items-center bg-card/30 p-6 rounded-2xl border border-border/40 backdrop-blur-sm shadow-sm">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64 rounded-lg bg-muted/40" />
            <Skeleton className="h-4 w-96 rounded-md bg-muted/30" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl bg-muted/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 rounded bg-muted/40" />
                <Skeleton className="h-10 w-10 rounded-xl bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 rounded-lg bg-muted/40" />
                <Skeleton className="h-4 w-20 rounded bg-muted/30" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/30 p-6 shadow-sm">
          <Skeleton className="h-6 w-48 mb-4 rounded bg-muted/40" />
          <Skeleton className="h-80 w-full rounded-xl bg-muted/30" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 text-rose-500">
          <UserX size={32} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Access Denied</h2>
        <p className="text-muted-foreground max-w-sm">Please log in to your account with authorized credentials to view the dashboard analytics.</p>
        <Button className="mt-6" variant="outlinePremium">Go to Sign In</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="p-6 lg:p-8 space-y-8 bg-background/30 rounded-3xl backdrop-blur-[2px]"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="Overview"
          description={`Welcome back, ${user.firstName || user.email}! Here's what's happening today.`}
          className="bg-header-gradient p-8 rounded-3xl border border-border/30 shadow-premium mb-0"
        >
          <div className="flex items-center gap-3">
            <Button variant="outlinePremium" size="sm" className="hidden sm:flex">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button variant="premium" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </PageHeader>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={slideUpVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees?.toLocaleString() || '0'}
          icon={Users}
          change="+2.4% vs last month"
          changeType="positive"
        />
        <StatCard
          title="Pending Leaves"
          value={stats?.pendingLeaves?.toLocaleString() || '0'}
          icon={FileText}
          change="+12% vs last month"
          changeType="negative"
        />
        <StatCard
          title="Present Today"
          value={stats?.presentToday?.toLocaleString() || '0'}
          icon={UserCheck}
          change="+1.5% vs average"
          changeType="positive"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendanceRate?.toFixed(1) || '0'}%`}
          icon={TrendingUp}
          change="+0.8% vs last week"
          changeType="neutral"
        />
      </motion.div>

      {/* Analytics Overview */}
      <motion.div variants={slideUpVariants}>
        <AnalyticsOverview role={user?.role || ''} />
      </motion.div>
    </motion.div>
  );
}