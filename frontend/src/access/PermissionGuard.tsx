import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/access/permissions';

interface PermissionGuardProps {
    permission?: Permission | string;
    permissions?: (Permission | string)[];
    any?: boolean;
    children: React.ReactNode;
}

/**
 * PermissionGuard
 * 
 * Conditionally renders children only if the user has the required permission(s).
 * Use 'any' flag to allow if user has at least one of the listed permissions.
 * Otherwise, requires all listed permissions.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    permission,
    permissions = [],
    any = false,
    children
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

    let isAuthorized = false;

    if (permission) {
        isAuthorized = hasPermission(permission);
    } else if (permissions.length > 0) {
        if (any) {
            isAuthorized = hasAnyPermission(permissions);
        } else {
            isAuthorized = hasAllPermissions(permissions);
        }
    } else {
        // If no permissions specified, allow by default? 
        // No, user wants strict hardening.
        console.warn('PermissionGuard: No permissions specified. Access denied.');
        return null;
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
};
