import { apiCall } from './api-client';
import { Department } from '@/types';

export const departmentService = {
    getAll: async (): Promise<Department[]> => {
        const response = await apiCall<any>('/departments', 'GET');
        return response.data || [];
    },

    getById: async (id: string): Promise<Department> => {
        const response = await apiCall<any>(`/departments/${id}`, 'GET');
        return response.data || response;
    },

    create: async (data: Partial<Department>): Promise<Department> => {
        return apiCall('/departments', 'POST', data);
    },

    update: async (id: string, data: Partial<Department>): Promise<Department> => {
        return apiCall(`/departments/${id}`, 'PUT', data);
    },
};
