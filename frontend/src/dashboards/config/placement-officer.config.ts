import { DashboardConfig } from '../types';
import { Briefcase, Network, ClipboardCheck, ShieldCheck, BarChart3 } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const placementOfficerDashboardConfig: DashboardConfig = {
    id: 'placement_officer_dashboard',
    title: 'University Placement Office',
    widgets: [
        {
            id: 'active_drives_count',
            type: 'METRIC',
            title: 'Active Placement Drives',
            size: 'sm',
            permissions: [PERMISSIONS.PLACEMENT_DRIVE_MANAGE],
            props: {
                icon: Network,
                color: 'primary'
            }
        },
        {
            id: 'eligible_students_count',
            type: 'METRIC',
            title: 'Eligible Students (Current Year)',
            size: 'sm',
            permissions: [PERMISSIONS.STUDENT_ELIGIBILITY_VIEW],
            props: {
                icon: ClipboardCheck,
                color: 'success'
            }
        },
        {
            id: 'offers_issued_count',
            type: 'METRIC',
            title: 'Job Offers Issued',
            size: 'sm',
            permissions: [PERMISSIONS.OFFER_TRACKING_VIEW],
            props: {
                icon: ShieldCheck,
                color: 'info'
            }
        },
        {
            id: 'placement_stats_trend',
            type: 'TREND_PANEL',
            title: 'Placement Trend (CTC vs Year)',
            size: 'lg',
            permissions: [PERMISSIONS.PLACEMENT_ANALYTICS_VIEW],
            props: {
                title: 'Institutional Placement Growth'
            }
        },
        {
            id: 'upcoming_drives_queue',
            type: 'STATUS_SUMMARY',
            title: 'Upcoming Recruitment Calendar',
            size: 'lg',
            permissions: [PERMISSIONS.PLACEMENT_DRIVE_MANAGE],
            props: {
                icon: Briefcase,
                title: 'Corporate Visit Schedule'
            }
        }
    ]
};
