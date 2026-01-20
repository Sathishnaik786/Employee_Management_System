-- Add user_id to students table for secure identity resolution
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE;

-- Backfill user_id with id for existing records (legacy assumption was id = user_id)
-- We only do this if it looks like a valid link (not random) - actually just do it for all as a starting point.
UPDATE public.students 
SET user_id = id 
WHERE user_id IS NULL;

-- Ensure future references are stable
CREATE INDEX IF NOT EXISTS idx_student_user_id ON public.students(user_id);
