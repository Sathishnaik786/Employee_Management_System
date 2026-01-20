-- IERS Phase 3B: PhD Application Lifecycle
-- This script manages the multi-stage admission and review process for PhD scholars.

-- 1. Core Applications
CREATE TABLE IF NOT EXISTS phd_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_no VARCHAR UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR DEFAULT 'PhD',
    research_area TEXT,
    status VARCHAR NOT NULL DEFAULT 'DRAFT', -- DRAFT | SUBMITTED | SCRUTINY_APPROVED | INTERVIEW_SCHEDULED | etc.
    submitted_at TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Scrutiny Records (DRC Review)
CREATE TABLE IF NOT EXISTS phd_scrutiny (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES phd_applications(id) ON DELETE CASCADE,
    reviewer_id UUID,
    remarks TEXT,
    decision VARCHAR CHECK (decision IN ('APPROVED', 'REJECTED')),
    reviewed_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Interview Panels & Scores
CREATE TABLE IF NOT EXISTS phd_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES phd_applications(id) ON DELETE CASCADE,
    interview_date DATE NOT NULL,
    panel JSONB, -- Array of faculty IDs
    score NUMERIC,
    recommendation VARCHAR CHECK (recommendation IN ('QUALIFIED', 'NOT_QUALIFIED')),
    remarks TEXT,
    completed_at TIMESTAMPTZ
);

-- 4. Guide/Supervisor Allocation
CREATE TABLE IF NOT EXISTS phd_guide_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES phd_applications(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    allocated_by UUID,
    allocated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(application_id),
    UNIQUE(student_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_phd_app_no ON phd_applications(application_no);
CREATE INDEX IF NOT EXISTS idx_phd_status ON phd_applications(status);
CREATE INDEX IF NOT EXISTS idx_phd_student_id ON phd_applications(student_id);

-- Enable RLS
ALTER TABLE phd_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE phd_scrutiny ENABLE ROW LEVEL SECURITY;
ALTER TABLE phd_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE phd_guide_allocations ENABLE ROW LEVEL SECURITY;
