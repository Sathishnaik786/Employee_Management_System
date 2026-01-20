-- IERS: INTEGRATED RESOURCE & EDUCATION SYSTEM
-- COMPREHENSIVE MASTER SEED SCRIPT (18 ROLES ALIGNED)
-- PURGES ALL LEGACY EMS DATA AND INITIALIZES PURE IERS DOMAIN

-- 0. CLEANUP (Institutional Reset)
TRUNCATE public.audit_logs, public.role_permissions, public.user_permissions, public.permissions CASCADE;
TRUNCATE public.iers_users, public.students, public.faculty CASCADE;
TRUNCATE public.phd_applications, public.workflows, public.workflow_steps CASCADE;

-- 1. CORE PERMISSIONS REGISTRY
-- Granular permissions for all 18 roles across Academic, Admin, Compliance, and Career modules.

INSERT INTO public.permissions (slug, module, action, description) VALUES
-- System & Admin
('iers:system:admin', 'system', 'all', 'Full system administrative access'),
('iers:settings:manage', 'system', 'write', 'Modify institutional settings'),

-- Student & Research
('iers:student:view', 'student', 'read', 'View student profiles'),
('iers:student:manage', 'student', 'write', 'Onboard/Edit students'),
('iers:phd:apply', 'phd', 'write', 'Submit PhD applications'),
('iers:phd:view', 'phd', 'read', 'View PhD research progress'),
('iers:phd:scrutiny', 'phd', 'write', 'Conduct PhD admission scrutiny'),
('iers:phd:interview', 'phd', 'write', 'Assess candidates in interviews'),
('iers:phd:guide_allocation', 'phd', 'write', 'Allocate research supervisors'),
('iers:phd:rac_review', 'phd', 'write', 'Submit RAC progress reports'),
('iers:phd:rrc_review', 'phd', 'write', 'Conduct RRC evaluations'),
('iers:phd:thesis_adjudicate', 'phd', 'write', 'Evaluate thesis reports'),

-- Institutional Compliance (NAAC)
('iers:naac:iiqa:manage', 'naac', 'write', 'Manage IIQA submissions'),
('iers:naac:ssr:manage', 'naac', 'write', 'Manage SSR metric data'),
('iers:naac:dvv:verify', 'naac', 'write', 'Verify DVV metrics'),
('iers:naac:external:review', 'naac', 'read', 'Review institutional submissions externally'),

-- Finance & Governance
('iers:finance:fee_verify', 'finance', 'write', 'Verify student fee payments'),
('iers:governance:policy_write', 'mgmt', 'write', 'Approve institutional policies'),

-- Career & Industry
('iers:placement:manage', 'placement', 'write', 'Manage recruitment drives'),
('iers:placement:register', 'placement', 'write', 'Register for career drives'),
('iers:recruitment:post', 'industry', 'write', 'Post job descriptions and requirements'),
('iers:training:mentor', 'training', 'write', 'Mentor interns and trainees'),

-- Generic
('iers:calendar:view', 'campus', 'read', 'View academic calendar'),
('iers:meetups:read', 'campus', 'read', 'Access collaboration hub'),

-- Employee Management System (EMS) - Legacy Compatibility
('ems:employees:view', 'employees', 'read', 'View employee profiles'),
('ems:employees:create', 'employees', 'create', 'Create new employee profiles'),
('ems:employees:update', 'employees', 'update', 'Update employee profiles'),
('ems:employees:delete', 'employees', 'delete', 'Delete employee profiles'),

-- Leave Management
('ems:leaves:view', 'leaves', 'read', 'View leave records'),
('ems:leaves:apply', 'leaves', 'create', 'Apply for leave'),
('ems:leaves:approve', 'leaves', 'approve', 'Approve leave requests'),
('ems:leaves:reject', 'leaves', 'reject', 'Reject leave requests'),

-- Attendance Management
('ems:attendance:view', 'attendance', 'read', 'View attendance records'),
('ems:attendance:mark', 'attendance', 'create', 'Mark attendance'),

-- Department Management
('ems:departments:view', 'departments', 'read', 'View department information'),
('ems:departments:manage', 'departments', 'write', 'Manage department information'),

-- Project Management
('ems:projects:view', 'projects', 'read', 'View projects'),
('ems:projects:create', 'projects', 'create', 'Create new projects'),
('ems:projects:update', 'projects', 'update', 'Update project information'),
('ems:projects:delete', 'projects', 'delete', 'Delete projects'),

-- Document Management
('ems:documents:view', 'documents', 'read', 'View documents'),
('ems:documents:upload', 'documents', 'create', 'Upload documents'),
('ems:documents:delete', 'documents', 'delete', 'Delete documents'),

