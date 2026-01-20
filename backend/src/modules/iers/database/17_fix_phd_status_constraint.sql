-- 17_fix_phd_status_constraint.sql
-- Correcting the CHECK constraint on phd_applications.status to include all valid lifecycle states.

-- 1. Drop existing constraint (failsafe if name differs slightly, but standard is phd_status_check)
DO $$ 
BEGIN
    ALTER TABLE phd_applications DROP CONSTRAINT IF EXISTS phd_status_check;
EXCEPTION
    WHEN undefined_object THEN
        RAISE NOTICE 'Constraint phd_status_check did not exist.';
END $$;

-- 2. Add corrected constraint
ALTER TABLE phd_applications 
ADD CONSTRAINT phd_status_check 
CHECK (status IN (
    'DRAFT', 
    'SUBMITTED', 
    'UNDER_SCRUTINY', 
    'QUALIFIED',        -- Replaces SCRUTINY_APPROVED
    'REJECTED',         -- Replaces SCRUTINY_REJECTED (and generic rejections)
    'INTERVIEW_SCHEDULED', 
    'INTERVIEW_COMPLETED', 
    'DOCUMENTS_VERIFIED', 
    'DOCUMENTS_REJECTED', 
    'PAYMENT_PENDING', 
    'PAYMENT_COMPLETED', 
    'GUIDE_ALLOCATED', 
    'CANCELLED'
));

-- 3. Verify no invalid data exists (Optional: could migrate old data if this was a live repair)
-- UPDATE phd_applications SET status = 'QUALIFIED' WHERE status = 'SCRUTINY_APPROVED';
-- UPDATE phd_applications SET status = 'REJECTED' WHERE status = 'SCRUTINY_REJECTED';
