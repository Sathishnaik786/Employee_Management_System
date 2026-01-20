import { apiCall } from './api-client';
import { Project, PaginatedResponse } from '@/types';
import { ListQueryParams } from './employee.service';

export const projectService = {
    getAll: async (params?: ListQueryParams): Promise<PaginatedResponse<Project>> => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const response = await apiCall<any>(`/projects?${queryParams.toString()}`, 'GET');

        return {
            data: (response.data || []) as Project[],
            meta: response.meta || {
                page: params?.page || 1,
                limit: params?.limit || 10,
                total: response.data?.length || 0,
                totalPages: 1
            }
        };
    },

    getById: async (id: string): Promise<Project> => {
        const response = await apiCall<any>(`/projects/${id}`, 'GET');
        return response.data || response;
    },

    create: async (data: any): Promise<Project> => {
        const response = await apiCall<any>('/projects', 'POST', data);
        return response.data || response;
    },

    update: async (id: string, data: any): Promise<Project> => {
        const response = await apiCall<any>(`/projects/${id}`, 'PUT', data);
        return response.data || response;
    },

    delete: async (id: string): Promise<void> => {
        await apiCall(`/projects/${id}`, 'DELETE');
    },

    addMember: async (projectId: string, employeeId: string, role: string) => {
        return apiCall(`/projects/${projectId}/members`, 'POST', { employeeId, role });
    },

    addTask: async (projectId: string, taskData: any) => {
        return apiCall(`/projects/${projectId}/tasks`, 'POST', taskData);
    },

    updateTaskStatus: async (projectId: string, taskId: string, status: string) => {
        return apiCall(`/projects/${projectId}/tasks/${taskId}/status`, 'PUT', { status });
    },

    addUpdate: async (projectId: string, employeeId: string, message: string) => {
        return apiCall(`/projects/${projectId}/updates`, 'POST', { employeeId, message });
    },
};
