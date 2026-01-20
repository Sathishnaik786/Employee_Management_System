import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DashboardConfig, WidgetConfig } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { MetricCard } from './widgets/MetricCard';
import { WorkflowInbox } from './widgets/WorkflowInbox';
import { RecentActivity } from './widgets/RecentActivity';
import { StatusSummary } from './widgets/StatusSummary';
import { ReadinessHeatmap } from '@/analytics/charts/ReadinessHeatmap';
import { TrendPanel } from './widgets/analytics/TrendPanel';
import { DonutDistribution } from '@/analytics/charts/DonutDistribution';
import { cn } from '@/lib/utils';
import { staggerContainer, slideUpVariants } from '@/animations/motionVariants';

interface DashboardLayoutProps {
    config: DashboardConfig;
    data: any; // Ideally this would be a map of widget ID to data
    onWidgetAction?: (widgetId: string, actionId: string) => void;
}

const sizeClasses = {
    sm: "col-span-12 md:col-span-6 lg:col-span-3",
    md: "col-span-12 md:col-span-6 lg:col-span-4",
    lg: "col-span-12 lg:col-span-8",
    full: "col-span-12",
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    config,
    data,
    onWidgetAction
}) => {
    const { hasPermission } = useAuth();

    const visibleWidgets = useMemo(() => {
        return config.widgets.filter((widget: WidgetConfig) => {
            if (!widget.permissions) return true;
            return widget.permissions.every((p: string) => hasPermission(p as any));
        });
    }, [config.widgets, hasPermission]);

    const renderWidget = (widget: WidgetConfig) => {
        const widgetData = data?.[widget.id] || {};

        switch (widget.type) {
            case 'METRIC':
                return <MetricCard {...widget.props} {...widgetData} />;
            case 'WORKFLOW_INBOX':
                return (
                    <WorkflowInbox
                        {...widget.props}
                        {...widgetData}
                        onAction={(id: string) => onWidgetAction?.(widget.id, id)}
                    />
                );
            case 'RECENT_ACTIVITY':
                return <RecentActivity {...widget.props} {...widgetData} />;
            case 'STATUS_SUMMARY':
                return <StatusSummary {...widget.props} {...widgetData} />;
            case 'TREND_PANEL':
                return <TrendPanel {...widget.props} {...widgetData} />;
            case 'READINESS_HEATMAP':
                return <ReadinessHeatmap {...widget.props} {...widgetData} />;
            case 'DONUT_DISTRIBUTION':
                return <DonutDistribution {...widget.props} {...widgetData} />;
            default:
                return (
                    <div className="p-8 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground italic text-xs uppercase tracking-widest">
                        Protocol Placeholder: {widget.title}
                    </div>
                );
        }
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
        >
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black uppercase tracking-widest text-foreground">{config.title}</h1>
                <p className="text-xs font-black uppercase tracking-tighter text-muted-foreground opacity-60">Strategic Command Center</p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {visibleWidgets.map((widget) => (
                    <motion.div
                        key={widget.id}
                        variants={slideUpVariants}
                        className={cn(sizeClasses[widget.size as keyof typeof sizeClasses])}
                    >
                        {renderWidget(widget)}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
