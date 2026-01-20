import { AppLayout } from './AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { studentsApi } from '@/services/api';

export function StudentLayout({ children }: { children: React.ReactNode }) {
    const { user, hasRole, hasPermission } = useAuth();

    if (!user || user.role !== 'STUDENT') {
        return <Navigate to="/unauthorized" replace />;
    }

    // Part C: Verify identity on mount
    useEffect(() => {
        if (hasPermission('iers:student:profile:read')) {
            studentsApi.getMe().catch(err => {
                console.error('Student identity sync failed', err);
            });
        }
    }, [hasPermission]);

    return <AppLayout>{children}</AppLayout>;
}
