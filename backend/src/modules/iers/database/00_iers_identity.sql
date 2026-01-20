-- IERS Core Identity Infrastructure
-- This table bridges Supabase Auth with IERS-specific roles and profiles.

CREATE TABLE IF NOT EXISTS public.iers_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR UNIQUE NOT NULL,
    role VARCHAR NOT NULL CHECK (role IN (
        'STUDENT', 'FACULTY', 'GUIDE', 'DRC_MEMBER', 'RAC_MEMBER', 'RRC_MEMBER', 'ADJUDICATOR',
        'ADMIN', 'PRINCIPAL', 'MANAGEMENT', 'DEPT_ADMIN', 'FINANCE',
        'IQAC_MEMBER', 'DVV_VERIFIER', 'EXTERNAL_REVIEWER',
        'PLACEMENT_OFFICER', 'RECRUITER', 'MENTOR'
    )),
    full_name VARCHAR,
    iers_id VARCHAR UNIQUE, -- Academic ID (e.g., S2026-001, F2026-101)
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.iers_users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own identity" ON public.iers_users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can manage all identities" ON public.iers_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.role_permissions rp
            JOIN public.permissions p ON rp.permission_id = p.id
            WHERE rp.role_name = 'ADMIN' AND p.slug = 'iers:system:admin'
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_iers_users_updated_at
    BEFORE UPDATE ON public.iers_users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
