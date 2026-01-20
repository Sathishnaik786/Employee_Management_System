const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const logger = require('@lib/logger');

class PhDService {
    /**
     * State transition rules
     */
    get ALLOWED_TRANSITIONS() {
        return {
            'DRAFT': ['SUBMITTED', 'CANCELLED'],
            'SUBMITTED': ['UNDER_SCRUTINY', 'CANCELLED'],
            'UNDER_SCRUTINY': ['QUALIFIED', 'REJECTED', 'CANCELLED'],
            'QUALIFIED': ['INTERVIEW_SCHEDULED', 'CANCELLED'],
            'INTERVIEW_SCHEDULED': ['INTERVIEW_COMPLETED', 'CANCELLED'],
            'INTERVIEW_COMPLETED': ['DOCUMENTS_VERIFIED', 'DOCUMENTS_REJECTED', 'CANCELLED'],
            'DOCUMENTS_VERIFIED': ['PAYMENT_PENDING', 'CANCELLED'],
            'PAYMENT_PENDING': ['PAYMENT_COMPLETED', 'CANCELLED'],
            'PAYMENT_COMPLETED': ['GUIDE_ALLOCATED', 'CANCELLED'],
            'REJECTED': ['CANCELLED'],
            'DOCUMENTS_REJECTED': ['CANCELLED'],
            'GUIDE_ALLOCATED': [],
            'CANCELLED': []
        };
    }

    /**
     * SLA Configuration (Task 3)
     */
    get SLA_DAYS() {
        return {
            'SUBMITTED': 30,
            'UNDER_SCRUTINY': 30, // Explicit 30 days as requested
            'QUALIFIED': 15, // Replaces SCRUTINY_APPROVED
            'INTERVIEW_SCHEDULED': 10,
            'INTERVIEW_COMPLETED': 10,
            'DOCUMENTS_VERIFIED': 30,
            'PAYMENT_PENDING': 7
        };
    }

    /**
     * Helper to set SLA deadlines
     */
    getDeadline(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }

    // ... (existing code) ...

