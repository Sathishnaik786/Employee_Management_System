import { DashboardConfig } from '../types';
import { Calendar, Users, ClipboardCheck, FileText, MessageSquare, GraduationCap, BarChart3 } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const racDashboardConfig: DashboardConfig = {
    id: 'rac_dashboard',
    title: 'Research Advisory Committee (RAC) Portal',
    widgets: [
        {
            id: 'rac_meetings_count',
            type: 'METRIC',
            title: 'RAC Meetings',
            size: 'sm',
            permissions: [PERMISSIONS.RAC_MEETING_VIEW],
            props: {
                icon: Calendar,
                color: 'primary'
            }
        },
        {
            id: 'rac_assigned_students',
            type: 'METRIC',
            title: 'Assigned Scholars',
            size: 'sm',
            permissions: [PERMISSIONS.RAC_PROGRESS_REVIEW],
            props: {
                icon: Users,
                color: 'info'
            }
        },
        {
            id: 'progress_reviews_pending',
            type: 'METRIC',
            title: 'Review Pending',
            size: 'sm',
            permissions: [PERMISSIONS.RAC_PROGRESS_REVIEW],
            props: {
                icon: ClipboardCheck,
                color: 'warning'
            }
        },
        {
            id: 'rac_decisions_submitted',
            type: 'METRIC',
            title: 'Decisions',
            size: 'sm',
            permissions: [PERMISSIONS.RAC_DECISION_SUBMIT],
            props: {
                icon: FileText,
                color: 'success'
            }
        },
        {
            id: 'scholars_progress_overview',
            type: 'STATUS_SUMMARY',
            title: 'Scholars Progress Track',
            size: 'lg',
            permissions: [PERMISSIONS.RAC_PROGRESS_REVIEW],
            props: {
                icon: BarChart3,
                title: 'Assigned PhD Scholars'
            }
        },
        {
            id: 'rac_notifications',
            type: 'RECENT_ACTIVITY',
            title: 'RAC Notifications',
            size: 'lg',
            permissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW],
            props: {
                title: 'Committee Notifications'
            }
        }
    ]
};
