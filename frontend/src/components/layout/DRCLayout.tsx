import { AppLayout } from './AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { authApi } from '@/services/api';

export function DRCLayout({ children }: { children: React.ReactNode }) {
    const { user, hasPermission } = useAuth();
    const isDRC = user?.role === 'DRC_MEMBER' || user?.role === 'ADMIN';

    useEffect(() => {
        if (hasPermission('iers:faculty:profile:read')) {
            authApi.getMe().catch(() => {
                // Silently skip if fails
            });
        }
    }, [hasPermission]);

    if (!user || !isDRC) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
}
