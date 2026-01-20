import { DashboardConfig } from '../types';
import { BookOpen, GraduationCap, ClipboardCheck, FileText, CheckCircle } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const guideDashboardConfig: DashboardConfig = {
    id: 'guide_dashboard',
    title: 'Guide Supervision Dashboard',
    widgets: [
        {
            id: 'metric_accepted_scholars',
            type: 'METRIC',
            title: 'Accepted Scholars',
            size: 'sm',
            props: {
                icon: GraduationCap,
                color: 'primary'
            }
        },
        {
            id: 'metric_pending_acceptance',
            type: 'METRIC',
            title: 'Pending Acceptance',
            size: 'sm',
            props: {
                icon: ClipboardCheck,
                color: 'warning'
            }
        },
        {
            id: 'metric_thesis_reviews',
            type: 'METRIC',
            title: 'Thesis Reviews',
            size: 'sm',
            props: {
                icon: FileText,
                color: 'info'
            }
        },
        {
            id: 'guide_progress_reports',
            type: 'RECENT_ACTIVITY',
            title: 'Recent Progress Reports',
            size: 'md',
            permissions: [PERMISSIONS.GUIDE_PROGRESS_SUBMIT],
            props: {
                title: 'Latest Submissions'
            }
        },
        {
            id: 'guide_scholar_assignments',
            type: 'STATUS_SUMMARY',
            title: 'Assigned Scholars',
            size: 'lg',
            permissions: [PERMISSIONS.GUIDE_SCHOLARS_VIEW],
            props: {
                icon: GraduationCap,
                title: 'My Supervisees'
            }
        },
        {
            id: 'rac_decisions_view',
            type: 'RECENT_ACTIVITY',
            title: 'RAC Decisions',
            size: 'lg',
            permissions: [PERMISSIONS.RAC_DECISION_VIEW],
            props: {
                title: 'Latest Announcements'
            }
        }
    ]
};