-- Analytics & Reporting
('ems:analytics:hr', 'analytics', 'read', 'HR analytics access'),
('ems:analytics:manager', 'analytics', 'read', 'Manager analytics access'),
('ems:analytics:employee', 'analytics', 'read', 'Employee analytics access'),

-- Student Profile (Legacy)
('ems:student:profile:read', 'student', 'read', 'Read student profile'),
('ems:student:profile:create', 'student', 'create', 'Create student profile'),
('ems:student:profile:update', 'student', 'update', 'Update student profile'),

-- Chat & Communication
('ems:chat:send_message', 'chat', 'create', 'Send chat messages'),
('ems:chat:view_history', 'chat', 'read', 'View chat history'),

-- Additional EMS Permissions
('ems:analytics:admin', 'analytics', 'read', 'Admin analytics access'),
('ems:notifications:admin-view', 'notifications', 'read', 'Admin notifications view'),
('ems:notifications:principal-view', 'notifications', 'read', 'Principal notifications view'),
('ems:notifications:faculty-view', 'notifications', 'read', 'Faculty notifications view'),
('ems:notifications:student-view', 'notifications', 'read', 'Student notifications view'),
('ems:notifications:iqac-view', 'notifications', 'read', 'IQAC notifications view'),
('ems:comments:admin', 'comments', 'write', 'Admin comments access'),
('ems:comments:manager', 'comments', 'write', 'Manager comments access'),
('ems:comments:hr', 'comments', 'write', 'HR comments access'),
('ems:automation:admin', 'automation', 'write', 'Admin automation settings'),
('ems:automation:hr', 'automation', 'write', 'HR automation settings'),
('ems:updates:employee-view', 'updates', 'read', 'Employee updates view'),
('ems:updates:manager-view', 'updates', 'read', 'Manager updates view'),
('ems:documents:student-upload', 'documents', 'create', 'Student document upload'),
('ems:documents:faculty-upload', 'documents', 'create', 'Faculty document upload');

-- 2. ROLE-PERMISSION MAPPING (18 ROLES)

-- Define helper to link permissions
DO $$
DECLARE
    p_admin UUID := (SELECT id FROM permissions WHERE slug = 'iers:system:admin');
    p_std_view UUID := (SELECT id FROM permissions WHERE slug = 'iers:student:view');
    p_fac_view UUID := (SELECT id FROM permissions WHERE slug = 'iers:student:view');
    p_phd_apply UUID := (SELECT id FROM permissions WHERE slug = 'iers:phd:apply');
    p_phd_scrutiny UUID := (SELECT id FROM permissions WHERE slug = 'iers:phd:scrutiny');
    p_phd_rac UUID := (SELECT id FROM permissions WHERE slug = 'iers:phd:rac_review');
    p_iiqa UUID := (SELECT id FROM permissions WHERE slug = 'iers:naac:iiqa:manage');
    p_fee UUID := (SELECT id FROM permissions WHERE slug = 'iers:finance:fee_verify');
    p_place UUID := (SELECT id FROM permissions WHERE slug = 'iers:placement:manage');
