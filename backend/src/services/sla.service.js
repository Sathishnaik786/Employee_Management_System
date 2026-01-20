const { supabaseAdmin } = require('@lib/supabase');
const logger = require('@lib/logger');
const PermissionService = require('@services/permission.service');

class SLAService {
    /**
     * Periodic check for all Ph.D admission SLAs
     */
    async checkSLAs() {
        logger.info('SLA Engine: Starting Ph.D Lifecycle Audit...');

        try {
            await Promise.all([
                this.checkScrutinySLA(),
                this.checkInterviewSLA(),
                this.checkVerificationSLA(),
                this.checkExemptionSLA(),
                this.checkGuideAllocationSLA()
            ]);
        } catch (err) {
            logger.error('SLA Engine Error:', { error: err.message });
        }
    }

    /**
     * Escalates an application by logging and optionally tagging for intervention
     */
    async escalate(id, type, roleToNotify, tableName = 'phd_applications') {
        logger.warn(`SLA BREACH: ${type} for application ${id}. Notifying ${roleToNotify}.`);

        // 1. Mark as escalated to prevent double-flagging (Task 2)
        const { error: updErr } = await supabaseAdmin
            .from(tableName)
            .update({ is_sla_escalated: true })
            .eq(tableName === 'phd_applications' ? 'id' : 'application_id', id);

        if (updErr) {
            logger.error(`Failed to mark SLA escalation for ${id}`, { error: updErr.message });
            return;
        }

        // 2. Log Forensic Audit Entry
        await PermissionService.logAction({
            userId: null,
            action: 'SLA_BREACH_DETECTED',
            entity: tableName,
            entityId: id,
            metadata: {
                type,
                intervention_required_by: roleToNotify,
                timestamp: new Date().toISOString()
            }
        });
    }

    async checkScrutinySLA() {
        const { data } = await supabaseAdmin
            .from('phd_applications')
            .select('id')
            .eq('status', 'SUBMITTED')
            .eq('is_sla_escalated', false)
            .lt('due_at', new Date().toISOString());

        if (data) {
            for (const app of data) {
                await this.escalate(app.id, 'Scrutiny Delay', 'DRC_MEMBER');
            }
        }
    }

    async checkInterviewSLA() {
        const { data } = await supabaseAdmin
            .from('phd_interviews')
            .select('application_id')
            .is('completed_at', null)
            .eq('is_sla_escalated', false)
            .lt('due_at', new Date().toISOString());

        if (data) {
            for (const item of data) {
                await this.escalate(item.application_id, 'Interview Conduct Delay', 'FACULTY', 'phd_interviews');
            }
        }
    }

    async checkVerificationSLA() {
        const { data } = await supabaseAdmin
            .from('phd_applications')
            .select('id')
            .eq('status', 'INTERVIEW_COMPLETED')
            .eq('is_sla_escalated', false)
            .lt('due_at', new Date().toISOString());

        if (data) {
            for (const app of data) {
                await this.escalate(app.id, 'Document Verification Delay', 'DRC_MEMBER');
            }
        }
    }

    async checkExemptionSLA() {
        const { data } = await supabaseAdmin
            .from('phd_applications')
            .select('id')
            .eq('exemption_status', 'PENDING')
            .eq('is_sla_escalated', false)
            .lt('exemption_due_at', new Date().toISOString());

        if (data) {
            for (const app of data) {
                await this.escalate(app.id, 'Exemption Decision Delay', 'ADMIN');
            }
        }
    }

    async checkGuideAllocationSLA() {
        const { data } = await supabaseAdmin
            .from('phd_applications')
            .select('id')
            .eq('status', 'PAYMENT_COMPLETED')
            .eq('is_sla_escalated', false)
            .lt('due_at', new Date().toISOString());

        if (data) {
            for (const app of data) {
                await this.escalate(app.id, 'Guide Allocation Delay', 'HOD');
            }
        }
    }

    /**
     * Start the background engine
     */
    start(intervalMs = 3600000) { // Default 1 hour
        logger.info(`SLA Engine Initialized. Frequency: Every ${intervalMs / 1000 / 60} minutes.`);
        setInterval(() => this.checkSLAs(), intervalMs);
        // Run immediately on start
        this.checkSLAs();
    }
}

module.exports = new SLAService();
