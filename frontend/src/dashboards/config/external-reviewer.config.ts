import { DashboardConfig } from '../types';
import { GraduationCap, FileSearch, FileText, MessageSquare, BookOpen } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const externalReviewerDashboardConfig: DashboardConfig = {
    id: 'external_reviewer_dashboard',
    title: 'NAAC External Reviewer Portal',
    widgets: [
        {
            id: 'assigned_ssr_sections',
            type: 'METRIC',
            title: 'Assigned SSR Sections',
            size: 'sm',
            permissions: [PERMISSIONS.NAAC_EXTERNAL_VIEW],
            props: {
                icon: BookOpen,
                color: 'primary'
            }
        },
        {
            id: 'submitted_comments_count',
            type: 'METRIC',
            title: 'Comments Submitted',
            size: 'sm',
            permissions: [PERMISSIONS.NAAC_EXTERNAL_COMMENT],
            props: {
                icon: MessageSquare,
                color: 'info'
            }
        },
        {
            id: 'peer_review_tasks',
            type: 'STATUS_SUMMARY',
            title: 'Peer Review Tasks',
            size: 'lg',
            permissions: [PERMISSIONS.NAAC_EXTERNAL_VIEW],
            props: {
                icon: FileSearch,
                title: 'Assigned Assessment Framework'
            }
        },
        {
            id: 'review_guidelines',
            type: 'INFO_WIDGET',
            title: 'NAAC Review Guidelines',
            size: 'md',
            permissions: [PERMISSIONS.NAAC_EXTERNAL_VIEW],
            props: {
                content: 'Ensure all qualitative assessments follow the official NAAC SSR manual for University/College cycles.'
            }
        }
    ]
};
