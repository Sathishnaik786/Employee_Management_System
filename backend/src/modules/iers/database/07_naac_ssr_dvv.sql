-- IERS Phase 5: NAAC Institutional Accreditation Module
-- This script manages the IIQA, SSR, and DVV lifecycle for university grading.

-- 1. Institutional Information for Quality Assessment (IIQA)
CREATE TABLE IF NOT EXISTS naac_iiqa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_code VARCHAR NOT NULL,
    academic_year VARCHAR NOT NULL, -- Format: YYYY-YYYY
    status VARCHAR NOT NULL DEFAULT 'DRAFT', -- DRAFT | SUBMITTED | APPROVED | etc.
    submitted_by UUID,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(institution_code, academic_year)
);

-- 2. Self Study Report (SSR) Sections
CREATE TABLE IF NOT EXISTS naac_ssr (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    iiqa_id UUID REFERENCES naac_iiqa(id) ON DELETE CASCADE,
    criterion_no INTEGER NOT NULL DEFAULT 1 CHECK (criterion_no >= 1 AND criterion_no <= 7),
    section_code VARCHAR NOT NULL, -- e.g., '3.2.1'
    content JSONB NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'DRAFT',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Data Validation & Verification (DVV)
CREATE TABLE IF NOT EXISTS naac_dvv (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ssr_id UUID REFERENCES naac_ssr(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    response TEXT,
    status VARCHAR NOT NULL DEFAULT 'OPEN', -- OPEN | RESPONDED | CLOSED
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Quantitative Metrics (QNM) Scores
CREATE TABLE IF NOT EXISTS naac_qnm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    iiqa_id UUID REFERENCES naac_iiqa(id) ON DELETE CASCADE,
    metric_code VARCHAR NOT NULL,
    raw_score NUMERIC,
    weighted_score NUMERIC,
    calculated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(iiqa_id, metric_code)
);

-- Enable RLS
ALTER TABLE naac_iiqa ENABLE ROW LEVEL SECURITY;
ALTER TABLE naac_ssr ENABLE ROW LEVEL SECURITY;
ALTER TABLE naac_dvv ENABLE ROW LEVEL SECURITY;
ALTER TABLE naac_qnm ENABLE ROW LEVEL SECURITY;
