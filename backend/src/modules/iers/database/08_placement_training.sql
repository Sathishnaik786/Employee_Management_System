-- IERS Phase 6: Placement & Training Module
-- This script manages corporate recruitment cycles and professional skill development.

-- 1. Corporate Partners
CREATE TABLE IF NOT EXISTS placement_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR UNIQUE NOT NULL,
    registration_number VARCHAR,
    contact_person VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    job_profiles JSONB, -- Array of roles, CTC, and eligibility
    last_visit_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Student Placement Interests
CREATE TABLE IF NOT EXISTS placement_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    academic_year VARCHAR NOT NULL,
    resume_ref TEXT NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'REGISTERED', -- REGISTERED | WITHDRAWN
    registered_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, academic_year)
);

-- 3. Recruitment Drives
CREATE TABLE IF NOT EXISTS placement_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES placement_companies(id) ON DELETE CASCADE,
    drive_date DATE NOT NULL,
    job_profile VARCHAR NOT NULL,
    eligibility JSONB NOT NULL,
    status VARCHAR DEFAULT 'SCHEDULED', -- SCHEDULED | PUBLISHED | COMPLETED
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Interview Tracking
CREATE TABLE IF NOT EXISTS placement_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    round_no INTEGER NOT NULL,
    result VARCHAR NOT NULL, -- SELECTED | REJECTED | WAITLISTED
    remarks TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Selection & Offers
CREATE TABLE IF NOT EXISTS placement_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    company_id UUID REFERENCES placement_companies(id) ON DELETE CASCADE,
    offer_letter_ref TEXT NOT NULL,
    compensation JSONB NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'OFFERED', -- OFFERED | ACCEPTED | REJECTED
    offered_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, company_id)
);

-- 6. Skill Development Programs
CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    program_type VARCHAR NOT NULL, -- TRAINING | INTERNSHIP
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    organizer VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Participant Enrollment
CREATE TABLE IF NOT EXISTS training_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR NOT NULL DEFAULT 'ENROLLED', -- ENROLLED | COMPLETED | DROPPED
    certificate_ref TEXT,
    UNIQUE(program_id, student_id)
);

-- Enable RLS
ALTER TABLE placement_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
