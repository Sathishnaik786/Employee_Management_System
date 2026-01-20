import { apiCall } from './api-client';
import { PaginatedResponse } from '@/types';
import { ListQueryParams } from './employee.service';

export interface Student {
    id: string;
    student_id: string;
    firstName: string;
    lastName: string;
    email: string;
    departmentId: string;
    course: string;
    batch: string;
    status: string;
    [key: string]: any;
}

export const studentService = {
    getAll: async (params?: ListQueryParams): Promise<PaginatedResponse<Student>> => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const response = await apiCall<any>(`/iers/students?${queryParams.toString()}`, 'GET');
        return {
            data: response.data || [],
            meta: response.meta || { page: 1, limit: 10, total: 0, totalPages: 1 }
        };
    },

    getById: async (id: string): Promise<Student> => {
        return apiCall(`/iers/students/${id}`, 'GET');
    },

    create: async (data: any): Promise<Student> => {
        return apiCall('/iers/students', 'POST', data);
    },

    update: async (id: string, data: any): Promise<Student> => {
        return apiCall(`/iers/students/${id}`, 'PUT', data);
    },

    delete: async (id: string): Promise<void> => {
        return apiCall(`/iers/students/${id}`, 'DELETE');
    },
};
