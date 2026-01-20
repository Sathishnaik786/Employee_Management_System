-- PhD Lifecycle Active Cycle Management
CREATE TABLE IF NOT EXISTS phd_lifecycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'OPEN', -- OPEN | CLOSED
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed an active cycle if none exists
INSERT INTO phd_lifecycles (academic_year, status)
SELECT '2026-27', 'OPEN'
WHERE NOT EXISTS (SELECT 1 FROM phd_lifecycles WHERE status = 'OPEN');

-- Permission for reading active cycle (usually public/authenticated)
INSERT INTO public.permissions (slug, module, action, description)
VALUES ('iers:phd:lifecycle:read', 'phd', 'read', 'Read active PhD admission cycles')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO role_permissions (role_name, permission_id)
SELECT 'STUDENT', id FROM permissions WHERE slug = 'iers:phd:lifecycle:read'
ON CONFLICT DO NOTHING;
