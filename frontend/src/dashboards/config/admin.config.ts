import { DashboardConfig } from '../types';
import { PERMISSIONS } from '@/access/permissions';
import { Users, ShieldCheck, Activity, Database, Lock, Search } from 'lucide-react';

export const adminDashboardConfig: DashboardConfig = {
    id: 'admin_oversight',
    title: 'System Administration & Oversite',
    widgets: [
        {
            id: 'metric_active_users',
            type: 'METRIC',
            title: 'Active System Users',
            size: 'sm',
            permissions: [PERMISSIONS.SYSTEM_ADMIN],
            props: {
                icon: Users,
                color: 'primary'
            }
        },
        {
            id: 'metric_system_load',
            type: 'METRIC',
            title: 'System Resource Load',
            size: 'sm',
            permissions: [PERMISSIONS.SYSTEM_ADMIN],
            props: {
                icon: Activity,
                color: 'info'
            }
        },
        {
            id: 'metric_db_health',
            type: 'METRIC',
            title: 'Database Health',
            size: 'sm',
            permissions: [PERMISSIONS.SYSTEM_ADMIN],
            props: {
                icon: Database,
                color: 'success'
            }
        },
        {
            id: 'metric_audit_rate',
            type: 'METRIC',
            title: 'Security Audit Rate',
            size: 'sm',
            permissions: [PERMISSIONS.SYSTEM_ADMIN],
            props: {
                icon: ShieldCheck,
                color: 'warning'
            }
        },
        {
            id: 'role_permission_registry',
            type: 'STATUS_SUMMARY',
            title: 'Role & Permission Integrity',
            size: 'lg',
            permissions: [PERMISSIONS.SYSTEM_ADMIN],
            props: {
                icon: Lock,
                title: 'System Security State'
            }
        },
        {
            id: 'centralized_audit_logs',
            type: 'RECENT_ACTIVITY',
            title: 'Global Security Audit Trail',
            size: 'lg',
            permissions: [PERMISSIONS.SYSTEM_ADMIN],
            props: {
                title: 'System-wide Observability'
            }
        },
        {
            id: 'workflow_config_status',
            type: 'STATUS_SUMMARY',
            title: 'Workflow Engine Definitions',
            size: 'md',
            permissions: [PERMISSIONS.SYSTEM_ADMIN],
            props: {
                title: 'Active Workflow Definitions'
            }
        },
        {
            id: 'system_security_report',
            type: 'INFO_WIDGET',
            title: 'Security Compliance Status',
            size: 'md',
            permissions: [PERMISSIONS.SYSTEM_ADMIN],
            props: {
                content: 'Protocol Isolation is active. System-wide audit logging is persistent and immutable.'
            }
        }
    ]
};
