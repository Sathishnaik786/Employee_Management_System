-- Add is_auto_generated to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS is_auto_generated BOOLEAN DEFAULT false;
