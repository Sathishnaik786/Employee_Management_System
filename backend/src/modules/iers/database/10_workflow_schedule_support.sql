-- Migration: support SCHEDULE action in workflow engine
ALTER TABLE workflow_actions DROP CONSTRAINT IF EXISTS workflow_actions_action_check;
ALTER TABLE workflow_actions ADD CONSTRAINT workflow_actions_action_check CHECK (action IN ('APPROVE', 'REJECT', 'SCHEDULE'));
