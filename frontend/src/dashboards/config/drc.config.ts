import { DashboardConfig } from '../types';
import { FileSearch, ClipboardCheck, Calendar, FileText, MessageSquare, GraduationCap, Users } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const drcDashboardConfig: DashboardConfig = {
    id: 'drc_dashboard',
    title: 'Departmental Research Committee (DRC) Portal',
    widgets: [
        {
            id: 'phd_applications_queue',
            type: 'METRIC',
            title: 'PhD Applications',
            size: 'sm',
            permissions: [PERMISSIONS.PHD_APPLICATION_VIEW],
            props: {
                icon: FileSearch,
                color: 'primary'
            }
        },
        {
            id: 'scrutiny_pending',
            type: 'METRIC',
            title: 'Pending Scrutiny',
            size: 'sm',
            permissions: [PERMISSIONS.PHD_SCRUTINY_REVIEW],
            props: {
                icon: ClipboardCheck,
                color: 'warning'
            }
        },
        {
            id: 'interviews_scheduled',
            type: 'METRIC',
            title: 'Interviews',
            size: 'sm',
            permissions: [PERMISSIONS.INTERVIEW_SCHEDULE],
            props: {
                icon: Calendar,
                color: 'info'
            }
        },
        {
            id: 'drc_evaluations',
            type: 'METRIC',
            title: 'DRC Evaluations',
            size: 'sm',
            permissions: [PERMISSIONS.DRC_EVALUATE],
            props: {
                icon: FileText,
                color: 'success'
            }
        },
        {
            id: 'scrutiny_list',
            type: 'STATUS_SUMMARY',
            title: 'Application Scrutiny Progress',
            size: 'lg',
            permissions: [PERMISSIONS.PHD_SCRUTINY_REVIEW],
            props: {
                icon: ClipboardCheck,
                title: 'PhD Scrutiny Queue'
            }
        },
        {
            id: 'drc_notifications',
            type: 'RECENT_ACTIVITY',
            title: 'DRC Notifications',
            size: 'lg',
            permissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW],
            props: {
                title: 'Committee Notifications'
            }
        }
    ]
};
