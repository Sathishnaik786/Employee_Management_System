const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const WorkflowService = require('../workflow/workflow.service');
const logger = require('@lib/logger');

class RACService {
    /**
     * Create a new RAC meeting record and initiate workflow.
     */
    async createMeeting(meetingData, user) {
        const payload = {
            ...meetingData,
            created_by: user.id
        };

        const { data, error } = await supabaseAdmin
            .from('rac_meetings')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'RAC_MEETING_CREATED',
            entity: 'rac_meetings',
            entityId: data.id,
            metadata: { student_id: data.student_id }
        });

        // Initiate RAC Progress Review Workflow
        try {
            await WorkflowService.initiateWorkflow('rac_meeting', data.id, user);
        } catch (wfErr) {
            logger.error('Failed to initiate RAC workflow', { error: wfErr.message, meetingId: data.id });
        }

        return data;
    }

    /**
     * Submit progress report for a meeting.
     */
    async submitProgress(meetingId, progressData, user) {
        // Enforce ownership: student can only submit for their own meetings
        const { data: meeting, error: fetchErr } = await supabaseAdmin
            .from('rac_meetings')
            .select('student_id')
            .eq('id', meetingId)
            .single();

        if (fetchErr || !meeting) throw new Error('Meeting not found');

        // Check ownership if user is a student
        if (user.role === 'STUDENT') {
            const { data: student } = await supabaseAdmin
                .from('students')
                .select('id')
                .eq('email', user.email)
                .single();

            if (!student || student.id !== meeting.student_id) {
                const error = new Error('Forbidden: You can only submit progress for your own record');
                error.status = 403;
                throw error;
            }
        }

        const { data, error } = await supabaseAdmin
            .from('rac_progress_reports')
            .insert([{ ...progressData, rac_meeting_id: meetingId }])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'RAC_PROGRESS_SUBMITTED',
            entity: 'rac_progress_reports',
            entityId: data.id,
            metadata: { meetingId }
        });

        return data;
    }

    /**
     * Conduct a meeting review (DRC/Committee).
     */
    async conductReview(meetingId, reviewData, user) {
        // 1. Verify committee membership
        const { data: meeting, error: fetchErr } = await supabaseAdmin
            .from('rac_meetings')
            .select('committee_members')
            .eq('id', meetingId)
            .single();

        if (fetchErr || !meeting) throw new Error('Meeting not found');

        // Allow ADMIN or HOD or committee members
        const isCommitteeMember = meeting.committee_members.includes(user.id);
        if (user.role !== 'ADMIN' && user.role !== 'HOD' && !isCommitteeMember) {
            const error = new Error('Forbidden: You are not a member of this RAC committee');
            error.status = 403;
            throw error;
        }

        const { data, error } = await supabaseAdmin
            .from('rac_meetings')
            .update({
                recommendation: reviewData.recommendation,
                minutes: reviewData.minutes
            })
            .eq('id', meetingId)
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'RAC_REVIEW_COMPLETED',
            entity: 'rac_meetings',
            entityId: meetingId,
            metadata: { recommendation: reviewData.recommendation }
        });

        return data;
    }

    /**
     * Get meeting by ID with ownership check.
     */
    async getById(id, user) {
        const { data, error } = await supabaseAdmin
            .from('rac_meetings')
            .select('*, student:students(*), progress:rac_progress_reports(*)')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        // Scoping
        if (user.role === 'STUDENT') {
            const { data: student } = await supabaseAdmin
                .from('students')
                .select('id')
                .eq('email', user.email)
                .single();
            if (!student || student.id !== data.student_id) {
                const error = new Error('Forbidden');
                error.status = 403;
                throw error;
            }
        }

        return data;
    }
}

module.exports = new RACService();
