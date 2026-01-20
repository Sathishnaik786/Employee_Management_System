const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const WorkflowService = require('../workflow/workflow.service');
const logger = require('@lib/logger');

class NAACService {
    /**
     * Create IIQA record.
     */
    async createIIQA(iiqaData, user) {
        const payload = {
            ...iiqaData,
            status: 'DRAFT',
            submitted_by: user.id
        };

        const { data, error } = await supabaseAdmin
            .from('naac_iiqa')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_IIQA_CREATED',
            entity: 'naac_iiqa',
            entityId: data.id,
            metadata: { institution_code: data.institution_code, academic_year: data.academic_year }
        });

        return data;
    }

    /**
     * Update SSR Section.
     */
    async updateSSR(ssrData, user) {
        // Enforce IQAC_MEMBER can edit (covered by route permissions)
        const { data, error } = await supabaseAdmin
            .from('naac_ssr')
            .upsert({
                ...ssrData,
                created_by: user.id,
                status: 'DRAFT'
            }, { onConflict: 'iiqa_id,section_code' })
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_SSR_UPDATED',
            entity: 'naac_ssr',
            entityId: data.id,
            metadata: { section_code: data.section_code }
        });

        return data;
    }

    /**
     * Submit SSR for DVV Verification.
     */
    async submitForDVV(ssrId, user) {
        // Initiate NAAC Workflow
        try {
            await WorkflowService.initiateWorkflow('naac_ssr', ssrId, user);

            await supabaseAdmin
                .from('naac_ssr')
                .update({ status: 'UNDER_DVV' })
                .eq('id', ssrId);

            await PermissionService.logAction({
                userId: user.id,
                action: 'NAAC_SSR_SUBMITTED_DVV',
                entity: 'naac_ssr',
                entityId: ssrId,
                metadata: { role: user.role }
            });
        } catch (wfErr) {
            logger.error('Failed to initiate NAAC workflow', { error: wfErr.message, ssrId });
            throw wfErr;
        }
        return true;
    }

    /**
     * DVV: Raise Clarification.
     */
    async raiseClarification(ssrId, query, user) {
        const payload = {
            ssr_id: ssrId,
            query: query,
            status: 'OPEN'
        };

        const { data, error } = await supabaseAdmin
            .from('naac_dvv')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'NAAC_DVV_CLARIFICATION_RAISED',
            entity: 'naac_dvv',
            entityId: data.id,
            metadata: { ssr_id: ssrId }
        });

        return data;
    }

    /**
     * Get SSR by ID with DVV and Reviews.
     */
    async getSSRById(id, user) {
        const { data, error } = await supabaseAdmin
            .from('naac_ssr')
            .select('*, dvv:naac_dvv(*)')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        // Scoping / Restrictions (Task 3)
        if (user.role === 'DVV_VERIFIER' || user.role === 'EXTERNAL_REVIEWER') {
            // Read-only check is handled by route permissions for modification methods
        }

        return data;
    }
}

module.exports = new NAACService();
