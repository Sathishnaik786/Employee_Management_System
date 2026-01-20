const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const WorkflowService = require('../workflow/workflow.service');
const logger = require('@lib/logger');

class RRCService {
    /**
     * Create a new RRC submission (Synopsis/Thesis).
     */
    async createSubmission(submissionData, user) {
        const payload = {
            ...submissionData,
            status: 'SUBMITTED'
        };

        const { data, error } = await supabaseAdmin
            .from('rrc_submissions')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'RRC_SUBMISSION_CREATED',
            entity: 'rrc_submissions',
            entityId: data.id,
            metadata: { type: data.submission_type }
        });

        // Initiate RRC Document Review Workflow
        try {
            await WorkflowService.initiateWorkflow('rrc_submission', data.id, user);
        } catch (wfErr) {
            logger.error('Failed to initiate RRC workflow', { error: wfErr.message, submissionId: data.id });
        }

        return data;
    }

    /**
     * Conduct an RRC review (DRC/Admin).
     */
    async conductReview(submissionId, reviewData, user) {
        const { data, error } = await supabaseAdmin
            .from('rrc_reviews')
            .insert([{
                rrc_submission_id: submissionId,
                reviewer_id: user.id,
                remarks: reviewData.remarks,
                decision: reviewData.decision
            }])
            .select()
            .single();

        if (error) throw error;

        // Note: The status update on rrc_submissions happens via the workflow engine
        // when the final action is taken.

        await PermissionService.logAction({
            userId: user.id,
            action: 'RRC_REVIEW_COMPLETED',
            entity: 'rrc_reviews',
            entityId: data.id,
            metadata: { decision: reviewData.decision }
        });

        return data;
    }

    /**
     * Get submissions assigned to an adjudicator.
     */
    async listAssignedThesis(user) {
        const { data, error } = await supabaseAdmin
            .from('rrc_reviews')
            .select('*, submission:rrc_submissions(*, student:students(full_name))')
            .eq('reviewer_id', user.id);

        if (error) throw error;
        return data;
    }

    /**
     * Adjudicator: Submit thesis evaluation.
     */
    async submitEvaluation(reviewId, evaluationData, user) {
        // 1. Validate Assignment
        const { data: assignment, error: assignError } = await supabaseAdmin
            .from('rrc_reviews')
            .select('id, reviewer_id')
            .eq('id', reviewId)
            .single();

        if (assignError || !assignment || assignment.reviewer_id !== user.id) {
            throw new Error('Forbidden: You are not assigned to this thesis evaluation.');
        }

        // 2. Submit Evaluation
        const { data, error } = await supabaseAdmin
            .from('rrc_reviews')
            .update({
                remarks: evaluationData.remarks,
                decision: evaluationData.decision,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', reviewId)
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'THESIS_EVALUATION_SUBMITTED',
            entity: 'rrc_reviews',
            entityId: data.id,
            metadata: { decision: evaluationData.decision, thesis_id: data.rrc_submission_id }
        });

        return data;
    }

    /**
     * RRC Member: Submit recommendation for a submission.
     */
    async submitRecommendation(submissionId, recommendationData, user) {
        // 1. Verify Workflow Step
        const { data: instance } = await supabaseAdmin
            .from('workflow_instances')
            .select('current_step, status')
            .eq('entity_type', 'rrc_submission')
            .eq('entity_id', submissionId)
            .maybeSingle();

        if (!instance || instance.status !== 'IN_PROGRESS') {
            throw new Error('No active workflow found for this submission.');
        }

        // Normally we'd check step name/order, but for this phase we enforce the role in performAction

        // 2. Perform Workflow Action
        await WorkflowService.performAction(instance.id, {
            action: recommendationData.decision, // APPROVE or REJECT
            remarks: recommendationData.remarks
        }, user);

        await PermissionService.logAction({
            userId: user.id,
            action: 'RRC_RECOMMENDATION_SUBMITTED',
            entity: 'rrc_submissions',
            entityId: submissionId,
            metadata: { decision: recommendationData.decision }
        });

        return true;
    }

    /**
     * Get submission by ID.
     */
    async getById(id, user) {
        const { data, error } = await supabaseAdmin
            .from('rrc_submissions')
            .select('*, student:students(*), reviews:rrc_reviews(*)')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        // 3. Backend Enforcement (Task 3)
        // Adjudicator Scoping
        if (user.role === 'ADJUDICATOR') {
            const isAssigned = data.reviews.some(r => r.reviewer_id === user.id);
            if (!isAssigned) {
                throw new Error('Forbidden: You can only access assigned thesis evaluations.');
            }
            // Cannot view full student profiles (Task 3)
            delete data.student;
            // Cannot see other reviews? (Maybe keep it simple)
        }

        // RRC Member Scoping
        if (user.role === 'RRC_MEMBER') {
            // Read-only access to adjudicator reports is already handled by not having an update method for them
            // Cannot modify thesis files (Already enforced by no update method for document_ref)
        }

        // Student Scoping
        if (user.role === 'STUDENT') {
            const { data: student } = await supabaseAdmin
                .from('students')
                .select('id')
                .eq('email', user.email)
                .single();
            if (!student || student.id !== data.student_id) {
                throw new Error('Forbidden');
            }
        }

        return data;
    }
}

module.exports = new RRCService();
