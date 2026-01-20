-- IERS Phase 3A: Faculty Master Module
-- This script defines the structure for university faculty and research staff.

CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id VARCHAR UNIQUE NOT NULL, -- e.g., 'FAC-CSE-001'
    full_name VARCHAR NOT NULL,
    dob DATE,
    gender VARCHAR,
    email VARCHAR UNIQUE NOT NULL,
    mobile VARCHAR,
    department VARCHAR NOT NULL,
    qualifications TEXT,
    research_areas TEXT,
    expertise TEXT,
    credentials JSONB, -- JSON storage for dynamic certifications
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_faculty_id ON faculty(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(department);
CREATE INDEX IF NOT EXISTS idx_faculty_email ON faculty(email);
CREATE INDEX IF NOT EXISTS idx_faculty_created_by ON faculty(created_by);

-- Enable RLS
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
