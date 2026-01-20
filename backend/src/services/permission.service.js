const { supabaseAdmin } = require('@lib/supabase');
const { redis } = require('@lib/redis');
const logger = require('@lib/logger');

class PermissionService {
    /**
     * Get all permission slugs for a given role from the role_permissions table.
     * Caches the result in Redis for 1 hour if Redis is available.
     */
    async getPermissionsByRole(roleName) {
        if (!roleName) return [];

        const cacheKey = `rbac:role:${roleName.toUpperCase()}:permissions`;

        // 1. Try Cache
        if (redis) {
            try {
                const cached = await redis.get(cacheKey);
                if (cached) {
                    return JSON.parse(cached);
                }
            } catch (err) {
                logger.error('Redis error in PermissionService', { error: err.message });
            }
        }

        // 2. Fetch from DB
        const { data, error } = await supabaseAdmin
            .from('role_permissions')
            .select(`
                permissions (
                    slug
                )
            `)
            .eq('role_name', roleName.toUpperCase());

        if (error) {
            logger.error('Error fetching role permissions', { role: roleName, error: error.message });
            return [];
        }

        const permissions = data.map(item => item.permissions?.slug).filter(Boolean);

        // 3. Save to Cache
        if (redis && permissions.length > 0) {
            try {
                await redis.set(cacheKey, JSON.stringify(permissions), 'EX', 3600);
            } catch (err) {
                logger.error('Redis set error in PermissionService', { error: err.message });
            }
        }

        return permissions;
    }

    /**
     * Get user-specific permission overrides.
     */
    async getUserOverrides(userId) {
        if (!userId) return { grant: [], revoke: [] };

        const { data, error } = await supabaseAdmin
            .from('user_permissions')
            .select(`
                type,
                permissions (
                    slug
                )
            `)
            .eq('user_id', userId);

        if (error) {
            logger.error('Error fetching user overrides', { userId, error: error.message });
            return { grant: [], revoke: [] };
        }

        const overrides = {
            grant: [],
            revoke: []
        };

        data.forEach(item => {
            if (item.type === 'GRANT') {
                overrides.grant.push(item.permissions?.slug);
            } else if (item.type === 'REVOKE') {
                overrides.revoke.push(item.permissions?.slug);
            }
        });

        return overrides;
    }

    /**
     * Merges role permissions and user overrides.
     */
    async getFinalPermissions(userId, roleName) {
        const [rolePerms, userOverrides] = await Promise.all([
            this.getPermissionsByRole(roleName),
            this.getUserOverrides(userId)
        ]);

        // Merge logic: (Role Permissions + Grants) - Revokes
        const permissionSet = new Set(rolePerms);
        userOverrides.grant.forEach(slug => permissionSet.add(slug));
        userOverrides.revoke.forEach(slug => permissionSet.delete(slug));

        return Array.from(permissionSet);
    }

    /**
     * Centralized Permission Check.
     * Can be used in both middlewares and service layers.
     * 
     * @param {Object} user - The user object containing permissions array
     * @param {string} permission - The permission slug to check
     */
    hasPermission(user, permission) {
        if (!user || !user.permissions) return false;

        // Administrative wildcard
        if (user.permissions.includes('iers:system:admin')) return true;

        return user.permissions.includes(permission);
    }

    /**
     * Create an audit log entry (Standardized for Task 4).
     */
    async logAction({ userId, action, entity, entityId, metadata = {} }) {
        try {
            // Standardize metadata keys
            const enrichedMetadata = {
                ...metadata,
                audit_version: '2.0',
                institutional_gate: true,
                system_timestamp: new Date().toISOString()
            };

            await supabaseAdmin.from('audit_logs').insert([{
                user_id: userId,
                action,
                entity,
                entity_id: entityId,
                metadata: enrichedMetadata
            }]);
        } catch (err) {
            logger.error('Forensic audit log failed', { error: err.message, action, entity });
        }
    }
}

module.exports = new PermissionService();
