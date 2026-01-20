import { DashboardConfig } from '../types';
import { Book, GraduationCap, Trophy, FileSearch, Briefcase } from 'lucide-react';

export const studentDashboardConfig: DashboardConfig = {
    id: 'student_dashboard',
    title: 'Student Academic Dashboard',
    widgets: [
        {
            id: 'metric_academic_standing',
            type: 'METRIC',
            title: 'Audit Credits',
            size: 'sm',
            props: {
                icon: Trophy,
                color: 'warning'
            }
        },
        {
            id: 'metric_attendance',
            type: 'METRIC',
            title: 'Attendance Rate',
            size: 'sm',
            props: {
                icon: Book,
                color: 'info'
            }
        },
        {
            id: 'phd_application_status',
            type: 'STATUS_SUMMARY',
            title: 'Research Application Status',
            size: 'lg',
            props: {
                icon: FileSearch,
                title: 'PhD Admission Lifecycle'
            }
        },
        {
            id: 'placement_readiness',
            type: 'STATUS_SUMMARY',
            title: 'Placement Engagement',
            size: 'lg',
            props: {
                icon: Briefcase,
                title: 'Drives & Registrations'
            }
        },
        {
            id: 'campus_announcements',
            type: 'RECENT_ACTIVITY',
            title: 'Campus Notifications',
            size: 'md'
        }
    ]
};
