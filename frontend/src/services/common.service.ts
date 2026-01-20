import { apiCall } from './api-client';

export const commonService = {
    getDepartments: async () => {
        return apiCall('/departments', 'GET');
    },

    getRoles: async () => {
        return apiCall('/roles', 'GET');
    },

    getSettings: async () => {
        return apiCall('/settings', 'GET');
    },

    uploadFile: async (file: File, folder: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        // apiCall uses JSON by default, for multipart we need a custom fetch or update apiCall
        // For now, mirroring the likely need
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3003/api'}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return res.json();
    }
};
