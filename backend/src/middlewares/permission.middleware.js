const PermissionService = require('@services/permission.service');

/**
 * Centralized Permission-Based Access Control Middleware.
 * 
 * Enforces granular permissions across the IERS backend.
 * Uses PermissionService for stateful permission resolution.
 */

/**
 * Ensures the authenticated user has exactly one specific permission.
 * 
 * @param {string} slug - The permission slug required (e.g. 'iers:workflow:create')
 */
const requirePermission = (slug) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        if (PermissionService.hasPermission(req.user, slug)) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: `ACCESS DENIED: Required protocol [${slug}] not found in user security context.`
        });
    };
};

/**
 * Ensures the authenticated user has AT LEAST ONE of the specified permissions.
 * 
 * @param {string[]} slugs - Array of permission slugs
 */
const requireAnyPermission = (slugs) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const hasAny = slugs.some(slug => PermissionService.hasPermission(req.user, slug));

        if (hasAny) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: `ACCESS DENIED: At least one of the required protocols [${slugs.join(', ')}] must be authorized.`
        });
    };
};

module.exports = {
    requirePermission,
    requireAnyPermission,
    // Backward compatibility for existing 'authorize' calls
    authorize: requirePermission
};
