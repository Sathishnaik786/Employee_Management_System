import { DashboardConfig } from '../types';
import { ShieldCheck, GraduationCap, BarChart3, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const principalDashboardConfig: DashboardConfig = {
    id: 'principal_dashboard',
    title: 'Executive Institutional Portal',
    widgets: [
        {
            id: 'pending_final_approvals',
            type: 'METRIC',
            title: 'Pending Final Approvals',
            size: 'sm',
            permissions: [PERMISSIONS.FINAL_APPROVAL_VIEW],
            props: {
                icon: ShieldCheck,
                color: 'primary'
            }
        },
        {
            id: 'degree_awards_queue',
            type: 'METRIC',
            title: 'Degrees to Award',
            size: 'sm',
            permissions: [PERMISSIONS.DEGREE_AWARD_APPROVE],
            props: {
                icon: GraduationCap,
                color: 'success'
            }
        },
        {
            id: 'institutional_audit_score',
            type: 'METRIC',
            title: 'Compliance Score',
            size: 'sm',
            permissions: [PERMISSIONS.AUDIT_SUMMARY_VIEW],
            props: {
                icon: BarChart3,
                color: 'info'
            }
        },
        {
            id: 'principal_notifications',
            type: 'RECENT_ACTIVITY',
            title: 'Executive Alerts',
            size: 'lg',
            permissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW],
            props: {
                title: 'Institutional Priority Notifications'
            }
        },
        {
            id: 'final_authority_queue',
            type: 'WORKFLOW_INBOX',
            title: 'Final Approval Inbox',
            size: 'lg',
            permissions: [PERMISSIONS.DEGREE_AWARD_APPROVE],
            props: {
                title: 'Protocol Completion Queue'
            }
        }
    ]
};
