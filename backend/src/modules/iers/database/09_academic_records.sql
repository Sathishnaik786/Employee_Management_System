-- Migration: Add Academic Records & Enrollment Scaling
CREATE TABLE IF NOT EXISTS academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    cgpa NUMERIC(4,2),
    attendance_percentage NUMERIC(5,2),
    credits_completed INTEGER,
    academic_status VARCHAR DEFAULT 'REGULAR', -- REGULAR, PROBATION, WITHDRAWN
    semester_start_date DATE,
    semester_end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, semester)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_academic_student ON academic_records(student_id);

-- Enable RLS
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;

-- Seed Data for Alice (S2026-001)
DO $$
DECLARE
    alice_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    INSERT INTO academic_records (student_id, semester, cgpa, attendance_percentage, credits_completed, academic_status)
    VALUES (alice_id, 1, 9.2, 98.5, 24, 'REGULAR')
    ON CONFLICT DO NOTHING;
END $$;
