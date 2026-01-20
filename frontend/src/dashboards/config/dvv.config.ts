import { DashboardConfig } from '../types';
import { FileSearch, MessageSquare, Network, Clock, CheckCircle2 } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const dvvDashboardConfig: DashboardConfig = {
    id: 'dvv_dashboard',
    title: 'Data Validation & Verification (DVV) Portal',
    widgets: [
        {
            id: 'dvv_pending_count',
            type: 'METRIC',
            title: 'Pending Verifications',
            size: 'sm',
            permissions: [PERMISSIONS.DVV_EVIDENCE_VIEW],
            props: {
                icon: Clock,
                color: 'warning'
            }
        },
        {
            id: 'open_clarifications_count',
            type: 'METRIC',
            title: 'Open Clarifications',
            size: 'sm',
            permissions: [PERMISSIONS.DVV_CLARIFICATION_RAISE],
            props: {
                icon: MessageSquare,
                color: 'primary'
            }
        },
        {
            id: 'verified_metrics_count',
            type: 'METRIC',
            title: 'Metrics Verified',
            size: 'sm',
            permissions: [PERMISSIONS.DVV_STATUS_UPDATE],
            props: {
                icon: CheckCircle2,
                color: 'success'
            }
        },
        {
            id: 'dvv_verification_queue',
            type: 'STATUS_SUMMARY',
            title: 'DVV Verification Queue',
            size: 'lg',
            permissions: [PERMISSIONS.DVV_EVIDENCE_VIEW],
            props: {
                icon: FileSearch,
                title: 'Compliance Evidence Queue'
            }
        },
        {
            id: 'clarification_history',
            type: 'RECENT_ACTIVITY',
            title: 'Recent Clarifications',
            size: 'lg',
            permissions: [PERMISSIONS.DVV_CLARIFICATION_RAISE],
            props: {
                title: 'Data Query History'
            }
        }
    ]
};
