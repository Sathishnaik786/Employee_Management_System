/**
 * IERS Permission Registry
 * Single source of truth for all Integrated Resource & Education System UI permissions.
 */

export const PERMISSIONS = {
    // 9. System Administration & Oversight
    SYSTEM_ADMIN: 'iers:system:admin',
    ADMIN_DASHBOARD_VIEW: 'iers:admin:dashboard:view',
    ADMIN_AUDIT_VIEW: 'iers:admin:audit:view',
    ADMIN_RBAC_MANAGE: 'iers:admin:rbac:manage',
    ADMIN_WORKFLOW_CONFIG: 'iers:admin:workflow:config',
    ADMIN_HEALTH_VIEW: 'iers:admin:health:view',
    SETTINGS_VIEW: 'iers:settings:read',
    SETTINGS_MANAGE: 'iers:settings:manage',
    BASE_DASHBOARD_VIEW: 'iers:dashboard:view',

    // 2. Student Management
    STUDENT_VIEW: 'iers:student:view',
    STUDENT_MANAGE: 'iers:student:manage',

    // 3. Faculty Management
    FACULTY_VIEW: 'iers:faculty:view',
    FACULTY_MANAGE: 'iers:faculty:manage',
    FACULTY_PROFILE_READ: 'iers:faculty:profile:read',
    STUDENTS_ASSIGNED_VIEW: 'iers:students:assigned:view',
    RESEARCH_DIRECTORY_VIEW: 'iers:research:directory:view',
    REPORTS_ACADEMIC_VIEW: 'iers:reports:academic:view',
    GUIDE_ACCEPT: 'iers:guide:accept',
    GUIDE_SCHOLARS_VIEW: 'iers:guide:scholars:view',
    GUIDE_PROGRESS_SUBMIT: 'iers:guide:progress:submit',
    THESIS_VIEW: 'iers:thesis:view',
    RAC_DECISION_VIEW: 'iers:rac:decision:view',

    // 4. PhD & Research Lifecycle
    PHD_APPLY: 'iers:phd:application:create',
    PHD_SUBMIT: 'iers:phd:application:submit',
    PHD_VIEW: 'iers:phd:application:read',
    PHD_SCRUTINY: 'iers:phd:scrutiny:review',
    PHD_INTERVIEW: 'iers:phd:interview:conduct',
    PHD_GUIDE_ALLOCATE: 'iers:phd:guide:allocate',
    PHD_EXEMPTION_APPLY: 'iers:phd:exemption:apply',
    PHD_DOCUMENTS_VERIFY: 'iers:phd:documents:verify',
    PHD_PAYMENT_INITIATE: 'iers:phd:payment:initiate',
    PHD_PAYMENT_CONFIRM: 'iers:phd:payment:confirm',
    PHD_WORKFLOW_VIEW: 'iers:workflow:view',
    PHD_WORKFLOW_ACTION: 'iers:workflow:approve',

    // New DRC & RAC Permissions
    PHD_APPLICATION_VIEW: 'iers:phd:application:read',
    PHD_SCRUTINY_REVIEW: 'iers:phd:scrutiny:review',
    INTERVIEW_SCHEDULE: 'iers:phd:interview:schedule',
    DRC_EVALUATE: 'iers:phd:drc:evaluate',

    RAC_MEETING_VIEW: 'iers:phd:rac:meeting:view',
    RAC_PROGRESS_REVIEW: 'iers:phd:rac:progress:review',
    RAC_DECISION_SUBMIT: 'iers:phd:rac:decision:submit',

    // RRC & Adjudicator Permissions
    THESIS_ASSIGNED_VIEW: 'iers:thesis:assigned:view',
    THESIS_EVALUATION_SUBMIT: 'iers:thesis:evaluation:submit',
    PLAGIARISM_REPORT_VIEW: 'iers:plagiarism:report:view',

    RRC_SYNOPSIS_REVIEW: 'iers:rrc:synopsis:review',
    RRC_THESIS_REVIEW: 'iers:rrc:thesis:review',
    RRC_RECOMMENDATION_SUBMIT: 'iers:rrc:recommendation:submit',

    // Principal & Management Permissions
    DEGREE_AWARD_APPROVE: 'iers:degree:award:approve',
    FINAL_APPROVAL_VIEW: 'iers:phd:final:approval:view',
    AUDIT_SUMMARY_VIEW: 'iers:audit:summary:view',

    STRATEGIC_ANALYTICS_VIEW: 'iers:strategic:analytics:view',
    POLICY_REPORT_VIEW: 'iers:policy:report:view',
    INSTITUTIONAL_METRICS_VIEW: 'iers:institutional:metrics:view',

    // NAAC Compliance Permissions
    NAAC_IIQA_MANAGE: 'iers:naac:iiqa:manage',
    NAAC_SSR_EDIT: 'iers:naac:ssr:edit',
    NAAC_EVIDENCE_UPLOAD: 'iers:naac:evidence:upload',
    NAAC_READINESS_VIEW: 'iers:naac:readiness:view',

    DVV_EVIDENCE_VIEW: 'iers:naac:dvv:evidence:view',
    DVV_CLARIFICATION_RAISE: 'iers:naac:dvv:clarification:raise',
    DVV_STATUS_UPDATE: 'iers:naac:dvv:status:update',

    NAAC_EXTERNAL_VIEW: 'iers:naac:external:view',
    NAAC_EXTERNAL_COMMENT: 'iers:naac:external:comment',

    // 5. Workflow Engine
    WORKFLOW_VIEW: 'iers:workflow:view',
    WORKFLOW_ACTION: 'iers:workflow:approve',

    // 7. Career & Placements
    PLACEMENT_VIEW: 'iers:placement:view',
    PLACEMENT_MANAGE: 'iers:placement:manage',
    TRAINING_VIEW: 'iers:training:view',
    TRAINING_MANAGE: 'iers:training:manage',

    // Placement & Industry Specific
    PLACEMENT_DRIVE_MANAGE: 'iers:placement:drive:manage',
    COMPANY_PROFILE_MANAGE: 'iers:placement:company:manage',
    STUDENT_ELIGIBILITY_VIEW: 'iers:placement:eligibility:view',
    OFFER_TRACKING_VIEW: 'iers:placement:offer:track',
    PLACEMENT_ANALYTICS_VIEW: 'iers:placement:analytics:view',

    JOB_POST_CREATE: 'iers:placement:job:create',
    CANDIDATE_SHORTLIST_VIEW: 'iers:placement:candidate:shortlist',
    INTERVIEW_SCHEDULE_MANAGE: 'iers:placement:interview:manage',
    OFFER_CREATE: 'iers:placement:offer:create',

    PLACEMENT_OPPORTUNITY_VIEW: 'iers:placement:opportunity:view',
    JOB_APPLY: 'iers:placement:job:apply',
    OFFER_VIEW: 'iers:placement:offer:view',

    // 8. Communication & Events
    CALENDAR_VIEW: 'iers:calendar:view',
    MEETUPS_VIEW: 'iers:meetups:read',
    MEETUPS_MANAGE: 'iers:meetups:manage',

    // 9. Employee Management System (EMS) - Legacy Compatibility
    EMPLOYEES_VIEW: 'ems:employees:view',
    EMPLOYEES_CREATE: 'ems:employees:create',
    EMPLOYEES_UPDATE: 'ems:employees:update',
    EMPLOYEES_DELETE: 'ems:employees:delete',

    // 10. Leave Management
    LEAVES_VIEW: 'ems:leaves:view',
    LEAVES_APPLY: 'ems:leaves:apply',
    LEAVES_APPROVE: 'ems:leaves:approve',
    LEAVES_REJECT: 'ems:leaves:reject',

    // 11. Attendance Management
    ATTENDANCE_VIEW: 'ems:attendance:view',
    ATTENDANCE_MARK: 'ems:attendance:mark',

    // 12. Department Management
    DEPARTMENTS_VIEW: 'ems:departments:view',
    DEPARTMENTS_MANAGE: 'ems:departments:manage',

    // 13. Project Management
    PROJECTS_VIEW: 'ems:projects:view',
    PROJECTS_CREATE: 'ems:projects:create',
    PROJECTS_UPDATE: 'ems:projects:update',
    PROJECTS_DELETE: 'ems:projects:delete',

    // 14. Document Management
    DOCUMENTS_VIEW: 'ems:documents:view',
    DOCUMENTS_UPLOAD: 'ems:documents:upload',
    DOCUMENTS_DELETE: 'ems:documents:delete',

    // 15. Analytics & Reporting
    ANALYTICS_HR: 'ems:analytics:hr',
    ANALYTICS_MANAGER: 'ems:analytics:manager',
    ANALYTICS_EMPLOYEE: 'ems:analytics:employee',

    // 16. Student Profile (Legacy)
    STUDENT_PROFILE_READ: 'ems:student:profile:read',
    STUDENT_PROFILE_CREATE: 'ems:student:profile:create',
    STUDENT_PROFILE_UPDATE: 'ems:student:profile:update',

    // 17. Chat & Communication
    CHAT_SEND_MESSAGE: 'ems:chat:send_message',
    CHAT_VIEW_HISTORY: 'ems:chat:view_history',

    // 18. Notifications
    NOTIFICATIONS_ADMIN_VIEW: 'ems:notifications:admin-view',
    NOTIFICATIONS_PRINCIPAL_VIEW: 'ems:notifications:principal-view',
    NOTIFICATIONS_FACULTY_VIEW: 'ems:notifications:faculty-view',
    NOTIFICATIONS_STUDENT_VIEW: 'ems:notifications:student-view',
    NOTIFICATIONS_IQAC_VIEW: 'ems:notifications:iqac-view',

    // 19. Comments
    COMMENTS_ADMIN: 'ems:comments:admin',
    COMMENTS_MANAGER: 'ems:comments:manager',
    COMMENTS_HR: 'ems:comments:hr',

    // 20. Automation
    AUTOMATION_ADMIN: 'ems:automation:admin',
    AUTOMATION_HR: 'ems:automation:hr',

    // 21. Updates
    UPDATES_EMPLOYEE_VIEW: 'ems:updates:employee-view',
    UPDATES_MANAGER_VIEW: 'ems:updates:manager-view',

    // 22. Document Upload
    DOCUMENTS_STUDENT_UPLOAD: 'ems:documents:student-upload',
    DOCUMENTS_FACULTY_UPLOAD: 'ems:documents:faculty-upload',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
