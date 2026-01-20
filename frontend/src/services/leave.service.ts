import { apiCall } from './api-client';
import { LeaveRequest, LeaveType, ApiResponse } from '@/types';

export const leaveService = {
    apply: async (data: { employeeId: string; leaveTypeId: string; startDate: string; endDate: string; reason: string }): Promise<LeaveRequest> => {
        return apiCall('/leaves/apply', 'POST', data);
    },

    getAll: async (params?: { status?: string; employeeId?: string }): Promise<ApiResponse<LeaveRequest[]>> => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.employeeId) queryParams.append('employeeId', params.employeeId);

        const response = await apiCall<any>(`/leaves?${queryParams.toString()}`, 'GET');
        return {
            success: response.success,
            data: response.data || []
        };
    },

    approve: async (id: string, approverId: string, comments?: string): Promise<LeaveRequest> => {
        return apiCall(`/leaves/${id}/approve`, 'PUT', { approverId, comments });
    },

    reject: async (id: string, approverId: string, comments?: string): Promise<LeaveRequest> => {
        return apiCall(`/leaves/${id}/reject`, 'PUT', { approverId, comments });
    },

    getTypes: async (): Promise<LeaveType[]> => {
        return apiCall('/leaves/types', 'GET');
    },
};
