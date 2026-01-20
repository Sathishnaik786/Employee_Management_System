import { apiCall } from './api-client';
import { Attendance, ApiResponse } from '@/types';

export const attendanceService = {
    checkIn: async (employeeId: string): Promise<Attendance> => {
        return apiCall('/attendance/check-in', 'POST', { employeeId });
    },

    checkOut: async (attendanceId: string): Promise<Attendance> => {
        return apiCall('/attendance/check-out', 'POST', { attendanceId });
    },

    getMyAttendance: async (employeeId: string, params?: { startDate?: string; endDate?: string }): Promise<Attendance[]> => {
        const queryParams = new URLSearchParams({ employeeId });
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        const response = await apiCall<any>(`/attendance/me?${queryParams.toString()}`, 'GET');
        return response.data || [];
    },

    getReport: async (params?: { date?: string; departmentId?: string; employeeId?: string }): Promise<ApiResponse<Attendance[]>> => {
        const queryParams = new URLSearchParams();
        if (params?.date) queryParams.append('date', params.date);
        if (params?.departmentId) queryParams.append('departmentId', params.departmentId);
        if (params?.employeeId) queryParams.append('employeeId', params.employeeId);

        const response = await apiCall<any>(`/attendance/report?${queryParams.toString()}`, 'GET');
        return {
            success: response.success,
            data: response.data || []
        };
    },
};
