import {
    LayoutDashboard,
    Users,
    GraduationCap,
    School,
    FileSearch,
    ClipboardCheck,
    Calendar,
    FileText,
    BarChart3,
    Briefcase,
    Settings,
    ShieldCheck,
    MessageSquare,
    Network,
    Zap,
    LineChart
} from 'lucide-react';
import { PERMISSIONS, Permission } from '@/access/permissions';

export interface NavItem {
    title: string;
    href: string;
    icon: any;
    requiredPermissions?: (Permission | string)[];
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

/**
 * IERS - Sidebar Configuration
 * Strictly educational and institutional modules only.
 */

export const navConfig: NavGroup[] = [
    {
        label: 'Academic Overview',
        items: [
            { title: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard, requiredPermissions: [PERMISSIONS.BASE_DASHBOARD_VIEW] },
            { title: 'My Profile', href: '/app/profile', icon: ShieldCheck, requiredPermissions: [PERMISSIONS.FACULTY_PROFILE_READ] },
            { title: 'Faculty Directory', href: '/app/iers/faculty', icon: Users, requiredPermissions: [PERMISSIONS.FACULTY_VIEW] },
            { title: 'Research Directory', href: '/app/iers/research', icon: GraduationCap, requiredPermissions: [PERMISSIONS.RESEARCH_DIRECTORY_VIEW] },
            { title: 'Academic Reports', href: '/app/iers/reports', icon: BarChart3, requiredPermissions: [PERMISSIONS.REPORTS_ACADEMIC_VIEW] },
            { title: 'Notifications', href: '/app/notifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW] },
        ]
    },
    {
        label: 'Student Supervision',
        items: [
            { title: 'Assigned Students', href: '/app/iers/students/assigned', icon: Users, requiredPermissions: [PERMISSIONS.STUDENTS_ASSIGNED_VIEW] },
            { title: 'Student Progress', href: '/app/iers/students/progress', icon: BarChart3, requiredPermissions: [PERMISSIONS.GUIDE_SCHOLARS_VIEW] },
        ]
    },
    {
        label: 'DRC Management',
        items: [
            { title: 'PhD Applications Queue', href: '/app/iers/drc/applications', icon: FileSearch, requiredPermissions: [PERMISSIONS.PHD_APPLICATION_VIEW] },
            { title: 'Application Scrutiny', href: '/app/iers/drc/scrutiny', icon: ClipboardCheck, requiredPermissions: [PERMISSIONS.PHD_SCRUTINY_REVIEW] },
            { title: 'Interview Scheduling', href: '/app/iers/drc/interviews', icon: Calendar, requiredPermissions: [PERMISSIONS.INTERVIEW_SCHEDULE] },
            { title: 'Evaluation Forms', href: '/app/iers/drc/evaluation', icon: FileText, requiredPermissions: [PERMISSIONS.DRC_EVALUATE] },
            { title: 'Notifications', href: '/app/notifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW] },
        ]
    },
    {
        label: 'Principal Authority',
        items: [
            { title: 'Final Approvals', href: '/app/iers/principal/approvals', icon: ShieldCheck, requiredPermissions: [PERMISSIONS.FINAL_APPROVAL_VIEW] },
            { title: 'Degree Awards', href: '/app/iers/principal/degrees', icon: GraduationCap, requiredPermissions: [PERMISSIONS.DEGREE_AWARD_APPROVE] },
            { title: 'Institutional Audit', href: '/app/iers/principal/audit', icon: BarChart3, requiredPermissions: [PERMISSIONS.AUDIT_SUMMARY_VIEW] },
            { title: 'Notifications', href: '/app/notifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW] },
        ]
    },
    {
        label: 'Management Strategy',
        items: [
            { title: 'Strategic KPIs', href: '/app/iers/management/kpis', icon: Zap, requiredPermissions: [PERMISSIONS.STRATEGIC_ANALYTICS_VIEW] },
            { title: 'Institutional Analytics', href: '/app/iers/management/analytics', icon: LineChart, requiredPermissions: [PERMISSIONS.INSTITUTIONAL_METRICS_VIEW] },
            { title: 'Policy Compliance', href: '/app/iers/management/compliance', icon: FileText, requiredPermissions: [PERMISSIONS.POLICY_REPORT_VIEW] },
            { title: 'Notifications', href: '/app/notifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW] },
        ]
    },
    {
        label: 'IQAC Compliance',
        items: [
            { title: 'IIQA Management', href: '/app/iers/naac/iiqa', icon: ShieldCheck, requiredPermissions: [PERMISSIONS.NAAC_IIQA_MANAGE] },
            { title: 'SSR Framework', href: '/app/iers/naac/ssr', icon: FileText, requiredPermissions: [PERMISSIONS.NAAC_SSR_EDIT] },
            { title: 'Evidence Repository', href: '/app/iers/naac/evidence', icon: ClipboardCheck, requiredPermissions: [PERMISSIONS.NAAC_EVIDENCE_UPLOAD] },
            { title: 'NAAC Readiness', href: '/app/iers/naac/dashboard', icon: BarChart3, requiredPermissions: [PERMISSIONS.NAAC_READINESS_VIEW] },
            { title: 'Notifications', href: '/app/notifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW] },
        ]
    },
    {
        label: 'DVV Verification',
        items: [
            { title: 'DVV Queue', href: '/app/iers/dvv/dashboard', icon: FileSearch, requiredPermissions: [PERMISSIONS.DVV_EVIDENCE_VIEW] },
            { title: 'Clarification Hub', href: '/app/iers/dvv/clarifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.DVV_CLARIFICATION_RAISE] },
            { title: 'Verification Tracker', href: '/app/iers/dvv/tracker', icon: Network, requiredPermissions: [PERMISSIONS.DVV_STATUS_UPDATE] },
        ]
    },
    {
        label: 'Placement Office',
        items: [
            { title: 'Company Management', href: '/app/iers/placement/companies', icon: Briefcase, requiredPermissions: [PERMISSIONS.COMPANY_PROFILE_MANAGE] },
            { title: 'Placement Drives', href: '/app/iers/placement/drives', icon: Network, requiredPermissions: [PERMISSIONS.PLACEMENT_DRIVE_MANAGE] },
            { title: 'Student Eligibility', href: '/app/iers/placement/eligibility', icon: ClipboardCheck, requiredPermissions: [PERMISSIONS.STUDENT_ELIGIBILITY_VIEW] },
            { title: 'Offer Tracking', href: '/app/iers/placement/offers', icon: ShieldCheck, requiredPermissions: [PERMISSIONS.OFFER_TRACKING_VIEW] },
            { title: 'Placement Analytics', href: '/app/iers/placement/dashboard', icon: BarChart3, requiredPermissions: [PERMISSIONS.PLACEMENT_ANALYTICS_VIEW] },
        ]
    },
    {
        label: 'Recruitment Hub',
        items: [
            { title: 'Company Profile', href: '/app/iers/recruiter/profile', icon: Briefcase, requiredPermissions: [PERMISSIONS.JOB_POST_CREATE] },
            { title: 'Job Postings', href: '/app/iers/recruiter/jobs', icon: FileText, requiredPermissions: [PERMISSIONS.JOB_POST_CREATE] },
            { title: 'Candidate List', href: '/app/iers/recruiter/candidates', icon: GraduationCap, requiredPermissions: [PERMISSIONS.CANDIDATE_SHORTLIST_VIEW] },
            { title: 'Interview Schedule', href: '/app/iers/recruiter/interviews', icon: Network, requiredPermissions: [PERMISSIONS.INTERVIEW_SCHEDULE_MANAGE] },
            { title: 'Offer Management', href: '/app/iers/recruiter/offers', icon: ShieldCheck, requiredPermissions: [PERMISSIONS.OFFER_CREATE] },
        ]
    },
    {
        label: 'Career Services',
        items: [
            { title: 'Placement Cell', href: '/app/iers/placement/opportunities', icon: Briefcase, requiredPermissions: [PERMISSIONS.PLACEMENT_OPPORTUNITY_VIEW] },
            { title: 'Applied Jobs', href: '/app/iers/placement/applied', icon: FileText, requiredPermissions: [PERMISSIONS.JOB_APPLY] },
            { title: 'Interview Schedule', href: '/app/iers/placement/interviews', icon: Network, requiredPermissions: [PERMISSIONS.PLACEMENT_OPPORTUNITY_VIEW] },
            { title: 'Offer Status', href: '/app/iers/placement/offers-view', icon: ShieldCheck, requiredPermissions: [PERMISSIONS.OFFER_VIEW] },
            { title: 'Skill Training', href: '/app/iers/training', icon: Network, requiredPermissions: [PERMISSIONS.TRAINING_VIEW] },
        ]
    },
    {
        label: 'Peer Review',
        items: [
            { title: 'Assigned Reviews', href: '/app/iers/external/dashboard', icon: GraduationCap, requiredPermissions: [PERMISSIONS.NAAC_EXTERNAL_VIEW] },
            { title: 'Evidence View', href: '/app/iers/external/evidence', icon: FileSearch, requiredPermissions: [PERMISSIONS.NAAC_EXTERNAL_VIEW] },
            { title: 'Review Comments', href: '/app/iers/external/comments', icon: FileText, requiredPermissions: [PERMISSIONS.NAAC_EXTERNAL_COMMENT] },
        ]
    },
    {
        label: 'Adjudicator Panel',
        items: [
            { title: 'Assigned Thesis', href: '/app/iers/adjudicator/thesis', icon: FileSearch, requiredPermissions: [PERMISSIONS.THESIS_ASSIGNED_VIEW] },
            { title: 'Plagiarism Reports', href: '/app/iers/adjudicator/plagiarism', icon: ShieldCheck, requiredPermissions: [PERMISSIONS.PLAGIARISM_REPORT_VIEW] },
            { title: 'Evaluation Upload', href: '/app/iers/adjudicator/upload', icon: FileText, requiredPermissions: [PERMISSIONS.THESIS_EVALUATION_SUBMIT] },
            { title: 'Notifications', href: '/app/notifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW] },
        ]
    },
    {
        label: 'RRC Panel',
        items: [
            { title: 'Synopsis Submissions', href: '/app/iers/rrc/synopsis', icon: FileSearch, requiredPermissions: [PERMISSIONS.RRC_SYNOPSIS_REVIEW] },
            { title: 'Thesis Submissions', href: '/app/iers/rrc/thesis', icon: GraduationCap, requiredPermissions: [PERMISSIONS.RRC_THESIS_REVIEW] },
            { title: 'Adjudicator Reports', href: '/app/iers/rrc/reports', icon: ClipboardCheck, requiredPermissions: [PERMISSIONS.RRC_THESIS_REVIEW] },
            { title: 'RRC Recommendation', href: '/app/iers/rrc/recommendation', icon: FileText, requiredPermissions: [PERMISSIONS.RRC_RECOMMENDATION_SUBMIT] },
            { title: 'Notifications', href: '/app/notifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW] },
        ]
    },
    {
        label: 'RAC Management',
        items: [
            { title: 'RAC Meetings', href: '/app/iers/rac/meetings', icon: Calendar, requiredPermissions: [PERMISSIONS.RAC_MEETING_VIEW] },
            { title: 'Assigned Students', href: '/app/iers/rac/students', icon: Users, requiredPermissions: [PERMISSIONS.RAC_PROGRESS_REVIEW] },
            { title: 'Progress Review', href: '/app/iers/rac/progress', icon: ClipboardCheck, requiredPermissions: [PERMISSIONS.RAC_PROGRESS_REVIEW] },
            { title: 'RAC Decisions', href: '/app/iers/rac/decisions', icon: FileText, requiredPermissions: [PERMISSIONS.RAC_DECISION_SUBMIT] },
            { title: 'Notifications', href: '/app/notifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.NOTIFICATIONS_FACULTY_VIEW] },
        ]
    },
    {
        label: 'Guide Functions',
        items: [
            { title: 'Guide Acceptance', href: '/app/iers/guide/acceptance', icon: FileSearch, requiredPermissions: [PERMISSIONS.GUIDE_ACCEPT] },
            { title: 'Assigned Scholars', href: '/app/iers/guide/scholars', icon: GraduationCap, requiredPermissions: [PERMISSIONS.GUIDE_SCHOLARS_VIEW] },
            { title: 'Progress Submissions', href: '/app/iers/guide/progress', icon: FileText, requiredPermissions: [PERMISSIONS.GUIDE_PROGRESS_SUBMIT] },
            { title: 'Thesis Review', href: '/app/iers/guide/thesis', icon: FileSearch, requiredPermissions: [PERMISSIONS.THESIS_VIEW] },
            { title: 'RAC Decisions', href: '/app/iers/guide/rac', icon: ClipboardCheck, requiredPermissions: [PERMISSIONS.RAC_DECISION_VIEW] },
        ]
    },
    {
        label: 'Student Dashboard',
        items: [
            { title: 'My Profile', href: '/app/profile', icon: ShieldCheck, requiredPermissions: [PERMISSIONS.STUDENT_PROFILE_READ] },
            { title: 'PhD Application', href: '/app/iers/phd/applications', icon: FileSearch, requiredPermissions: [PERMISSIONS.PHD_APPLY] },
            { title: 'Application Status', href: '/app/iers/phd/tracker', icon: BarChart3, requiredPermissions: [PERMISSIONS.PHD_VIEW] },
            { title: 'Documents', href: '/app/documents', icon: FileText, requiredPermissions: [PERMISSIONS.DOCUMENTS_VIEW] },
            { title: 'Notifications', href: '/app/notifications', icon: MessageSquare, requiredPermissions: [PERMISSIONS.NOTIFICATIONS_STUDENT_VIEW] },
        ]
    },
    {
        label: 'System Admin',
        items: [
            { title: 'Oversight Dashboard', href: '/app/admin/dashboard', icon: LayoutDashboard, requiredPermissions: [PERMISSIONS.SYSTEM_ADMIN] },
            { title: 'User Management', href: '/app/admin/users', icon: Users, requiredPermissions: [PERMISSIONS.SYSTEM_ADMIN] },
            { title: 'Global Audit Logs', href: '/app/admin/audit', icon: FileSearch, requiredPermissions: [PERMISSIONS.SYSTEM_ADMIN] },
            { title: 'Security Settings', href: '/app/settings', icon: Settings, requiredPermissions: [PERMISSIONS.SETTINGS_MANAGE] },
        ]
    }
];

export const filterNavByPermissions = (groups: NavGroup[], hasPermission: (p: string) => boolean, role?: string) => {
    return groups.map(group => ({
        ...group,
        items: group.items.filter(item => {
            // Part B: Sidebar Isolation - Role-based Hardening
            if (role === 'STUDENT') {
                const forbiddenGroups = [
                    'DRC Management', 'Principal Authority', 'Management Strategy',
                    'IQAC Compliance', 'DVV Verification', 'Placement Office',
                    'Recruitment Hub', 'Peer Review', 'Adjudicator Panel',
                    'RRC Panel', 'RAC Management', 'System Admin', 'Student Supervision'
                ];
                if (forbiddenGroups.includes(group.label)) return false;

                const forbiddenItems = ['Faculty Directory', 'Research Directory', 'Academic Reports'];
                if (forbiddenItems.includes(item.title)) return false;
            }

            if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
                console.warn(`NAV_HARDENING_ALERT: Item "${item.title}" lacks explicit permission metadata. Hidden by default.`);
                return false;
            }
            return item.requiredPermissions.some(p => hasPermission(p));
        })
    })).filter(group => group.items.length > 0);
};