BEGIN
    -- 08. ADMIN
    INSERT INTO role_permissions (role_name, permission_id) VALUES ('ADMIN', p_admin);

    -- 01. STUDENT
    INSERT INTO role_permissions (role_name, permission_id) 
    SELECT 'STUDENT', id FROM permissions WHERE slug IN ('iers:phd:apply', 'iers:placement:register', 'iers:calendar:view', 'iers:meetups:read');

    -- 02. FACULTY
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'FACULTY', id FROM permissions WHERE slug IN ('iers:student:view', 'iers:phd:view', 'iers:calendar:view');

    -- 03. GUIDE
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'GUIDE', id FROM permissions WHERE slug IN ('iers:student:view', 'iers:phd:view', 'iers:phd:rac_review');

    -- 04. DRC_MEMBER
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'DRC_MEMBER', id FROM permissions WHERE slug IN ('iers:phd:scrutiny', 'iers:phd:interview', 'iers:phd:guide_allocation');

    -- 09. PRINCIPAL
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'PRINCIPAL', id FROM permissions WHERE slug IN ('iers:student:view', 'iers:governance:policy_write', 'iers:naac:iiqa:manage');

    -- 12. FINANCE
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'FINANCE', id FROM permissions WHERE slug IN ('iers:finance:fee_verify');

    -- 13. IQAC_MEMBER
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'IQAC_MEMBER', id FROM permissions WHERE slug IN ('iers:naac:iiqa:manage', 'iers:naac:ssr:manage');

    -- 16. PLACEMENT_OFFICER
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'PLACEMENT_OFFICER', id FROM permissions WHERE slug IN ('iers:placement:manage', 'iers:student:view');
    
    -- 17. ADMIN (Legacy EMS)
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'ADMIN', id FROM permissions WHERE slug LIKE 'ems:%'
    AND slug NOT IN (
        'ems:updates:employee-view',
        'ems:updates:manager-view'
    );
    
    -- 18. HR (Legacy EMS)
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'HR', id FROM permissions WHERE slug IN (
        'ems:employees:view',
        'ems:employees:create',
        'ems:employees:update',
        'ems:employees:delete',
        'ems:leaves:view',
        'ems:leaves:approve',
        'ems:leaves:reject',
        'ems:attendance:view',
        'ems:departments:view',
        'ems:departments:manage',
        'ems:analytics:hr',
        'ems:analytics:admin',
        'ems:notifications:admin-view',
        'ems:notifications:principal-view',
        'ems:notifications:faculty-view',
        'ems:notifications:student-view',
        'ems:notifications:iqac-view',
        'ems:comments:admin',
        'ems:comments:hr',
        'ems:automation:admin',
        'ems:automation:hr',
        'ems:updates:manager-view',
        'ems:student:profile:read',
        'ems:student:profile:create',
        'ems:student:profile:update',
        'ems:documents:faculty-upload'
    );
    
    -- 19. MANAGER (Legacy EMS)
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'MANAGER', id FROM permissions WHERE slug IN (
        'ems:employees:view',
        'ems:projects:view',
        'ems:projects:create',
        'ems:projects:update',
        'ems:leaves:view',
        'ems:leaves:approve',
        'ems:leaves:reject',
        'ems:attendance:view',
        'ems:analytics:manager',
        'ems:analytics:admin',
        'ems:comments:manager',
        'ems:updates:manager-view',
        'ems:student:profile:read'
    );
    
    -- 20. EMPLOYEE (Legacy EMS)
    INSERT INTO role_permissions (role_name, permission_id)
    SELECT 'EMPLOYEE', id FROM permissions WHERE slug IN (
        'ems:employees:view',
        'ems:projects:view',
        'ems:leaves:view',
        'ems:leaves:apply',
        'ems:attendance:view',
        'ems:attendance:mark',
        'ems:analytics:employee',
        'ems:updates:employee-view',
        'ems:documents:student-upload'
    );
END $$;

-- 3. ACADEMIC HUB SEED DATA (STUDENT & FACULTY)

-- Alice: PhD Research Scholar
INSERT INTO public.iers_users (id, email, role, full_name, iers_id)
VALUES ('00000000-0000-0000-0000-000000000001', 'alice@iers.edu', 'STUDENT', 'Alice Stark', 'S2026-001');

INSERT INTO public.students (id, student_id, full_name, email, department, program_type)
VALUES ('00000000-0000-0000-0000-000000000001', 'S2026-001', 'Alice Stark', 'alice@iers.edu', 'Computer Science', 'PhD');

-- Robert: Senior Faculty / Research Guide
INSERT INTO public.iers_users (id, email, role, full_name, iers_id)
VALUES ('00000000-0000-0000-0000-000000000002', 'robert@iers.edu', 'FACULTY', 'Dr. Robert Oppenheimer', 'F2026-101');

INSERT INTO public.faculty (id, faculty_id, full_name, email, department, expertise)
VALUES ('00000000-0000-0000-0000-000000000002', 'F2026-101', 'Dr. Robert Oppenheimer', 'robert@iers.edu', 'Physics', 'Quantum Mechanics');

-- 4. PHD WORKFLOW SEED

INSERT INTO public.phd_applications (id, application_no, student_id, research_area, status)
VALUES (gen_random_uuid(), 'PHD-2026-001', '00000000-0000-0000-0000-000000000001', 'Quantum Computing Architectures', 'SCRUTINY');

-- 5. GENERIC INSTITUTIONAL WORKFLOW (PhD Admission)
INSERT INTO public.workflows (id, name, description, entity_type)
VALUES ('00000000-0000-0000-0000-000000000001', 'PhD Admission', 'Standard admission workflow for PhD candidates', 'phd_application');

INSERT INTO public.workflow_steps (workflow_id, step_order, step_name, approver_role)
VALUES 
('00000000-0000-0000-0000-000000000001', 1, 'Document Scrutiny', 'DRC_MEMBER'),
('00000000-0000-0000-0000-000000000001', 2, 'Entrance Interview', 'DRC_MEMBER'),
('00000000-0000-0000-0000-000000000001', 3, 'Guide Allocation', 'DRC_MEMBER'),
('00000000-0000-0000-0000-000000000001', 4, 'Final Admission Approval', 'PRINCIPAL');
