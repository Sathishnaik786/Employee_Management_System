import { ReactNode } from 'react';
import { Permission } from '@/access/permissions';

export type WidgetType = 'METRIC' | 'WORKFLOW_INBOX' | 'RECENT_ACTIVITY' | 'STATUS_SUMMARY' | 'TREND_PANEL' | 'READINESS_HEATMAP' | 'DONUT_DISTRIBUTION' | 'PROGRESS_WIDGET' | 'INFO_WIDGET' | 'CUSTOM';

export interface WidgetConfig {
    id: string;
    type: WidgetType;
    title: string;
    description?: string;
    permissions?: Permission[];
    size: 'sm' | 'md' | 'lg' | 'full';
    props?: any;
}

export interface DashboardConfig {
    id: string;
    title: string;
    widgets: WidgetConfig[];
}

export interface DashboardPersonaConfig {
    [role: string]: DashboardConfig;
}
