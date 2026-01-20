import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/dashboards/DashboardLayout';
import { getDashboardConfig } from '@/dashboards/config';
import { useDashboardData } from '@/dashboards/useDashboardData';
import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { slideUpVariants } from '@/animations/motionVariants';

// UI V2 Imports
import { ENABLE_UI_V2, canUseUIV2 } from '@/config/uiFlags';
import AdminDashboardV2 from '@/ui-v2/dashboard/AdminDashboardV2';
import ManagementDashboardV2 from '@/ui-v2/dashboard/ManagementDashboardV2';
import PrincipalDashboardV2 from '@/ui-v2/dashboard/PrincipalDashboardV2';
import V2ErrorBoundary from '@/ui-v2/utils/V2ErrorBoundary';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();

  // ----------------------------------------------------------------------
  // UI-V2 EARLY EXIT: Feature Flag & Role Check
  // ----------------------------------------------------------------------
  if (!authLoading && user && ENABLE_UI_V2 && canUseUIV2(user.role)) {
    // Cast to string to handle 'SUPER_ADMIN' which might be missing from strict Role type
    const userRole = user.role as string;

    switch (userRole) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return (
          <V2ErrorBoundary>
            <AdminDashboardV2 />
          </V2ErrorBoundary>
        );
      case 'MANAGEMENT':
        return (
          <V2ErrorBoundary>
            <ManagementDashboardV2 />
          </V2ErrorBoundary>
        );
      case 'PRINCIPAL':
        return (
          <V2ErrorBoundary>
            <PrincipalDashboardV2 />
          </V2ErrorBoundary>
        );
      default:
        // Fallback or explicit handling if a role passes canUseUIV2 but isn't handled here
        break;
    }
  }
  // ----------------------------------------------------------------------

  const dashboardConfig = useMemo(() => {
    if (!user) return null;
    return getDashboardConfig(user.role);
  }, [user]);

  const { data, loading: dataLoading } = useDashboardData(user?.role || '');

  if (authLoading || dataLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-32 w-full rounded-[2rem]" />
        <div className="grid grid-cols-12 gap-6">
          <Skeleton className="col-span-12 md:col-span-4 h-40 rounded-2xl" />
          <Skeleton className="col-span-12 md:col-span-4 h-40 rounded-2xl" />
          <Skeleton className="col-span-12 md:col-span-4 h-40 rounded-2xl" />
          <Skeleton className="col-span-12 h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user || !dashboardConfig) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground uppercase tracking-widest font-black text-xs">Access Denied: Protocol Unauthorized</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
      <motion.div variants={slideUpVariants} initial="initial" animate="animate">
        <PageHeader
          title={`Welcome, ${user.profile?.full_name || user.firstName || user.email?.split('@')[0] || 'User'}`}
          description={`Strategic Overview for ${user.role} role. Institutional signal is stable.`}
          className="bg-header-gradient p-10 rounded-[2.5rem] border border-white/10 shadow-premium"
        />
      </motion.div>

      <DashboardLayout
        config={dashboardConfig}
        data={data}
        onWidgetAction={(widgetId, actionId) => {
          console.log(`Action triggered on widget ${widgetId}: ${actionId}`);
        }}
      />
    </div>
  );
}