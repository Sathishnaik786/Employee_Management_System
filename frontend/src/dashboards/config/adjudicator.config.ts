import { DashboardConfig } from '../types';
import { FileSearch, ShieldCheck, FileText, MessageSquare, BookOpen, Clock } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const adjudicatorDashboardConfig: DashboardConfig = {
    id: 'adjudicator_dashboard',
    title: 'Thesis Adjudication Portal',
    widgets: [
        {
            id: 'assigned_thesis_count',
            type: 'METRIC',
            title: 'Assigned Thesis',
            size: 'sm',
            permissions: [PERMISSIONS.THESIS_ASSIGNED_VIEW],
            props: {
                icon: BookOpen,
                color: 'primary'
            }
        },
        {
            id: 'plagiarism_reports_count',
            type: 'METRIC',
            title: 'Plagiarism Checks',
            size: 'sm',
            permissions: [PERMISSIONS.PLAGIARISM_REPORT_VIEW],
            props: {
                icon: ShieldCheck,
                color: 'warning'
            }
        },
        {
            id: 'evaluations_pending',
            type: 'METRIC',
            title: 'Pending Reviews',
            size: 'sm',
            permissions: [PERMISSIONS.THESIS_EVALUATION_SUBMIT],
            props: {
                icon: Clock,
                color: 'info'
            }
        },
        {
            id: 'adjudicator_notifications',
            type: 'RECENT_ACTIVITY',
            title: 'Evaluation Alerts',
            size: 'lg',
            permissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW],
            props: {
                title: 'Institutional Notifications'
            }
        },
        {
            id: 'thesis_assignment_list',
            type: 'STATUS_SUMMARY',
            title: 'My Assignments',
            size: 'lg',
            permissions: [PERMISSIONS.THESIS_ASSIGNED_VIEW],
            props: {
                icon: FileSearch,
                title: 'Review Queue'
            }
        }
    ]
};
