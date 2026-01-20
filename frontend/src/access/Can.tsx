import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from './permissions';

interface CanProps {
    permission: Permission | string;
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * <Can permission="EMPLOYEE_DELETE">
 *   Renders children only if the user has the specified permission.
 * </Can>
 */
export const Can: React.FC<CanProps> = ({ permission, children, fallback = null }) => {
    const { hasPermission } = useAuth();

    if (hasPermission(permission)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

interface CanAnyProps {
    permissions: (Permission | string)[];
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * <CanAny permissions={[PERMISSION.X, PERMISSION.Y]}>
 *   Renders children if the user has ANY of the specified permissions.
 * </CanAny>
 */
export const CanAny: React.FC<CanAnyProps> = ({ permissions, children, fallback = null }) => {
    const { hasAnyPermission } = useAuth();

    if (hasAnyPermission(permissions)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

interface CanAllProps {
    permissions: (Permission | string)[];
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * <CanAll permissions={[PERMISSION.X, PERMISSION.Y]}>
 *   Renders children only if the user has ALL of the specified permissions.
 * </CanAll>
 */
export const CanAll: React.FC<CanAllProps> = ({ permissions, children, fallback = null }) => {
    const { hasAllPermissions } = useAuth();

    if (hasAllPermissions(permissions)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
