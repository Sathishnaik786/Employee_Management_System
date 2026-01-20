const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const WorkflowService = require('../workflow/workflow.service');
const logger = require('@lib/logger');

class SSRService {
    async create(data, user) {
        const payload = {
            ...data,
            status: 'DRAFT',
            created_by: user.id
        };

        const { data: ssr, error } = await supabaseAdmin
            .from('naac_ssr')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_SSR_CREATED',
            entity: 'naac_ssr',
            entityId: ssr.id,
            metadata: { criterion_no: data.criterion_no, section_code: data.section_code }
        });

        return ssr;
    }

    async update(id, data, user) {
        const { data: ssr, error } = await supabaseAdmin
            .from('naac_ssr')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_SSR_UPDATED',
            entity: 'naac_ssr',
            entityId: id,
            metadata: { status: ssr.status }
        });

        return ssr;
    }

    async submit(id, user) {
        const { data: ssr, error: fetchErr } = await supabaseAdmin
            .from('naac_ssr')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchErr || !ssr) throw new Error('SSR section not found');

        const { error: updateErr } = await supabaseAdmin
            .from('naac_ssr')
            .update({ status: 'SUBMITTED' })
            .eq('id', id);

        if (updateErr) throw updateErr;

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_SSR_SUBMITTED',
            entity: 'naac_ssr',
            entityId: id,
            metadata: { section_code: ssr.section_code }
        });

        // Initiate SSR Approval Workflow
        try {
            await WorkflowService.initiateWorkflow('naac_ssr', id, user);
        } catch (wfErr) {
            logger.error('Failed to initiate SSR workflow', { error: wfErr.message, ssrId: id });
        }

        return true;
    }

    async getById(id, user) {
        const { data, error } = await supabaseAdmin
            .from('naac_ssr')
            .select('*, dvv:naac_dvv(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new SSRService();
