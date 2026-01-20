import { DashboardConfig } from '../types';
import { FileSearch, GraduationCap, ClipboardCheck, FileText, MessageSquare, BarChart3, Users } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const rrcDashboardConfig: DashboardConfig = {
    id: 'rrc_dashboard',
    title: 'Research Review Committee (RRC) Portal',
    widgets: [
        {
            id: 'synopsis_submissions_count',
            type: 'METRIC',
            title: 'Synopsis Queue',
            size: 'sm',
            permissions: [PERMISSIONS.RRC_SYNOPSIS_REVIEW],
            props: {
                icon: FileSearch,
                color: 'primary'
            }
        },
        {
            id: 'thesis_submissions_count',
            type: 'METRIC',
            title: 'Thesis Queue',
            size: 'sm',
            permissions: [PERMISSIONS.RRC_THESIS_REVIEW],
            props: {
                icon: GraduationCap,
                color: 'info'
            }
        },
        {
            id: 'adjudicator_reports_pending',
            type: 'METRIC',
            title: 'Adjudicators Reports',
            size: 'sm',
            permissions: [PERMISSIONS.RRC_THESIS_REVIEW],
            props: {
                icon: ClipboardCheck,
                color: 'warning'
            }
        },
        {
            id: 'rrc_recommendations_made',
            type: 'METRIC',
            title: 'RRC Recommendations',
            size: 'sm',
            permissions: [PERMISSIONS.RRC_RECOMMENDATION_SUBMIT],
            props: {
                icon: FileText,
                color: 'success'
            }
        },
        {
            id: 'rrc_activity_log',
            type: 'RECENT_ACTIVITY',
            title: 'RRC Activity',
            size: 'lg',
            permissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW],
            props: {
                title: 'Review Committee Logs'
            }
        },
        {
            id: 'submissions_status_summary',
            type: 'STATUS_SUMMARY',
            title: 'Doctoral Progress',
            size: 'lg',
            permissions: [PERMISSIONS.RRC_THESIS_REVIEW],
            props: {
                icon: Users,
                title: 'Active Research Submissions'
            }
        }
    ]
};
