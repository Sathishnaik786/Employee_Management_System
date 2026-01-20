import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/dashboards/DashboardLayout';
import { getDashboardConfig } from '@/dashboards/config';
import { useDashboardData } from '@/dashboards/useDashboardData';
import { PageHeader } from '@/components/layout/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { slideUpVariants } from '@/animations/motionVariants';

export default function PlacementOfficerDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const dashboardConfig = useMemo(() => {
        if (!user) return null;
        return getDashboardConfig('PLACEMENT_OFFICER' as any);
    }, [user]);

    const { data, loading: dataLoading } = useDashboardData('PLACEMENT_OFFICER');

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
                    title={`Placement Directorate: ${user.fullName || 'Officer'}`}
                    description="Institutional placement management, corporate relations, and student career analytics."
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
