import { DashboardConfig } from '../types';
import { ShieldCheck, FileText, ClipboardCheck, BarChart3, MessageSquare, Plus } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const iqacDashboardConfig: DashboardConfig = {
    id: 'iqac_dashboard',
    title: 'IQAC Compliance Center',
    widgets: [
        {
            id: 'iiqa_status',
            type: 'METRIC',
            title: 'IIQA Status',
            size: 'sm',
            permissions: [PERMISSIONS.NAAC_IIQA_MANAGE],
            props: {
                icon: ShieldCheck,
                color: 'primary'
            }
        },
        {
            id: 'ssr_completion_rate',
            type: 'METRIC',
            title: 'SSR Framework Completion',
            size: 'sm',
            permissions: [PERMISSIONS.NAAC_SSR_EDIT],
            props: {
                icon: BarChart3,
                color: 'success'
            }
        },
        {
            id: 'evidence_upload_count',
            type: 'METRIC',
            title: 'Evidence repository',
            size: 'sm',
            permissions: [PERMISSIONS.NAAC_EVIDENCE_UPLOAD],
            props: {
                icon: ClipboardCheck,
                color: 'info'
            }
        },
        {
            id: 'naac_readiness_meter',
            type: 'PROGRESS_WIDGET',
            title: 'NAAC Readiness Meter',
            size: 'lg',
            permissions: [PERMISSIONS.NAAC_READINESS_VIEW],
            props: {
                title: 'Institutional Accreditation Readiness'
            }
        },
        {
            id: 'compliance_action_items',
            type: 'RECENT_ACTIVITY',
            title: 'Compliance Action Items',
            size: 'lg',
            permissions: [PERMISSIONS.NAAC_SSR_EDIT],
            props: {
                title: 'Pending SSR Tasks'
            }
        }
    ]
};
