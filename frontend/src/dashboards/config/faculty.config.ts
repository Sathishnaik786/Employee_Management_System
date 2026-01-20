import { DashboardConfig } from '../types';
import { BookOpen, GraduationCap, ClipboardCheck, Microscope, Users, FileText, MessageSquare, BarChart3 } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const facultyDashboardConfig: DashboardConfig = {
    id: 'faculty_dashboard',
    title: 'Faculty Research & Academic Portal',
    widgets: [
        {
            id: 'faculty_profile_card',
            type: 'METRIC',
            title: 'Faculty Profile',
            size: 'sm',
            props: {
                icon: BookOpen,
                color: 'primary'
            }
        },
        {
            id: 'assigned_students_count',
            type: 'METRIC',
            title: 'Assigned Students',
            size: 'sm',
            permissions: [PERMISSIONS.STUDENTS_ASSIGNED_VIEW],
            props: {
                icon: Users,
                color: 'info'
            }
        },
        {
            id: 'research_directory_access',
            type: 'METRIC',
            title: 'Research Directory',
            size: 'sm',
            permissions: [PERMISSIONS.RESEARCH_DIRECTORY_VIEW],
            props: {
                icon: Microscope,
                color: 'warning'
            }
        },
        {
            id: 'academic_reports_overview',
            type: 'METRIC',
            title: 'Academic Reports',
            size: 'sm',
            permissions: [PERMISSIONS.REPORTS_ACADEMIC_VIEW],
            props: {
                icon: BarChart3,
                color: 'success'
            }
        },
        {
            id: 'recent_notifications',
            type: 'RECENT_ACTIVITY',
            title: 'Notifications',
            size: 'lg',
            permissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW],
            props: {
                title: 'Recent Notifications'
            }
        },
        {
            id: 'assigned_students_list',
            type: 'STATUS_SUMMARY',
            title: 'Assigned Students Details',
            size: 'lg',
            permissions: [PERMISSIONS.STUDENTS_ASSIGNED_VIEW],
            props: {
                icon: Users,
                title: 'My Assigned Students'
            }
        }
    ]
};
