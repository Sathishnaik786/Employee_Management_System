-- IERS Ph.D Admission Module Hardening Migration
-- Objective: Ensure state integrity, SLA tracking, and audit completeness

-- 1. Add missing columns for state tracking and SLA management
ALTER TABLE phd_applications 
ADD COLUMN IF NOT EXISTS previous_status VARCHAR,
ADD COLUMN IF NOT EXISTS is_sla_escalated BOOLEAN DEFAULT FALSE;

-- 2. Centralized Status Transition Function (The "Gate")
-- This function handles row locking, state update, and audit logging in one transaction.
CREATE OR REPLACE FUNCTION process_phd_transition(
    p_application_id UUID,
    p_next_status VARCHAR,
    p_actor_id UUID,
    p_actor_role VARCHAR,
    p_due_at TIMESTAMPTZ,
    p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB AS $$
DECLARE
    v_current_status VARCHAR;
    v_result JSONB;
BEGIN
    -- 1. Lock the row to prevent race conditions
    SELECT status INTO v_current_status
    FROM phd_applications
    WHERE id = p_application_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application with ID % not found', p_application_id;
    END IF;

    -- 2. Update the application
    UPDATE phd_applications
    SET 
        previous_status = v_current_status,
        status = p_next_status,
        due_at = p_due_at,
        is_sla_escalated = FALSE, -- Reset SLA flag on every transition
        updated_at = now()
    WHERE id = p_application_id;

    -- 3. Write Forensic Audit Log
    INSERT INTO audit_logs (
        user_id,
        action,
        entity,
        entity_id,
        metadata
    ) VALUES (
        p_actor_id,
        'PHD_STATUS_TRANSITION',
        'phd_applications',
        p_application_id,
        jsonb_build_object(
            'from_status', v_current_status,
            'to_status', p_next_status,
            'actor_role', p_actor_role,
            'due_at', p_due_at,
            'timestamp', now()
        ) || p_metadata
    );

    SELECT jsonb_build_object('success', true, 'from', v_current_status, 'to', p_next_status) INTO v_result;
    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- 3. Atomic Transaction for Payment Confirmation
CREATE OR REPLACE FUNCTION confirm_phd_payment_atomic(
    p_application_id UUID,
    p_transaction_ref VARCHAR,
    p_actor_id UUID,
    p_actor_role VARCHAR,
    p_due_at TIMESTAMPTZ
) RETURNS JSONB AS $$
BEGIN
    -- Update Payment Record
    UPDATE phd_payments
    SET 
        status = 'COMPLETED',
        transaction_ref = p_transaction_ref,
        paid_at = now(),
        updated_at = now()
    WHERE application_id = p_application_id;

    -- Perform Transition via Gate
    RETURN process_phd_transition(
        p_application_id,
        'PAYMENT_COMPLETED',
        p_actor_id,
        p_actor_role,
        p_due_at,
        jsonb_build_object('transaction_ref', p_transaction_ref)
    );
END;
$$ LANGUAGE plpgsql;

-- 4. Atomic Transaction for Guide Allocation
CREATE OR REPLACE FUNCTION allocate_phd_guide_atomic(
    p_application_id UUID,
    p_student_id UUID,
    p_faculty_id UUID,
    p_actor_id UUID,
    p_actor_role VARCHAR
) RETURNS JSONB AS $$
BEGIN
    -- Insert Allocation
    INSERT INTO phd_guide_allocations (
        application_id,
        student_id,
        faculty_id,
        allocated_by,
        allocated_at
    ) VALUES (
        p_application_id,
        p_student_id,
        p_faculty_id,
        p_actor_id,
        now()
    );

    -- Perform Transition via Gate (No next SLA after guide allocated usually, or set as null)
    RETURN process_phd_transition(
        p_application_id,
        'GUIDE_ALLOCATED',
        p_actor_id,
        p_actor_role,
        NULL,
        jsonb_build_object('faculty_id', p_faculty_id)
    );
END;
$$ LANGUAGE plpgsql;
