import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudents } from '@/hooks/useStudents';
import { useFaculty } from '@/hooks/useFaculty';
import { useStudentMe } from '@/hooks/useStudentMe';
import { usePendingWorkflows } from '@/hooks/usePendingWorkflows';
import { useAnalyticsMetric, useTrendData, useReadinessScores } from '@/analytics/hooks';

/**
 * IERS - Dashboard Data Resolver
 * Strictly handles academic and institutional metrics.
 */
export function useDashboardData(role: string) {
    const { hasPermission } = useAuth();
    const isStudent = role === 'STUDENT';

    // Part C: Hygiene - Only call list APIs if authorized
    const { meta: studentMeta } = useStudents({
        page: 1,
        limit: 1,
        enabled: hasPermission('iers:student:profile:read')
    });

    const { meta: facultyMeta } = useFaculty({
        page: 1,
        limit: 1,
        enabled: hasPermission('iers:faculty:profile:read')
    });

    // Student specific context
    const { metrics, workflowData, isLoading: studentMeLoading } = useStudentMe();

    // Global/Staff context
    const { data: pendingWorkflows, isLoading: pendingLoading } = usePendingWorkflows();

    // Research & Compliance Signal
    const { data: enrollmentTrend } = useTrendData('enrollment_trend');
    const naacReadiness = useReadinessScores('NAAC');

    const data = useMemo(() => {
        // ADMIN / System Oversight View
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            return {
                metric_active_users: { value: 24, trend: { value: 5, isPositive: true } },
                metric_system_load: { value: '18%', status: 'OPTIMAL' },
                metric_db_health: { value: '99.9%', status: 'ONLINE' },
                metric_audit_rate: { value: '100%', status: 'SECURE' },
                role_permission_registry: {
                    items: [
                        { label: 'Total Roles', count: 18, total: 18, color: 'bg-primary' },
                        { label: 'Active Permissions', count: 142, total: 142, color: 'bg-success' },
                        { label: 'Isolated Protocols', count: 6, total: 6, color: 'bg-info' },
                    ]
                },
                centralized_audit_logs: {
                    items: [
                        { id: 'sec1', description: 'System: Role "PRINCIPAL" access isolation verified', timestamp: '10m ago', type: 'SECURITY' },
                        { id: 'sec2', description: 'Admin: Permission Registry backup completed', timestamp: '1h ago', type: 'ADMIN' },
                        { id: 'sec3', description: 'System: RBAC Hardening Protocol enabled', timestamp: '3h ago', type: 'SECURITY' },
                    ]
                },
                workflow_config_status: {
                    items: [
                        { label: 'PhD Lifecycle', count: 12, total: 12, status: 'ACTIVE' },
                        { label: 'NAAC SSR Cycle', count: 7, total: 7, status: 'ACTIVE' },
                        { label: 'Placement Drive', count: 4, total: 4, status: 'ACTIVE' },
                    ]
                }
            };
        }

        // FACULTY View
        if (role === 'FACULTY') {
            return {
                metric_supervised_scholars: { value: 3 },
                metric_active_research: { value: 2 },
                metric_reviews_pending: { value: 5 },
                research_milestones: {
                    data: [
                        { month: 'Jan', value: 20 },
                        { month: 'Feb', value: 45 },
                        { month: 'Mar', value: 70 },
                        { month: 'Apr', value: 85 },
                    ]
                },
                workflow_phd_review: {
                    items: [
                        { id: 'r1', title: 'Thesis Review: Quantum Computing', description: 'Scholar: Bob Smith', status: 'PENDING', timestamp: '1d ago', priority: 'HIGH' },
                    ]
                },
                academic_log: {
                    items: [
                        { id: 'l1', description: 'RAC Meeting Minutes Uploaded', timestamp: '2h ago', type: 'SUBMISSION' },
                    ]
                }
            };
        }

        // DRC_MEMBER View
        if (role === 'DRC_MEMBER') {
            const items = pendingWorkflows?.map(pw => ({
                id: pw.id,
                title: pw.workflow?.name || 'PhD Scrutiny',
                description: `ID: ${pw.entity_id.split('-')[0]}...`,
                status: 'ACTION_REQUIRED',
                timestamp: 'Pending',
                priority: 'MEDIUM' as const
            })) || [];

            return {
                phd_applications_queue: { value: 15 },
                scrutiny_pending: { value: items.length },
                interviews_scheduled: { value: 8 },
                drc_evaluations: { value: 12 },
                scrutiny_list: {
                    items: items
                },
                drc_notifications: {
                    items: [
                        { id: 'n10', description: 'DRC Meeting Scheduled for Friday', timestamp: '20m ago', type: 'SYSTEM' },
                    ]
                }
            };
        }

        // RAC_MEMBER View
        if (role === 'RAC_MEMBER') {
            const items = pendingWorkflows?.map(pw => ({
                id: pw.id,
                title: pw.workflow?.name || 'Research Review',
                description: `ID: ${pw.entity_id.split('-')[0]}...`,
                status: 'ACTION_REQUIRED',
                timestamp: 'Pending',
                priority: 'HIGH' as const
            })) || [];

            return {
                rac_meetings_count: { value: 6 },
                rac_assigned_students: { value: 4 },
                progress_reviews_pending: { value: items.length },
                rac_decisions_submitted: { value: 18 },
                scholars_progress_overview: {
                    items: items
                },
                rac_notifications: {
                    items: [
                        { id: 'rac1', description: 'Real-time workflow monitoring active', timestamp: 'Just now', type: 'SYSTEM' },
                    ]
                }
            }
        }

        // RRC_MEMBER View
        if (role === 'RRC_MEMBER') {
            return {
                synopsis_submissions_count: { value: 8 },
                thesis_submissions_count: { value: 12 },
                adjudicator_reports_pending: { value: 5 },
                rrc_recommendations_made: { value: 24 },
                rrc_activity_log: {
                    items: [
                        { id: 'r1', description: 'Thesis: Quantum Networks - Adjudicator Report Received', timestamp: '2h ago', type: 'STATUS_CHANGE' },
                    ]
                },
                submissions_status_summary: {
                    items: [
                        { id: 'sub1', title: 'Synopsis: Bob Smith', description: 'Under RRC Review', status: 'PENDING', timestamp: '3h ago', priority: 'MEDIUM' },
                    ]
                }
            };
        }

        // ADJUDICATOR View
        if (role === 'ADJUDICATOR') {
            return {
                assigned_thesis_count: { value: 2 },
                plagiarism_reports_count: { value: 2 },
                evaluations_pending: { value: 1 },
                adjudicator_notifications: {
                    items: [
                        { id: 'a1', description: 'Deadline Reminder: Thesis #442 evaluation due in 2 days', timestamp: '1h ago', type: 'ALERT' },
                    ]
                },
                thesis_assignment_list: {
                    items: [
                        { id: 't1', title: 'Thesis: AI in Renewable Energy', description: 'Student: ID-102', status: 'IN_REVIEW', timestamp: '5d ago', priority: 'HIGH' },
                    ]
                }
            }
        }

        // PRINCIPAL View
        if (role === 'PRINCIPAL') {
            return {
                pending_final_approvals: { value: 3 },
                degree_awards_queue: { value: 5 },
                institutional_audit_score: { value: '96.2%' },
                principal_notifications: {
                    items: [
                        { id: 'p1', description: 'Degree Award Protocol #98 initiated for 4 scholars', timestamp: '1h ago', type: 'SYSTEM' },
                    ]
                },
                final_authority_queue: {
                    items: [
                        { id: 'fa1', title: 'PhD Final Approval: Alice Stark', description: 'Thesis: Advanced Quantum Crypto', status: 'FINAL_APPROVAL', timestamp: '2d ago', priority: 'HIGH' },
                        { id: 'fa2', title: 'PhD Final Approval: John Doe', description: 'Thesis: Sustainable Urbanism', status: 'FINAL_APPROVAL', timestamp: '4d ago', priority: 'MEDIUM' },
                    ]
                }
            };
        }

        // MANAGEMENT View
        if (role === 'MANAGEMENT') {
            return {
                strategic_kpis: { value: '114%' },
                institutional_research_output: { value: 42 },
                compliance_report_summary: { value: 'EXCELLENT' },
                institution_analytics_panel: {
                    data: [
                        { month: 'Jan', value: 72 },
                        { month: 'Feb', value: 85 },
                        { month: 'Mar', value: 92 },
                        { month: 'Apr', value: 96 },
                    ]
                },
                governance_distribution: {
                    data: [
                        { name: 'Research', value: 45, color: '#3b82f6' },
                        { name: 'Academics', value: 30, color: '#10b981' },
                        { name: 'Governance', value: 25, color: '#f59e0b' },
                    ]
                }
            }
        }

        // IQAC_MEMBER View
        if (role === 'IQAC_MEMBER') {
            return {
                iiqa_status: { value: 'APPROVED' },
                ssr_completion_rate: { value: '72%' },
                evidence_upload_count: { value: 142 },
                naac_readiness_meter: { value: 85 },
                compliance_action_items: {
                    items: [
                        { id: 't1', description: 'Update Criterion 3 Research Data', timestamp: '1h ago', type: 'TASK' },
                        { id: 't2', description: 'Upload Alumni Survey Evidence', timestamp: '5h ago', type: 'TASK' },
                    ]
                }
            };
        }

        // DVV_VERIFIER View
        if (role === 'DVV_VERIFIER') {
            return {
                dvv_pending_count: { value: 12 },
                open_clarifications_count: { value: 3 },
                verified_metrics_count: { value: 45 },
                dvv_verification_queue: {
                    items: [
                        { id: 'dvv1', title: 'Metric 3.2.1: Research Grants', description: 'Verify Sanction Letters', status: 'IN_PROGRESS', timestamp: '2h ago', priority: 'HIGH' },
                        { id: 'dvv2', title: 'Metric 7.1.3: Green Audit', description: 'Verify Certificate Accuracy', status: 'PENDING', timestamp: '1d ago', priority: 'MEDIUM' },
                    ]
                },
                clarification_history: {
                    items: [
                        { id: 'c1', description: 'Clarification #401 raised for Metric 1.1.2', timestamp: '3h ago', type: 'SYSTEM' },
                    ]
                }
            };
        }

        // EXTERNAL_REVIEWER View
        if (role === 'EXTERNAL_REVIEWER') {
            return {
                assigned_ssr_sections: { value: 3 },
                submitted_comments_count: { value: 5 },
                peer_review_tasks: {
                    items: [
                        { id: 'ext1', title: 'Criterion 1 Review', description: 'Institutional Vision & Governance', status: 'IN_REVIEW', timestamp: '2d ago', priority: 'HIGH' },
                        { id: 'ext2', title: 'Criterion 4 Review', description: 'IT Infrastructure & Digital Campus', status: 'PENDING', timestamp: '5d ago', priority: 'LOW' },
                    ]
                },
                review_guidelines: { value: 'Please verify the qualitative metrics against the evidence provided in Criterion 1 through 7.' }
            };
        }

        // PLACEMENT_OFFICER View
        if (role === 'PLACEMENT_OFFICER') {
            return {
                active_drives_count: { value: 8 },
                eligible_students_count: { value: 450 },
                offers_issued_count: { value: 112 },
                placement_stats_trend: {
                    data: [
                        { year: '2022', value: 4.5 },
                        { year: '2023', value: 5.2 },
                        { year: '2024', value: 6.8 },
                        { year: '2025', value: 8.5 },
                    ]
                },
                upcoming_drives_queue: {
                    items: [
                        { id: 'd1', title: 'Google India', description: 'Software Engineer', status: 'SCHEDULED', timestamp: 'Jan 20', priority: 'HIGH' },
                        { id: 'd2', title: 'Microsoft', description: 'Data Scientist', status: 'SCHEDULED', timestamp: 'Jan 25', priority: 'HIGH' },
                    ]
                }
            };
        }

        // RECRUITER View
        if (role === 'RECRUITER') {
            return {
                active_job_postings: { value: 2 },
                shortlisted_candidates: { value: 15 },
                interview_rounds_scheduled: { value: 3 },
                candidate_selection_queue: {
                    items: [
                        { id: 'c1', title: 'Alice Stark', description: 'Frontend Intern', status: 'INTERVIEW', timestamp: '2h ago', priority: 'MEDIUM' },
                        { id: 'c2', title: 'Bob Smith', description: 'Backend Intern', status: 'SHORTLISTED', timestamp: '5h ago', priority: 'LOW' },
                    ]
                },
                recruiter_actions: {
                    items: [
                        { id: 'a1', description: 'Interview scheduled for 3 candidates', timestamp: '1h ago', type: 'EVENT' },
                    ]
                }
            };
        }

        // STUDENT View
        if (role === 'STUDENT') {
            const hasPhdApp = !!workflowData?.application;

            return {
                metric_academic_standing: { value: metrics?.cgpa ? `${metrics.cgpa}/10` : 'N/A' },
                metric_attendance: { value: metrics?.attendance_percentage ? `${metrics.attendance_percentage}%` : 'N/A' },
                phd_application_status: {
                    items: [
                        {
                            label: hasPhdApp ? workflowData.application.status : 'No Application',
                            count: workflowData?.workflow?.current_step || 0,
                            total: workflowData?.workflow?.steps?.length || 4,
                            color: 'bg-emerald-600'
                        },
                    ]
                },
                placement_readiness: {
                    items: [
                        { label: 'Academic Status', count: metrics?.academic_status === 'REGULAR' ? 1 : 0, total: 1, color: 'bg-blue-600' },
                    ]
                },
                campus_announcements: {
                    items: [
                        { id: 'n1', description: 'Institutional data synchronized', timestamp: 'Just now', type: 'SYSTEM' },
                    ]
                }
            };
        }

        return {};
    }, [role, studentMeta, facultyMeta, enrollmentTrend, naacReadiness, metrics, workflowData, pendingWorkflows]);

    return { data, loading: studentMeLoading || pendingLoading };
}
