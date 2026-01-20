import { apiCall } from './api-client';
import { User, ApiResponse } from '@/types';

/**
 * IERS Auth Service
 * Strictly handles educational identity flows.
 */
export const authService = {
    // Check if IERS email is registered
    checkEmailExists: async (email: string) => {
        return apiCall<ApiResponse<any>>('/auth/check-email', 'POST', { email });
    },

    forgotPassword: async (email: string) => {
        return apiCall<ApiResponse<any>>('/auth/forgot-password', 'POST', { email });
    },

    resetPassword: async (token: string, password: string) => {
        return apiCall<ApiResponse<any>>('/auth/reset-password', 'POST', { token, password });
    },

    // Institutional Login
    login: async (credentials: any) => {
        return apiCall<any>('/auth/login', 'POST', credentials);
    },

    // Session resolution
    me: async (): Promise<ApiResponse<{ user: User }>> => {
        return apiCall<ApiResponse<{ user: User }>>('/auth/me', 'GET');
    },

    // Registrar/Admin user creation
    createIersUser: async (userData: { email: string; role: string; fullName: string; iersId: string }) => {
        return apiCall<ApiResponse<any>>('/auth/admin/users', 'POST', userData);
    },
};
