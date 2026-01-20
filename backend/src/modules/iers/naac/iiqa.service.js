const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const WorkflowService = require('../workflow/workflow.service');
const logger = require('@lib/logger');

class IIQAService {
    async create(data, user) {
        const payload = {
            ...data,
            status: 'DRAFT',
            submitted_by: user.id
        };

        const { data: iiqa, error } = await supabaseAdmin
            .from('naac_iiqa')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_IIQA_CREATED',
            entity: 'naac_iiqa',
            entityId: iiqa.id,
            metadata: { institution_code: data.institution_code, academic_year: data.academic_year }
        });

        return iiqa;
    }

    async submit(id, user) {
        const { data: iiqa, error: fetchErr } = await supabaseAdmin
            .from('naac_iiqa')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchErr || !iiqa) throw new Error('IIQA not found');
        if (iiqa.status !== 'DRAFT') throw new Error('Only DRAFT IIQA can be submitted');

        const { error: updateErr } = await supabaseAdmin
            .from('naac_iiqa')
            .update({
                status: 'SUBMITTED',
                submitted_at: new Date().toISOString()
            })
            .eq('id', id);

        if (updateErr) throw updateErr;

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_IIQA_SUBMITTED',
            entity: 'naac_iiqa',
            entityId: id,
            metadata: { academic_year: iiqa.academic_year }
        });

        // Initiate IIQA Approval Workflow
        try {
            await WorkflowService.initiateWorkflow('naac_iiqa', id, user);
        } catch (wfErr) {
            logger.error('Failed to initiate IIQA workflow', { error: wfErr.message, iiqaId: id });
        }

        return true;
    }

    async getById(id, user) {
        const { data, error } = await supabaseAdmin
            .from('naac_iiqa')
            .select('*, ssr:naac_ssr(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new IIQAService();
