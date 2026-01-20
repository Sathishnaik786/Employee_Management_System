-- IERS Phase 3C: Research Advisory (RAC) & Research Review (RRC)
-- This script manages the ongoing progress monitoring and final doctoral submissions.

-- 1. RAC Meetings
CREATE TABLE IF NOT EXISTS rac_meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    phd_application_id UUID REFERENCES phd_applications(id) ON DELETE CASCADE,
    meeting_date DATE NOT NULL,
    committee_members JSONB NOT NULL, -- Array of faculty IDs
    agenda TEXT NOT NULL,
    minutes TEXT,
    recommendation VARCHAR CHECK (recommendation IN ('CONTINUE', 'EXTEND', 'CANCEL')),
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Semester-wise Progress Reports
CREATE TABLE IF NOT EXISTS rac_progress_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rac_meeting_id UUID REFERENCES rac_meetings(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    progress_summary TEXT NOT NULL,
    performance_score NUMERIC CHECK (performance_score >= 0 AND performance_score <= 10),
    recommendation VARCHAR CHECK (recommendation IN ('SATISFACTORY', 'UNSATISFACTORY')),
    submitted_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RRC Submissions (Synopsis / Thesis)
CREATE TABLE IF NOT EXISTS rrc_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    phd_application_id UUID REFERENCES phd_applications(id) ON DELETE CASCADE,
    submission_type VARCHAR NOT NULL CHECK (submission_type IN ('SYNOPSIS', 'THESIS')),
    document_ref TEXT NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Reviewer Decisions
CREATE TABLE IF NOT EXISTS rrc_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rrc_submission_id UUID REFERENCES rrc_submissions(id) ON DELETE CASCADE,
    reviewer_id UUID,
    remarks TEXT,
    decision VARCHAR CHECK (decision IN ('APPROVED', 'REJECTED')),
    reviewed_at TIMESTAMPTZ DEFAULT now()
);

-- Scoping Indexes
CREATE INDEX IF NOT EXISTS idx_rac_student ON rac_meetings(student_id);
CREATE INDEX IF NOT EXISTS idx_rrc_student ON rrc_submissions(student_id);

-- Enable RLS
ALTER TABLE rac_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rac_progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE rrc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rrc_reviews ENABLE ROW LEVEL SECURITY;
