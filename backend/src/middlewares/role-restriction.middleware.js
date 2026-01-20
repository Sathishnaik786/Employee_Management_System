const PermissionService = require('@services/permission.service');

/**
 * Role Restriction Middleware
 * Enforces role-specific restrictions to prevent role escalation and unauthorized actions.
 * 
 * FACULTY must NOT act as GUIDE
 * GUIDE must NOT act as DRC or RAC
 * BLOCK: DRC actions, RAC actions, RRC actions, Final approvals
 */
const roleRestrictionMiddleware = (allowedActions) => {
  return (req, res, next) => {
    const { user } = req;

    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = user.role.toUpperCase();

    // Define restricted actions for each role
    const restrictedActions = {
      FACULTY: [
        'guide',           // Acting as guide
        'drc',            // DRC actions
        'rac',            // RAC actions  
        'rrc',            // RRC actions
        'final_approval', // Final approvals
        'approve',        // Approval actions
        'reject'          // Rejection actions (in most contexts)
      ],
      GUIDE: [
        'drc',            // DRC actions
        'rac',            // RAC actions
        'rrc',            // RRC actions
        'final_approval', // Final approvals
        'drc_member',     // Acting as DRC member
        'rac_member',     // Acting as RAC member
        'rrc_member'      // Acting as RRC member
      ]
    };

    // Check if the current action is restricted for the user's role
    if (restrictedActions[userRole]) {
      const isRestricted = allowedActions.some(action => 
        restrictedActions[userRole].includes(action.toLowerCase())
      );

      if (isRestricted) {
        return res.status(403).json({
          success: false,
          message: `ACCESS DENIED: Role ${userRole} is not authorized to perform this action.`
        });
      }
    }

    next();
  };
};

/**
 * Specific middleware to check if user can perform guide functions
 */
const requireGuidePermissions = () => {
  return (req, res, next) => {
    const { user } = req;

    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = user.role.toUpperCase();

    // Only GUIDE role should be able to perform guide-specific functions
    if (userRole !== 'GUIDE') {
      return res.status(403).json({
        success: false,
        message: 'ACCESS DENIED: Only GUIDE role can perform this action.'
      });
    }

    // Ensure user has the specific guide permissions
    const requiredGuidePermissions = [
      'iers:guide:accept',
      'iers:guide:scholars:view',
      'iers:guide:progress:submit',
      'iers:thesis:view',
      'iers:rac:decision:view'
    ];

    const hasGuidePermissions = requiredGuidePermissions.some(permission =>
      PermissionService.hasPermission(user, permission)
    );

    if (!hasGuidePermissions) {
      return res.status(403).json({
        success: false,
        message: 'ACCESS DENIED: Insufficient guide permissions.'
      });
    }

    next();
  };
};

/**
 * Specific middleware to check if user can perform faculty functions
 */
const requireFacultyPermissions = () => {
  return (req, res, next) => {
    const { user } = req;

    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = user.role.toUpperCase();

    // FACULTY role can perform faculty functions but not guide-specific ones
    if (userRole !== 'FACULTY' && userRole !== 'GUIDE') {
      return res.status(403).json({
        success: false,
        message: 'ACCESS DENIED: Insufficient permissions for faculty functions.'
      });
    }

    // Ensure user has the specific faculty permissions
    const requiredFacultyPermissions = [
      'iers:faculty:profile:read',
      'iers:students:assigned:view',
      'iers:research:directory:view',
      'iers:reports:academic:view'
    ];

    const hasFacultyPermissions = requiredFacultyPermissions.some(permission =>
      PermissionService.hasPermission(user, permission)
    );

    if (!hasFacultyPermissions) {
      return res.status(403).json({
        success: false,
        message: 'ACCESS DENIED: Insufficient faculty permissions.'
      });
    }

    next();
  };
};

/**
 * Middleware to prevent unauthorized approval actions
 */
const preventApprovalEscalation = () => {
  return (req, res, next) => {
    const { user } = req;

    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = user.role.toUpperCase();

    // Prevent FACULTY from performing approval actions that should be reserved for higher authorities
    if (userRole === 'FACULTY') {
      // Check if this is an approval/rejection route
      const isApprovalRoute = req.originalUrl.includes('/approve') || 
                             req.originalUrl.includes('/reject') ||
                             req.method === 'PUT' || 
                             req.method === 'POST';

      if (isApprovalRoute) {
        // Check if user has specific approval permissions
        const hasApprovalPermissions = PermissionService.hasPermission(user, 'iers:workflow:approve') ||
                                     PermissionService.hasPermission(user, 'iers:system:admin');
        
        if (!hasApprovalPermissions) {
          return res.status(403).json({
            success: false,
            message: 'ACCESS DENIED: FACULTY role cannot perform approval actions.'
          });
        }
      }
    }

    // Prevent GUIDE from performing approval actions that should be reserved for DRC/RAC
    if (userRole === 'GUIDE') {
      // Check if this is an approval/rejection route that's not guide-specific
      const isApprovalRoute = req.originalUrl.includes('/approve') || 
                             req.originalUrl.includes('/reject') ||
                             req.originalUrl.includes('/drc') ||
                             req.originalUrl.includes('/rac') ||
                             req.originalUrl.includes('/rrc');

      if (isApprovalRoute) {
        return res.status(403).json({
          success: false,
          message: 'ACCESS DENIED: GUIDE role cannot perform DRC/RAC approval actions.'
        });
      }
    }

    next();
  };
};

module.exports = {
  roleRestrictionMiddleware,
  requireGuidePermissions,
  requireFacultyPermissions,
  preventApprovalEscalation
};