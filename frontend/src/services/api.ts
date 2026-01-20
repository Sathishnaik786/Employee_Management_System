import {
  User,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  Student,
  Faculty,
  PhDApplication,
  WorkflowInstance,
  IERSNotification,
  Department
} from '@/types';
import { router } from '@/router';

/**
 * IERS - Integrated Resource & Education System
 * Central API Gateway
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

// --- BASE API UTILITY ---
export async function apiCall(
  url: string,
  method: string,
  body?: any,
  token?: string
) {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  const dynamicToken = localStorage.getItem('token') || token;
  if (dynamicToken) {
    headers.Authorization = `Bearer ${dynamicToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    // Security Interceptor (Relaxed: Only 401)
    if (res.status === 401) {
      const securityMsg = data.message || data.error || 'Access validation failed.';
      router.navigate('/app/unauthorized', { state: { message: securityMsg } });
    }

    const error = new Error(data.message || 'IERS API Error');
    (error as any).status = res.status;
    throw error;
  }

  return data;
}

// =====================
// 1. IDENTITY & AUTH
// =====================
export const authApi = {
  login: async (credentials: any): Promise<ApiResponse<AuthResponse>> => {
    return apiCall('/auth/login', 'POST', credentials);
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    return apiCall('/auth/me', 'GET');
  },

  forgotPassword: async (email: string) => {
    return apiCall('/auth/forgot-password', 'POST', { email });
  },

  checkEmailExists: async (email: string) => {
    return apiCall('/auth/check-email', 'POST', { email });
  },

  resetPassword: async (token: string, password: string) => {
    return apiCall('/auth/reset-password', 'POST', { token, password });
  }
};

// =====================
// 2. ACADEMIC MASTERS
// =====================
export const studentsApi = {
  getAll: async (params?: any): Promise<PaginatedResponse<Student>> => {
    const query = new URLSearchParams(params).toString();
    const response = await apiCall(`/iers/students?${query}`, 'GET');
    return response.data;
  },

  getProfile: async (id: string): Promise<ApiResponse<Student>> => {
    return apiCall(`/iers/students/${id}`, 'GET');
  },

  getMeMetrics: async (): Promise<ApiResponse<any>> => {
    return apiCall('/iers/students/me/metrics', 'GET');
  },

  getMe: async (): Promise<ApiResponse<Student>> => {
    return apiCall('/iers/students/me', 'GET');
  },

  getMeWorkflows: async (): Promise<ApiResponse<any>> => {
    return apiCall('/iers/students/me/workflows', 'GET');
  }
};

export const facultyApi = {
  getAll: async (params?: any): Promise<PaginatedResponse<Faculty>> => {
    const query = new URLSearchParams(params).toString();
    const response = await apiCall(`/iers/faculty?${query}`, 'GET');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Faculty>> => {
    return apiCall(`/iers/faculty/${id}`, 'GET');
  }
};

// =====================
// 3. RESEARCH (PHD)
// =====================
export const phdApi = {
  create: async (data: any): Promise<ApiResponse<PhDApplication>> => {
    return apiCall('/iers/phd/applications', 'POST', data);
  },

  submit: async (id: string): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/phd/applications/${id}/submit`, 'POST');
  },

  getAll: async (): Promise<ApiResponse<PhDApplication[]>> => {
    return apiCall('/iers/phd/applications', 'GET');
  },

  getById: async (id: string): Promise<ApiResponse<PhDApplication>> => {
    return apiCall(`/iers/phd/applications/${id}`, 'GET');
  },

  applyExemption: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/phd/applications/${id}/exemption`, 'POST', data);
  },

  verifyDocuments: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/phd/applications/${id}/documents/verify`, 'POST', data);
  },

  initiatePayment: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/phd/applications/${id}/payment/initiate`, 'POST', data);
  },

  confirmPayment: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/phd/applications/${id}/payment/confirm`, 'POST', data);
  },

  allocateGuide: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/phd/applications/${id}/guide`, 'POST', data);
  },

  getActiveLifecycle: async (): Promise<ApiResponse<any>> => {
    return apiCall('/iers/phd/lifecycle/active', 'GET');
  },

  startScrutiny: async (id: string): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/phd/applications/${id}/scrutiny/start`, 'POST');
  }
};

// =====================
// 4. WORKFLOW ENGINE
// =====================
export const workflowApi = {
  getInstance: async (id: string): Promise<ApiResponse<WorkflowInstance>> => {
    return apiCall(`/iers/workflows/${id}`, 'GET');
  },

  getPendingActions: async (): Promise<ApiResponse<WorkflowInstance[]>> => {
    return apiCall('/iers/workflows/pending', 'GET');
  },

  approveStep: async (instanceId: string, actionData: { action: string; remarks: string; next_step_payload?: any }): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/workflows/${instanceId}/action`, 'POST', actionData);
  }
};

// =====================
// 5. COMPLIANCE (NAAC)
// =====================
export const naacApi = {
  getIIQA: async (year: string): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/naac/iiqa/${year}`, 'GET');
  },

  updateSSR: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/naac/ssr/${id}`, 'PUT', data);
  }
};

// =====================
// 6. CAREER (PLACEMENT)
// =====================
export const placementApi = {
  getActiveDrives: async (): Promise<ApiResponse<any[]>> => {
    return apiCall('/iers/placement/drives/active', 'GET');
  },

  registerForDrive: async (driveId: string): Promise<ApiResponse<any>> => {
    return apiCall(`/iers/placement/register/${driveId}`, 'POST');
  }
};

// =====================
// 7. EMPLOYEES
// =====================
export const employeesApi = {
  getAll: async (params?: any): Promise<PaginatedResponse<any>> => {
    const query = new URLSearchParams(params).toString();
    const response = await apiCall(`/employees?${query}`, 'GET');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    return apiCall(`/employees/${id}`, 'GET');
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    return apiCall('/employees/profile', 'GET');
  }
};

// =====================
// 8. DEPARTMENTS
// =====================
export const departmentsApi = {
  getAll: async (): Promise<ApiResponse<Department[]>> => {
    const response = await apiCall('/departments', 'GET');
    return response;
  },

  getById: async (id: string): Promise<ApiResponse<Department>> => {
    const response = await apiCall(`/departments/${id}`, 'GET');
    return response;
  },

  create: async (data: Partial<Department>): Promise<ApiResponse<Department>> => {
    return apiCall('/departments', 'POST', data);
  },

  update: async (id: string, data: Partial<Department>): Promise<ApiResponse<Department>> => {
    return apiCall(`/departments/${id}`, 'PUT', data);
  }
};

// =====================
// 9. SYSTEM & NOTIFICATIONS
// =====================
export const systemApi = {
  getNotifications: async (): Promise<ApiResponse<IERSNotification[]>> => {
    return apiCall('/iers/system/notifications', 'GET');
  }
};
