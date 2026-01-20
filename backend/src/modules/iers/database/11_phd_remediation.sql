-- IERS Ph.D Admission Module Remediation
-- Fixes for FR-PHD-001 to FR-PHD-008 alignment

-- 1. Extend phd_applications for PET Exemption and SLA
ALTER TABLE phd_applications 
ADD COLUMN IF NOT EXISTS exemption_type VARCHAR,
ADD COLUMN IF NOT EXISTS proof_url TEXT,
ADD COLUMN IF NOT EXISTS is_exempted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS exemption_status VARCHAR DEFAULT 'PENDING', -- PENDING | APPROVED | REJECTED | NONE
ADD COLUMN IF NOT EXISTS exemption_due_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ;

-- 2. Scrutiny SLA
ALTER TABLE phd_scrutiny 
ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ;

-- 3. Interview SLA
ALTER TABLE phd_interviews 
ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ;

-- 4. Document Verification Table (FR-PHD-006)
CREATE TABLE IF NOT EXISTS phd_document_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES phd_applications(id) ON DELETE CASCADE,
    verified_by UUID,
    status VARCHAR NOT NULL DEFAULT 'PENDING', -- PENDING | VERIFIED | REJECTED
    remarks TEXT,
    verification_date TIMESTAMPTZ,
    due_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(application_id)
);

-- 5. Fee Payment Table (FR-PHD-007)
CREATE TABLE IF NOT EXISTS phd_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES phd_applications(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'PENDING', -- PENDING | COMPLETED | FAILED
    transaction_ref VARCHAR,
    payment_method VARCHAR,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Guide Allocation SLA & Status
ALTER TABLE phd_guide_allocations 
ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ;

-- 7. Audit Logging for new events
-- Entries will be handled by the application logic via the audit_logs table.

-- Enable RLS for new tables
ALTER TABLE phd_document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE phd_payments ENABLE ROW LEVEL SECURITY;
