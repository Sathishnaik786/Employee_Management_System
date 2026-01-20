-- PhD Application Academic Fields Alignment
ALTER TABLE phd_applications 
ADD COLUMN IF NOT EXISTS research_interest TEXT,
ADD COLUMN IF NOT EXISTS pg_score NUMERIC,
ADD COLUMN IF NOT EXISTS pg_specialization VARCHAR;

-- Migration: Copy data from research_area to research_interest if exists
UPDATE phd_applications 
SET research_interest = research_area 
WHERE research_interest IS NULL AND research_area IS NOT NULL;
