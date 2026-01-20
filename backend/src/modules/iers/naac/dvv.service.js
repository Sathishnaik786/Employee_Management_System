const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const WorkflowService = require('../workflow/workflow.service');
const logger = require('@lib/logger');

class DVVService {
    async respond(id, data, user) {
        const { response } = data;

        const { data: dvv, error: fetchErr } = await supabaseAdmin
            .from('naac_dvv')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchErr || !dvv) throw new Error('DVV query not found');

        const { error: updateErr } = await supabaseAdmin
            .from('naac_dvv')
            .update({
                response,
                status: 'RESPONDED'
            })
            .eq('id', id);

        if (updateErr) throw updateErr;

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_DVV_RESPONDED',
            entity: 'naac_dvv',
            entityId: id,
            metadata: { status: 'RESPONDED' }
        });

        // Initiate DVV Workflow
        try {
            await WorkflowService.initiateWorkflow('naac_dvv', id, user);
        } catch (wfErr) {
            logger.error('Failed to initiate DVV workflow', { error: wfErr.message, dvvId: id });
        }

        return true;
    }

    async calculateQNM(iiqaId, user) {
        // Logic to calculate scores based on SSR/DVV
        // This is a placeholder for the actual calculation algorithm
        const metrics = [
            { code: 'QNM-1.1.1', raw: 4, weighted: 16 },
            { code: 'QNM-2.1.2', raw: 3, weighted: 12 }
        ];

        for (const m of metrics) {
            await supabaseAdmin.from('naac_qnm').upsert([{
                iiqa_id: iiqaId,
                metric_code: m.code,
                raw_score: m.raw,
                weighted_score: m.weighted
            }], { onConflict: 'iiqa_id, metric_code' });
        }

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_QNM_CALCULATED',
            entity: 'naac_iiqa',
            entityId: iiqaId,
            metadata: { metric_count: metrics.length }
        });

        return metrics;
    }

    async getById(id, user) {
        const { data, error } = await supabaseAdmin
            .from('naac_dvv')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new DVVService();
