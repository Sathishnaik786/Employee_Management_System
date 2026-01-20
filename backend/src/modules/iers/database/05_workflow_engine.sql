-- IERS Phase 4: Generic Workflow & Approval Engine
-- This script provides a reusable mechanism for multi-stage approvals across any module.

-- 1. Workflow Definition (Blueprint)
CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    module VARCHAR NOT NULL,          -- phd, naac, training, etc.
    entity_type VARCHAR NOT NULL,     -- phd_application, ssr, etc.
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(module, entity_type, name)
);

-- 2. Step Configuration
CREATE TABLE IF NOT EXISTS workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_name VARCHAR NOT NULL,
    approval_type VARCHAR NOT NULL CHECK (approval_type IN ('SEQUENTIAL', 'PARALLEL')),
    approver_roles TEXT[] NOT NULL,   -- e.g., ['HOD', 'ADMIN']
    conditions JSONB,                 -- JSON logic for conditional routing
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(workflow_id, step_order)
);

-- 3. Live Instances
CREATE TABLE IF NOT EXISTS workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id),
    entity_type VARCHAR NOT NULL,
    entity_id UUID NOT NULL,
    current_step INTEGER DEFAULT 1,
    status VARCHAR NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED')),
    initiated_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(entity_type, entity_id)
);

-- 4. Action History (The Approval Trail)
CREATE TABLE IF NOT EXISTS workflow_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID REFERENCES workflow_instances(id) ON DELETE CASCADE,
    step_id UUID REFERENCES workflow_steps(id),
    actor_id UUID,
    actor_role VARCHAR,
    action VARCHAR NOT NULL CHECK (action IN ('APPROVE', 'REJECT')),
    remarks TEXT,
    acted_at TIMESTAMPTZ DEFAULT now()
);

-- Core Workflow Indexes
CREATE INDEX IF NOT EXISTS idx_wf_instance_entity ON workflow_instances(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_wf_action_instance ON workflow_actions(workflow_instance_id);

-- Enable RLS
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_actions ENABLE ROW LEVEL SECURITY;
