import { Permission } from './permissions';
import { ROLE_PERMISSIONS } from './role-permission.map';
import { Role } from '@/types';

/**
 * Permission Resolver
 * Centralizes the logic for checking user permissions.
 * Supports both role-based mapping (legacy) and explicit permission arrays.
 */
export class PermissionResolver {
    private permissions: Set<string>;

    constructor(userRole: Role | null, explicitPermissions: string[] = []) {
        // Source of Truth: Backend provided permission slugs
        if (explicitPermissions && explicitPermissions.length > 0) {
            this.permissions = new Set<string>(explicitPermissions);
        }
        // Legacy Fallback: Client-side role-to-permission mapping
        else if (userRole && ROLE_PERMISSIONS[userRole]) {
            this.permissions = new Set<string>(ROLE_PERMISSIONS[userRole]);
        }
        else {
            this.permissions = new Set<string>();
        }
    }

    /**
     * Check if a single permission is granted.
     */
    hasPermission(permission: Permission | string): boolean {
        return this.permissions.has(permission);
    }

    /**
     * Check if any of the provided permissions are granted.
     */
    hasAnyPermission(requiredPermissions: (Permission | string)[]): boolean {
        return requiredPermissions.some(p => this.permissions.has(p));
    }

    /**
     * Check if all of the provided permissions are granted.
     */
    hasAllPermissions(requiredPermissions: (Permission | string)[]): boolean {
        return requiredPermissions.every(p => this.permissions.has(p));
    }

    /**
     * Get all resolved permissions for debugging or external use.
     */
    getResolvedPermissions(): string[] {
        return Array.from(this.permissions);
    }
}

/**
 * Factory function to create a resolver instance.
 */
export const createPermissionResolver = (role: Role | null, perms: string[] = []) => {
    return new PermissionResolver(role, perms);
};
