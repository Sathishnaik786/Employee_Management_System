import { AppLayout } from './AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/unauthorized" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
}
