import { AppLayout } from './AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function FacultyLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const isFaculty = user?.role === 'FACULTY' || user?.role === 'GUIDE' || user?.role === 'ADMIN';

    if (!user || !isFaculty) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
}
