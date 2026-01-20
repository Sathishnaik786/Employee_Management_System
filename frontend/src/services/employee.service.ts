import { apiCall } from './api-client';
import { Employee, PaginatedResponse } from '@/types';

export interface ListQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}

export const employeeService = {
    getAll: async (params?: ListQueryParams): Promise<PaginatedResponse<Employee>> => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const response = await apiCall<any>(`/employees?${queryParams.toString()}`, 'GET');

        // Standardize the response format: backend might return { success, data: { data, total, page, limit } }
        // or { success, data: [...] }
        if (response.data && response.data.data && response.data.total !== undefined) {
            return {
                data: (response.data.data || []) as Employee[],
                meta: {
                    page: response.data.page || params?.page || 1,
                    limit: response.data.limit || params?.limit || 10,
                    total: response.data.total || 0,
                    totalPages: response.data.totalPages || 1
                }
            };
        } else {
            return {
                data: (response.data || []) as Employee[],
                meta: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    total: response.data?.length || 0,
                    totalPages: 1
                }
            };
        }
    },

    getById: async (id: string): Promise<Employee> => {
        const response = await apiCall<any>(`/employees/${id}`, 'GET');
        return response.data || response;
    },

    create: async (data: Partial<Employee>): Promise<Employee> => {
        const response = await apiCall<any>('/employees', 'POST', data);
        return response.data || response;
    },

    update: async (id: string, data: Partial<Employee>): Promise<Employee> => {
        const response = await apiCall<any>(`/employees/${id}`, 'PUT', data);
        return response.data || response;
    },

    getProfile: async (): Promise<Employee> => {
        const response = await apiCall<any>('/employees/profile', 'GET');
        return response.data || response;
    },

    updateProfile: async (data: Partial<Employee>): Promise<Employee> => {
        const response = await apiCall<any>('/employees/profile', 'PUT', data);
        return response.data || response;
    },

    delete: async (id: string): Promise<void> => {
        await apiCall(`/employees/${id}`, 'DELETE');
    },
};
