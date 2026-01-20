-- IERS Phase 1: RBAC System & Audit Logging
-- This script sets up the granular permission system and audit trails.

-- 1. Permissions Definition Table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR UNIQUE NOT NULL, -- e.g., 'iers:student:profile:create'
    module VARCHAR NOT NULL,      -- e.g., 'student'
    action VARCHAR NOT NULL,      -- e.g., 'create'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Role-Permission Mapping
-- Connects granular permissions to user roles (ADMIN, FACULTY, STUDENT, HOD, etc.)
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR NOT NULL,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_name, permission_id)
);

-- 3. User-Specific Permission Overrides
-- Allows granting or denying specific permissions to individual users.
CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    type VARCHAR DEFAULT 'ALLOW', -- ALLOW | DENY
    UNIQUE(user_id, permission_id)
);

-- 4. Audit Logs
-- Tracks all sensitive mutations across IERS modules.
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR NOT NULL,      -- e.g., 'STUDENT_CREATED'
    entity VARCHAR NOT NULL,      -- e.g., 'student'
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Service Role should be used for operations)
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
