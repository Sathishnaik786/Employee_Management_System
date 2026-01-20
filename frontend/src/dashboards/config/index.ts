import { DashboardConfig } from '../types';
import { adminDashboardConfig } from './admin.config';
import { facultyDashboardConfig } from './faculty.config';
import { studentDashboardConfig } from './student.config';
import { guideDashboardConfig } from './guide.config';
import { drcDashboardConfig } from './drc.config';
import { racDashboardConfig } from './rac.config';
import { rrcDashboardConfig } from './rrc.config';
import { adjudicatorDashboardConfig } from './adjudicator.config';
import { principalDashboardConfig } from './principal.config';
import { managementDashboardConfig } from './management.config';
import { iqacDashboardConfig } from './iqac.config';
import { dvvDashboardConfig } from './dvv.config';
import { externalReviewerDashboardConfig } from './external-reviewer.config';
import { placementOfficerDashboardConfig } from './placement-officer.config';
import { recruiterDashboardConfig } from './recruiter.config';
import { Role } from '@/types';

export const dashboardConfigs: Record<string, DashboardConfig> = {
    ADMIN: adminDashboardConfig,
    SUPER_ADMIN: adminDashboardConfig,
    FACULTY: facultyDashboardConfig,
    GUIDE: guideDashboardConfig,
    DRC_MEMBER: drcDashboardConfig,
    RAC_MEMBER: racDashboardConfig,
    RRC_MEMBER: rrcDashboardConfig,
    ADJUDICATOR: adjudicatorDashboardConfig,
    PRINCIPAL: principalDashboardConfig,
    MANAGEMENT: managementDashboardConfig,
    IQAC_MEMBER: iqacDashboardConfig,
    DVV_VERIFIER: dvvDashboardConfig,
    EXTERNAL_REVIEWER: externalReviewerDashboardConfig,
    PLACEMENT_OFFICER: placementOfficerDashboardConfig,
    RECRUITER: recruiterDashboardConfig,
    STUDENT: studentDashboardConfig,
    // Default to admin for now if unspecified, or we can add a basic one
    EMPLOYEE: adminDashboardConfig,
};

export function getDashboardConfig(role: Role): DashboardConfig {
    return dashboardConfigs[role] || adminDashboardConfig;
}
