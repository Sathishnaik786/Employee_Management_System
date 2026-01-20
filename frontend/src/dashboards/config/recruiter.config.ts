import { DashboardConfig } from '../types';
import { Briefcase, FileText, GraduationCap, Network, ShieldCheck } from 'lucide-react';
import { PERMISSIONS } from '@/access/permissions';

export const recruiterDashboardConfig: DashboardConfig = {
    id: 'recruiter_dashboard',
    title: 'Recruitment Hub (Corporate Partner)',
    widgets: [
        {
            id: 'active_job_postings',
            type: 'METRIC',
            title: 'Active Job Postings',
            size: 'sm',
            permissions: [PERMISSIONS.JOB_POST_CREATE],
            props: {
                icon: FileText,
                color: 'primary'
            }
        },
        {
            id: 'shortlisted_candidates',
            type: 'METRIC',
            title: 'Shortlisted Candidates',
            size: 'sm',
            permissions: [PERMISSIONS.CANDIDATE_SHORTLIST_VIEW],
            props: {
                icon: GraduationCap,
                color: 'success'
            }
        },
        {
            id: 'interview_rounds_scheduled',
            type: 'METRIC',
            title: 'Interviews Scheduled',
            size: 'sm',
            permissions: [PERMISSIONS.INTERVIEW_SCHEDULE_MANAGE],
            props: {
                icon: Network,
                color: 'warning'
            }
        },
        {
            id: 'candidate_selection_queue',
            type: 'WORKFLOW_INBOX',
            title: 'Candidate Evaluation Queue',
            size: 'lg',
            permissions: [PERMISSIONS.CANDIDATE_SHORTLIST_VIEW],
            props: {
                title: 'Review and Feedback'
            }
        },
        {
            id: 'recruiter_actions',
            type: 'RECENT_ACTIVITY',
            title: 'Recent Recruitment Activity',
            size: 'lg',
            permissions: [PERMISSIONS.JOB_POST_CREATE],
            props: {
                title: 'Company Feed'
            }
        }
    ]
};
