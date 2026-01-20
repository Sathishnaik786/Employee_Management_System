import { ApiResponse } from '@/types';
import { router } from '@/router';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

/**
 * Generic API Call helper
 * Standardizes headers, token injection, and error handling
 */
export async function apiCall<T>(
    url: string,
    method: string,
    body?: any,
    token?: string
): Promise<T> {
    const headers: any = {
        'Content-Type': 'application/json',
    };

    // Always get the token dynamically from localStorage for the most up-to-date session
    const dynamicToken = localStorage.getItem('token') || token;
    if (dynamicToken) {
        headers.Authorization = `Bearer ${dynamicToken}`;
    }

    console.log(`API [${method}] ${url} - initiating...`);

    try {
        const res = await fetch(`${API_BASE_URL}${url}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        console.log(`API [${method}] ${url} - Status: ${res.status}`);

        const contentType = res.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            data = { message: await res.text() };
        }

        if (!res.ok) {
            // Part D: API Error Interceptor - Relaxed (Only 401 triggers redirect)
            if (res.status === 401) {
                const securityMsg = data.message || data.error || 'Session expired or invalid.';
                console.warn(`Security Interception: ${res.status} - ${securityMsg}`);

                // Using router to navigate within the SP Application (no full reload)
                router.navigate('/app/unauthorized', {
                    state: { message: securityMsg }
                });
            }

            // Create error with status code to allow frontend to handle specific cases (e.g. 401, 403)
            const error = new Error(data.message || 'API Error');
            (error as any).status = res.status;
            (error as any).message = data.error || data.message || 'API Error';
            throw error;
        }

        return data as T;
    } catch (error) {
        console.error(`API [${method}] ${url} - Error:`, error);
        throw error;
    }
}
