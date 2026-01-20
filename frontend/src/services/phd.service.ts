import { apiCall } from './api-client';
import { ApiResponse, PhDApplication } from '@/types';

/**
 * PhD Lifecycle & Research Service
 * Handles applications, scrutiny, and progress tracking.
 */
export const phdService = {
    // Submit new application
    apply: async (data: any): Promise<ApiResponse<PhDApplication>> => {
        return apiCall('/iers/phd/applications', 'POST', data);
    },

    // Submit application for review
    submitApplication: async (id: string): Promise<ApiResponse<any>> => {
        return apiCall(`/iers/phd/applications/${id}/submit`, 'POST');
    },

    // Get own applications (Student)
    getMyApplications: async (): Promise<ApiResponse<PhDApplication[]>> => {
        const response = await apiCall<any>('/iers/phd/applications', 'GET');
        return response;
    },

    // Administrative lookup for pending scrutiny
    getPendingScrutiny: async (): Promise<ApiResponse<PhDApplication[]>> => {
        const response = await apiCall<any>('/iers/phd/admin/pending', 'GET');
        return response;
    },

    // Get application by ID
    getById: async (id: string): Promise<ApiResponse<PhDApplication>> => {
        return apiCall(`/iers/phd/applications/${id}`, 'GET');
    },

    // Post review action (Scrutiny/Interview result)
    postAction: async (applicationId: string, actionData: any): Promise<ApiResponse<any>> => {
        return apiCall(`/iers/phd/applications/${applicationId}/action`, 'POST', actionData);
    }
};
