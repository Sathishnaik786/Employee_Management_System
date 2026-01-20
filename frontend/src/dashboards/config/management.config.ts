import { DashboardConfig } from '../types';
import { Zap, LineChart, FileText, MessageSquare, PieChart, TrendingUp } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const managementDashboardConfig: DashboardConfig = {
    id: 'management_dashboard',
    title: 'Strategic Governance Center',
    widgets: [
        {
            id: 'strategic_kpis',
            type: 'METRIC',
            title: 'Strategic Growth',
            size: 'sm',
            permissions: [PERMISSIONS.STRATEGIC_ANALYTICS_VIEW],
            props: {
                icon: Zap,
                color: 'primary'
            }
        },
        {
            id: 'institutional_research_output',
            type: 'METRIC',
            title: 'Research Output',
            size: 'sm',
            permissions: [PERMISSIONS.INSTITUTIONAL_METRICS_VIEW],
            props: {
                icon: TrendingUp,
                color: 'success'
            }
        },
        {
            id: 'compliance_report_summary',
            type: 'METRIC',
            title: 'Policy Compliance',
            size: 'sm',
            permissions: [PERMISSIONS.POLICY_REPORT_VIEW],
            props: {
                icon: FileText,
                color: 'warning'
            }
        },
        {
            id: 'institution_analytics_panel',
            type: 'TREND_PANEL',
            title: 'Institutional Trends',
            size: 'lg',
            permissions: [PERMISSIONS.INSTITUTIONAL_METRICS_VIEW],
            props: {
                title: 'Strategic Analytics Overlay'
            }
        },
        {
            id: 'governance_distribution',
            type: 'DONUT_DISTRIBUTION',
            title: 'Academic Distribution',
            size: 'md',
            permissions: [PERMISSIONS.STRATEGIC_ANALYTICS_VIEW],
            props: {
                title: 'Strategic Resource Allocation'
            }
        }
    ]
};