    /**
     * Start Scrutiny (Move from SUBMITTED to UNDER_SCRUTINY)
     */
    async startScrutiny(id, user) {
        let currentStatus = 'UNKNOWN';

        try {
            // 1. Role Validation
            if (user.role !== 'DRC_MEMBER' && user.role !== 'ADMIN') {
                throw new Error('Forbidden: Only DRC Members or Admins can start scrutiny.');
            }

            // 2. Pre-fetch for Audit Context (Task 1)
            const { data: app, error: fetchErr } = await supabaseAdmin
                .from('phd_applications')
                .select('status')
                .eq('id', id)
                .single();

            if (fetchErr || !app) throw new Error('Application not found');
            currentStatus = app.status;

            // 3. SLA Verification (Task 3)
            const slaDays = this.SLA_DAYS['UNDER_SCRUTINY'];
            if (!slaDays) {
                throw new Error('Configuration Error: SLA missing for UNDER_SCRUTINY');
            }
            const deadline = this.getDeadline(slaDays);

            // 4. Transition & Atomic Log
            await this.processTransition(id, 'UNDER_SCRUTINY', user, deadline);

            // 5. Return updated record
            return this.getById(id, user);

        } catch (error) {
            // Task 1: Mandatory Logging
            logger.error('CRITICAL: Scrutiny Start Transition Failed', {
                application_id: id,
                current_status: currentStatus,
                actor_role: user.role,
                requested_transition: 'UNDER_SCRUTINY',
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Get all PhD applications with scoping.
     */
    async getAll(user) {
        let query = supabaseAdmin.from('phd_applications').select('*, student:students(*)');

        if (user.role === 'STUDENT') {
            query = query.eq('created_by', user.id);
        } else if (user.role === 'FACULTY' || user.role === 'DRC_MEMBER') {
            // Can see all for their department usually, but for now simple check
        } else if (user.role === 'ADMIN' || user.role === 'HOD') {
            // Full access
        } else {
            return [];
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    /**
     * Get application by ID with scoping.
     */
    async getById(id, user) {
        const { data, error } = await supabaseAdmin
            .from('phd_applications')
            .select(`
                *,
                student:students(*),
                scrutiny:phd_scrutiny(*),
                interviews:phd_interviews(*),
                document_verification:phd_document_verifications(*),
                payment:phd_payments(*),
                guide_allocation:phd_guide_allocations(*, faculty:faculty(*))
            `)
            .eq('id', id)
            .single();

        if (error || !data) return null;

        this.verifyOwnership(data, user);
        return data;
    }

    /**
     * Create application record.
     */
    async create(applicationData, user) {
        const appNo = `PHD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const payload = {
            ...applicationData,
            application_no: appNo,
            status: 'DRAFT',
            created_by: user.id
        };

        const { data, error } = await supabaseAdmin
            .from('phd_applications')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'PHD_APPLICATION_CREATED',
            entity: 'phd_applications',
            entityId: data.id,
            metadata: { application_no: data.application_no }
        });

        return data;
    }

    /**
     * CENTRALIZED TRANSITION GATE (Task 1)
     * Bypasses direct updates to enforce state machine and forensic audit.
     */
    async processTransition(id, nextStatus, user, dueAt = null, metadata = {}) {
        // 1. Validation (Pre-Check)
        const { data: app, error: fetchErr } = await supabaseAdmin
            .from('phd_applications')
            .select('status')
            .eq('id', id)
            .single();

        if (fetchErr || !app) throw new Error('Application not found');

        const allowed = this.ALLOWED_TRANSITIONS[app.status] || [];
        if (!allowed.includes(nextStatus)) {
            throw new Error(`State Violation: Cannot transition from ${app.status} to ${nextStatus}`);
        }

        // 2. Execute via Atomic DB Gate
        const { data, error } = await supabaseAdmin.rpc('process_phd_transition', {
            p_application_id: id,
            p_next_status: nextStatus,
            p_actor_id: user.id,
            p_actor_role: user.role,
            p_due_at: dueAt,
            p_metadata: metadata
        });

        if (error) throw error;
        return data;
    }

    /**
     * Submit application (FR-PHD-001)
     */
    async submit(id, user) {
        const deadline = this.getDeadline(30);
        await this.processTransition(id, 'SUBMITTED', user, deadline, {
            email_scheduled: true
        });

        logger.info(`FR-PHD-001: Confirmation email for ${id}`);
        return true;
    }


    /**
     * Apply for PET Exemption (FR-PHD-002)
     */
    async applyExemption(id, exemptionData, user) {
        if (user.role !== 'FACULTY' && user.role !== 'ADMIN') {
            throw new Error('Forbidden: Only Faculty/Admin can apply.');
        }

        const exemptionDeadline = this.getDeadline(7);

        // Update exemption details first (non-status fields)
        const { error: updErr } = await supabaseAdmin
            .from('phd_applications')
            .update({
                exemption_type: exemptionData.exemption_type,
                proof_url: exemptionData.proof_url,
                is_exempted: true,
                exemption_status: 'PENDING',
                exemption_due_at: exemptionDeadline,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (updErr) throw updErr;

        // No status change in the main lifecycle for exemption application itself usually,
        // but it sets exemption_status and due_at. 
        // The audit is still captured.
        await PermissionService.logAction({
            userId: user.id,
            action: 'PHD_EXEMPTION_APPLIED',
            entity: 'phd_applications',
            entityId: id,
            metadata: { exemption_type: exemptionData.exemption_type, due_at: exemptionDeadline }
        });

        return true;
    }

    /**
     * Scrutiny Review (FR-PHD-003)
     */
    async scrutinyReview(id, reviewData, user) {
        // Canonical Mapping: APPROVED -> QUALIFIED, REJECTED -> REJECTED
        const nextStatus = reviewData.decision === 'APPROVED' ? 'QUALIFIED' : 'REJECTED';
        const interviewDeadline = reviewData.decision === 'APPROVED' ? this.getDeadline(15) : null;

        // 1. Transactional transition
        await this.processTransition(id, nextStatus, user, interviewDeadline, {
            decision: reviewData.decision,
            remarks: reviewData.remarks
        });

        // 2. Insert record
        await supabaseAdmin.from('phd_scrutiny').insert([{
            application_id: id,
            reviewer_id: user.id,
            remarks: reviewData.remarks,
            decision: reviewData.decision,
            reviewed_at: new Date().toISOString()
        }]);

        return true;
    }

    /**
     * Schedule Interview (FR-PHD-004)
     */
    async scheduleInterview(id, scheduleData, user) {
        const conductionDeadline = this.getDeadline(10);

        await this.processTransition(id, 'INTERVIEW_SCHEDULED', user, conductionDeadline, {
            interview_date: scheduleData.interview_date
        });

        await supabaseAdmin.from('phd_interviews').insert([{
            application_id: id,
            interview_date: scheduleData.interview_date,
            panel: scheduleData.panel,
            due_at: conductionDeadline
        }]);

        return true;
    }

    /**
     * Complete Interview (FR-PHD-005)
     */
    async completeInterview(id, resultData, user) {
        const verificationDeadline = this.getDeadline(10);

        await this.processTransition(id, 'INTERVIEW_COMPLETED', user, verificationDeadline, {
            score: resultData.score,
            recommendation: resultData.recommendation
        });

        await supabaseAdmin
            .from('phd_interviews')
            .update({
                score: resultData.score,
                recommendation: resultData.recommendation,
                remarks: resultData.remarks,
                completed_at: new Date().toISOString()
            })
            .eq('application_id', id);

        return true;
    }

    /**
     * Document Verification (FR-PHD-006)
     */
    async verifyDocuments(id, verificationData, user) {
        const nextLifecycleStatus = verificationData.status === 'VERIFIED' ? 'PAYMENT_PENDING' : 'DOCUMENTS_REJECTED';

        await this.processTransition(id, nextLifecycleStatus, user, null, {
            verification_status: verificationData.status
        });

        await supabaseAdmin.from('phd_document_verifications').upsert({
            application_id: id,
            verified_by: user.id,
            status: verificationData.status,
            remarks: verificationData.remarks,
            verification_date: new Date().toISOString()
        }, { onConflict: 'application_id' });

        return true;
    }

    /**
     * Initiate Payment (FR-PHD-007) - IDEMPOTENCY (Task 5)
     */
    async initiatePayment(id, paymentData, user) {
        // 1. Check for existing active payment
        const { data: existing } = await supabaseAdmin
            .from('phd_payments')
            .select('*')
            .eq('application_id', id)
            .in('status', ['PENDING', 'INITIATED'])
            .maybeSingle();

        if (existing) {
            return existing; // Return existing record instead of creating new one
        }

        // 2. Insert new
        const { data, error } = await supabaseAdmin.from('phd_payments').insert([{
            application_id: id,
            amount: paymentData.amount,
            status: 'PENDING',
            payment_method: paymentData.payment_method
        }]).select().single();

        if (error) throw error;

        // Sync application status if not already
        await this.processTransition(id, 'PAYMENT_PENDING', user);

        return data;
    }

    /**
     * Confirm Payment (Task 3: Atomic Transaction)
     */
    async confirmPayment(id, confirmationData, user) {
        const guideDeadline = this.getDeadline(7);

        // Atomic multi-table update via RPC
        const { data, error } = await supabaseAdmin.rpc('confirm_phd_payment_atomic', {
            p_application_id: id,
            p_transaction_ref: confirmationData.transaction_ref,
            p_actor_id: user.id,
            p_actor_role: user.role,
            p_due_at: guideDeadline
        });

        if (error) throw error;
        return data;
    }

    /**
     * Allocate Guide (Task 3: Atomic Transaction)
     */
    async allocateGuide(id, allocationData, user) {
        const app = await this.getById(id, user);
        if (!app) throw new Error('Application not found');

        // Prerequisites check
        const isVerified = app.document_verification?.status === 'VERIFIED';
        const isPaid = app.payment?.some(p => p.status === 'COMPLETED');

        if (!isVerified || !isPaid) {
            throw new Error(`CRITICAL: Prerequisite Bypass Attempted. Verified=${isVerified}, Paid=${isPaid}`);
        }

        // Atomic allocation and transition
        const { data, error } = await supabaseAdmin.rpc('allocate_phd_guide_atomic', {
            p_application_id: id,
            p_student_id: app.student_id,
            p_faculty_id: allocationData.faculty_id,
            p_actor_id: user.id,
            p_actor_role: user.role
        });

        if (error) throw error;
        return data;
    }

    /**
     * Internal: Update application status (legacy/internal use) - NOW REDIRECTED
     */
    async updateStatus(id, newStatus, user, auditAction, metadata = {}) {
        return this.processTransition(id, newStatus, user, null, { ...metadata, legacy_action: auditAction });
    }

    /**
     * Get active PhD admission cycle.
     */
    async getActiveLifecycle() {
        const { data, error } = await supabaseAdmin
            .from('phd_lifecycles')
            .select('*')
            .eq('status', 'OPEN')
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    /**
     * Verify ownership or administrative access.
     */
    verifyOwnership(app, user) {
        if (user.role === 'ADMIN' || user.role === 'HOD') return true;
        if (user.role === 'STUDENT' && app.created_by === user.id) return true;
        if (user.role === 'FACULTY' || user.role === 'DRC_MEMBER') return true;

        const error = new Error('Forbidden: No access to this application');
        error.status = 403;
        throw error;
    }
}

module.exports = new PhDService();
