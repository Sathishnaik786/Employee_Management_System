const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const logger = require('@lib/logger');

class WorkflowService {
    /**
     * Create a new workflow definition.
     */
    async createWorkflow(workflowData, user) {
        const { data, error } = await supabaseAdmin
            .from('workflows')
            .insert([{ ...workflowData, created_by: user.id }])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'WORKFLOW_CREATED',
            entity: 'workflows',
            entityId: data.id,
            metadata: { name: data.name },
        });

        return data;
    }

    /**
     * Add steps to an existing workflow.
     */
    async addWorkflowSteps(workflowId, steps, user) {
        const payload = steps.map((step) => ({
            ...step,
            workflow_id: workflowId,
        }));

        const { data, error } = await supabaseAdmin
            .from('workflow_steps')
            .insert(payload)
            .select();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'WORKFLOW_STEPS_CONFIGURED',
            entity: 'workflows',
            entityId: workflowId,
            metadata: { step_count: steps.length },
        });

        return data;
    }

    /**
     * Initiate a workflow instance for a specific entity record.
     */
    async initiateWorkflow(entityType, entityId, user) {
        // 1. Find the active workflow for this entity type
        const { data: workflow, error: wfError } = await supabaseAdmin
            .from('workflows')
            .select('id')
            .eq('entity_type', entityType)
            .eq('is_active', true)
            .maybeSingle();

        if (wfError || !workflow) {
            throw new Error(`No active workflow found for entity type: ${entityType}`);
        }

        // 2. Check if an instance already exists
        const { data: existing, error: exError } = await supabaseAdmin
            .from('workflow_instances')
            .select('id, status')
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .maybeSingle();

        if (existing && existing.status === 'IN_PROGRESS') {
            throw new Error('A workflow is already in progress for this record.');
        }

        // 3. Create instance
        const { data: instance, error: instError } = await supabaseAdmin
            .from('workflow_instances')
            .insert([
                {
                    workflow_id: workflow.id,
                    entity_type: entityType,
                    entity_id: entityId,
                    current_step: 1,
                    status: 'IN_PROGRESS',
                    initiated_by: user.id,
                },
            ])
            .select()
            .single();

        if (instError) throw instError;

        await PermissionService.logAction({
            userId: user.id,
            action: 'WORKFLOW_INITIATED',
            entity: 'workflow_instances',
            entityId: instance.id,
            metadata: { entity_type: entityType, entity_id: entityId },
        });

        return instance;
    }

    /**
     * Perform an approval or rejection action.
     */
    async performAction(instanceId, actionData, user) {
        const { action, remarks, next_step_payload } = actionData;

        // 1. Get instance and current step details
        const { data: instance, error: instError } = await supabaseAdmin
            .from('workflow_instances')
            .select('*, workflow:workflows(*)')
            .eq('id', instanceId)
            .single();

        if (instError || !instance) throw new Error('Workflow instance not found');
        if (instance.status !== 'IN_PROGRESS') throw new Error('Workflow is not in progress');

        const { data: step, error: stepError } = await supabaseAdmin
            .from('workflow_steps')
            .select('*')
            .eq('workflow_id', instance.workflow_id)
            .eq('step_order', instance.current_step)
            .single();

        if (stepError || !step) throw new Error('Current workflow step not found');

        // 2. Authorize actor role
        const isAuthorizedRole = step.approver_roles.includes(user.role);
        if (!isAuthorizedRole) {
            throw new Error(`Forbidden: Role ${user.role} is not authorized for this business action.`);
        }

        // 2.1 Strict Workflow-Step Authority Enforcement (Task 3)
        if (user.role === 'MANAGEMENT') {
            throw new Error('Forbidden: Management has read-only access and cannot perform workflow actions.');
        }

        // Ensure Principal does not interfere with early academic steps
        const isAcademicStep = step.approver_roles.some(r => ['DRC_MEMBER', 'RAC_MEMBER', 'RRC_MEMBER', 'ADJUDICATOR'].includes(r));
        if (user.role === 'PRINCIPAL' && isAcademicStep) {
            throw new Error('Forbidden: Principal cannot intervene in departmental academic evaluations.');
        }

        if (step.approver_roles.includes('DRC_MEMBER') && user.role !== 'DRC_MEMBER' && user.role !== 'ADMIN') {
            throw new Error('Forbidden: Only DRC Members can perform this action.');
        }
        if (step.approver_roles.includes('RAC_MEMBER') && user.role !== 'RAC_MEMBER' && user.role !== 'ADMIN') {
            throw new Error('Forbidden: Only RAC Members can perform this action.');
        }
        if (step.approver_roles.includes('PRINCIPAL') && user.role !== 'PRINCIPAL' && user.role !== 'ADMIN') {
            throw new Error('Forbidden: Only the Principal can perform final approval.');
        }

        // 2.2 Validate Committee Assignment (Task 4)
        if (instance.entity_type === 'phd_application' && step.step_name.includes('Interview')) {
            const { data: interview } = await supabaseAdmin
                .from('phd_interviews')
                .select('panel')
                .eq('application_id', instance.entity_id)
                .maybeSingle();

            if (interview && interview.panel) {
                const isAssigned = interview.panel.includes(user.iersId) || interview.panel.includes(user.id);
                if (!isAssigned && user.role !== 'ADMIN') {
                    throw new Error('Forbidden: You are not assigned to this interview panel.');
                }
            }
        }

        if (instance.entity_type === 'rac_meeting') {
            const { data: meeting } = await supabaseAdmin
                .from('rac_meetings')
                .select('committee_members')
                .eq('id', instance.entity_id)
                .single();

            if (meeting && meeting.committee_members) {
                const isAssigned = meeting.committee_members.includes(user.iersId) || meeting.committee_members.includes(user.id);
                if (!isAssigned && user.role !== 'ADMIN') {
                    throw new Error('Forbidden: You are not a member of this RAC committee.');
                }
            }
        }

        // 3. Record the action
        const { data: wfAction, error: actionErr } = await supabaseAdmin
            .from('workflow_actions')
            .insert([
                {
                    workflow_instance_id: instanceId,
                    step_id: step.id,
                    actor_id: user.id,
                    actor_role: user.role,
                    action,
                    remarks,
                },
            ])
            .select()
            .single();

        if (actionErr) throw actionErr;

        // 3.1 Audit Log (Task 6)
        await PermissionService.logAction({
            userId: user.id,
            action: `WORKFLOW_${action}`,
            entity: instance.entity_type,
            entityId: instance.entity_id,
            metadata: {
                workflow_id: instance.workflow_id,
                instance_id: instanceId,
                step_name: step.step_name,
                role: user.role,
                remarks
            }
        });

        // 4. Handle logic
        if (action === 'REJECT') {
            await this.closeWorkflow(instanceId, 'REJECTED', user);
        } else if (action === 'SCHEDULE') {
            // Handle scheduling logic (e.g. for interviews)
            if (instance.entity_type === 'phd_application') {
                await this.handleScheduling(instance, next_step_payload, user);
            }
            // For now, scheduling might not advance the step unless intended.
            // But prompt says "Advance workflow_instances.current_step_id"
            await this.moveToNextStep(instance, user);
        } else {
            // action === 'APPROVE'
            if (step.approval_type === 'SEQUENTIAL') {
                await this.moveToNextStep(instance, user);
            } else {
                // PARALLEL
                const allApproved = await this.resolveParallelApprovals(instanceId, step);
                if (allApproved) {
                    await this.moveToNextStep(instance, user);
                }
            }
        }

        return true;
    }

    /**
     * Check if all required roles in a parallel step have approved.
     */
    async resolveParallelApprovals(instanceId, step) {
        const { data: actions, error } = await supabaseAdmin
            .from('workflow_actions')
            .select('actor_role')
            .eq('workflow_instance_id', instanceId)
            .eq('step_id', step.id)
            .eq('action', 'APPROVE');

        if (error) throw error;

        const approvedRoles = actions.map((a) => a.actor_role);
        // All required roles from approver_roles must be present in approvedRoles
        return step.approver_roles.every((role) => approvedRoles.includes(role));
    }

    /**
     * Move instance to the next step or approve it if it was the last step.
     */
    async moveToNextStep(instance, user) {
        const nextStepOrder = instance.current_step + 1;

        // Check if next step exists
        const { data: nextStep, error } = await supabaseAdmin
            .from('workflow_steps')
            .select('id')
            .eq('workflow_id', instance.workflow_id)
            .eq('step_order', nextStepOrder)
            .maybeSingle();

        if (error) throw error;

        if (nextStep) {
            await supabaseAdmin
                .from('workflow_instances')
                .update({ current_step: nextStepOrder })
                .eq('id', instance.id);
        } else {
            // No more steps -> Fully APPROVED
            await this.closeWorkflow(instance.id, 'APPROVED', user);
        }
    }

    /**
     * Finalize the workflow instance and notify the originating entity.
     */
    async closeWorkflow(instanceId, finalStatus, user) {
        const { data: instance, error } = await supabaseAdmin
            .from('workflow_instances')
            .update({ status: finalStatus })
            .eq('id', instanceId)
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: `WORKFLOW_${finalStatus}`,
            entity: 'workflow_instances',
            entityId: instanceId,
            metadata: { status: finalStatus },
        });

        // Notify/Update entity record
        await this.notifyEntityUpdated(instance);

        // 5. Post-Approval Hooks (Task 4)
        if (finalStatus === 'APPROVED') {
            await this.handlePostApproval(instance, user);
        }
    }

    /**
     * Handles specific terminal events like degree award generation.
     */
    async handlePostApproval(instance, user) {
        if (instance.entity_type === 'rrc_submission' || instance.entity_type === 'phd_application') {
            logger.info(`Final Authority Approval: Initiating Degree Protocol for ${instance.entity_id}`);

            // Post-approval: Mark degree as ready for generation
            // In a real system, this would call a PDF service or update a 'certificates' table
            await PermissionService.logAction({
                userId: user.id,
                action: 'DEGREE_CERTIFICATE_READY',
                entity: instance.entity_type,
                entityId: instance.entity_id,
                metadata: { workflow_id: instance.id, role: user.role }
            });
        }
    }

    /**
     * Core Integration Point: Updates the entity record status based on workflow results.
     */
    async notifyEntityUpdated(instance) {
        const { entity_type, entity_id, status } = instance;

        try {
            if (entity_type === 'phd_application') {
                const PhDService = require('../phd/phd.service');
                const nextStatus = status === 'APPROVED' ? 'INTERVIEW_SCHEDULED' : 'CANCELLED';

                // We use a internal update bypass to prevent recursive workflow initiation
                // For simplicity in this phase, we update the table directly via admin client
                // but normally we would call a specific internal method in PhDService.
                await supabaseAdmin
                    .from('phd_applications')
                    .update({
                        status: nextStatus,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', entity_id);

                logger.info(`PhD Application ${entity_id} updated to ${nextStatus} via workflow ${status}`);
            } else if (entity_type === 'rac_meeting') {
                const nextRecommendation = status === 'APPROVED' ? 'CONTINUE' : 'CANCEL';
                await supabaseAdmin
                    .from('rac_meetings')
                    .update({ recommendation: nextRecommendation })
                    .eq('id', entity_id);
                logger.info(`RAC Meeting ${entity_id} recommendation updated to ${nextRecommendation} via workflow`);
            } else if (entity_type === 'rrc_submission') {
                const nextStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';
                await supabaseAdmin
                    .from('rrc_submissions')
                    .update({ status: nextStatus })
                    .eq('id', entity_id);
                logger.info(`RRC Submission ${entity_id} status updated to ${nextStatus} via workflow`);
            } else if (entity_type === 'naac_iiqa') {
                const nextStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';
                await supabaseAdmin
                    .from('naac_iiqa')
                    .update({ status: nextStatus })
                    .eq('id', entity_id);
                logger.info(`NAAC IIQA ${entity_id} status updated to ${nextStatus} via workflow`);
            } else if (entity_type === 'naac_ssr') {
                const nextStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';
                await supabaseAdmin
                    .from('naac_ssr')
                    .update({ status: nextStatus })
                    .eq('id', entity_id);
                logger.info(`NAAC SSR ${entity_id} status updated to ${nextStatus} via workflow`);
            } else if (entity_type === 'naac_dvv') {
                const nextStatus = status === 'APPROVED' ? 'CLOSED' : 'OPEN';
                await supabaseAdmin
                    .from('naac_dvv')
                    .update({ status: nextStatus })
                    .eq('id', entity_id);
                logger.info(`NAAC DVV ${entity_id} status updated to ${nextStatus} via workflow`);

                if (status === 'APPROVED') {
                    // Auto-trigger QNM calculation for the group
                    const { data: dvv } = await supabaseAdmin.from('naac_dvv').select('ssr_id').eq('id', entity_id).single();
                    const { data: ssr } = await supabaseAdmin.from('naac_ssr').select('iiqa_id').eq('id', dvv.ssr_id).single();
                    const DVVService = require('../naac/dvv.service');
                    await DVVService.calculateQNM(ssr.iiqa_id, { id: 'SYSTEM' });
                }
            } else if (entity_type === 'placement_drive') {
                const nextStatus = status === 'APPROVED' ? 'PUBLISHED' : 'CANCELLED';
                await supabaseAdmin
                    .from('placement_drives')
                    .update({ status: nextStatus })
                    .eq('id', entity_id);
                logger.info(`Placement Drive ${entity_id} status updated to ${nextStatus} via workflow`);
            } else if (entity_type === 'training_program') {
                // Log training program approval
                logger.info(`Training Program ${entity_id} fully approved via workflow`);
            }
            // Add other entities here...
        } catch (err) {
            logger.error('Failed to notify entity update after workflow completion', {
                error: err.message,
                entity_type,
                entity_id,
            });
        }
    }

    /**
     * Specific handler for scheduling actions (e.g. PhD Interviews)
     */
    async handleScheduling(instance, payload, user) {
        if (instance.entity_type === 'phd_application' && payload?.interview_date) {
            // Upsert into phd_interviews
            const { error } = await supabaseAdmin
                .from('phd_interviews')
                .upsert({
                    application_id: instance.entity_id,
                    interview_date: payload.interview_date,
                    panel: payload.panel || [],
                    remarks: payload.remarks || 'Scheduled via workflow'
                }, { onConflict: 'application_id' });

            if (error) {
                logger.error('Failed to schedule PhD interview', { error: error.message, appId: instance.entity_id });
                throw new Error('Failed to record interview schedule');
            }

            // Update application status
            await supabaseAdmin
                .from('phd_applications')
                .update({ status: 'INTERVIEW_SCHEDULED' })
                .eq('id', instance.entity_id);
        }
    }

    /**
     * Get all pending workflow instances for the current user's role.
     */
    async getPendingActions(user) {
        // 1. Fetch all in-progress instances
        const { data: instances, error: instError } = await supabaseAdmin
            .from('workflow_instances')
            .select('*, workflow:workflows(*)')
            .eq('status', 'IN_PROGRESS');

        if (instError) throw instError;
        if (!instances) return [];

        // 2. Fetch steps for these instances to check roles
        const workflowIds = [...new Set(instances.map(i => i.workflow_id))];
        const { data: steps, error: stepError } = await supabaseAdmin
            .from('workflow_steps')
            .select('*')
            .in('workflow_id', workflowIds);

        if (stepError) throw stepError;

        // 3. Filter instances where the current step's approver_roles contains the user's role
        const filteredInstances = instances.filter(instance => {
            const currentStep = steps.find(s => s.workflow_id === instance.workflow_id && s.step_order === instance.current_step);
            return currentStep && currentStep.approver_roles.includes(user.role);
        });

        return filteredInstances;
    }
}

module.exports = new WorkflowService();
