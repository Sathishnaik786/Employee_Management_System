import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { Permission } from '@/access/permissions';
import DashboardUnauthorized from '@/pages/DashboardUnauthorized';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  requiredPermissions?: (Permission | string)[];
  allRequired?: boolean; // If true, must have all permissions, otherwise just one
  noLayout?: boolean;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  requiredPermissions,
  allRequired = false,
  noLayout = false,
  layout
}) => {
  const { user, hasRole, hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = useAuth();

  const Layout = layout || AppLayout;

  if (isLoading) {
    if (noLayout) return <div className="p-12 flex justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!user) return <Navigate to="/login" />;

  // 1. Permission Check
  if (requiredPermissions && requiredPermissions.length > 0) {
    const isAuthorized = allRequired
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!isAuthorized) {
      // Part E: Route-Local RBAC Failure - Render IN-PLACE instead of redirect
      return (
        <Layout>
          <DashboardUnauthorized />
        </Layout>
      );
    }
  }

  // 2. Role Check (Isolated via layouts too)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasRole(allowedRoles)) {
      // Part E: Route-Local Role Failure
      return (
        <Layout>
          <DashboardUnauthorized />
        </Layout>
      );
    }
  }

  const content = <Outlet />;

  if (noLayout) return content;

  return (
    <Layout>
      {content}
    </Layout>
  );
};

export default ProtectedRoute;