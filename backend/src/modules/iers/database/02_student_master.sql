-- IERS Phase 2: Student Master Module
-- This script defines the structure for managed student entities.

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR UNIQUE NOT NULL, -- e.g., 'S2026CSE001'
    full_name VARCHAR NOT NULL,
    dob DATE,
    gender VARCHAR,
    email VARCHAR UNIQUE,
    mobile VARCHAR,
    department VARCHAR,
    program_type VARCHAR, -- e.g., 'B.Tech', 'PhD'
    enrollment_date DATE,
    current_semester INTEGER,
    permanent_address TEXT,
    current_address TEXT,
    emergency_contact JSONB,
    created_by UUID, -- Link to auth.users / employee ID
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for lightning-fast lookups
CREATE INDEX IF NOT EXISTS idx_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_student_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_student_created_by ON students(created_by);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
