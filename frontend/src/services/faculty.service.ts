import { apiCall } from './api-client';
import { PaginatedResponse, Faculty } from '@/types';

export interface ListQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    [key: string]: any;
}

/**
 * Faculty Management Service
 * Strictly for IERS Faculty profiles and researchers.
 */
export const facultyService = {
    getAll: async (params?: ListQueryParams): Promise<PaginatedResponse<Faculty>> => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const response = await apiCall<any>(`/iers/faculty?${queryParams.toString()}`, 'GET');
        return {
            data: response.data || [],
            meta: response.meta || { page: 1, limit: 10, total: 0, totalPages: 1 }
        };
    },

    getById: async (id: string): Promise<Faculty> => {
        const response = await apiCall<any>(`/iers/faculty/${id}`, 'GET');
        return response.data;
    },

    create: async (data: Partial<Faculty>): Promise<Faculty> => {
        const response = await apiCall<any>('/iers/faculty', 'POST', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Faculty>): Promise<Faculty> => {
        const response = await apiCall<any>(`/iers/faculty/${id}`, 'PUT', data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        return apiCall(`/iers/faculty/${id}`, 'DELETE');
    },
};
