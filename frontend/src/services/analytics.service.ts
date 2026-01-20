import { apiCall } from './api-client';
import {
    AdminOverviewData,
    ManagerTeamProgressData,
    HRWorkforceData,
    EmployeeSelfData,
    ApiResponse
} from '@/types';

export const analyticsService = {
    getAdminOverview: async (): Promise<ApiResponse<AdminOverviewData>> => {
        return apiCall('/analytics/admin/overview', 'GET');
    },

    getManagerProgress: async (managerId: string): Promise<ApiResponse<ManagerTeamProgressData>> => {
        return apiCall(`/analytics/manager/progress/${managerId}`, 'GET');
    },

    getHRWorkforce: async (): Promise<ApiResponse<HRWorkforceData>> => {
        return apiCall('/analytics/hr/workforce', 'GET');
    },

    getEmployeeSelf: async (employeeId: string): Promise<ApiResponse<EmployeeSelfData>> => {
        return apiCall(`/analytics/employee/self/${employeeId}`, 'GET');
    },
};
