const { supabase, supabaseAdmin, getUserClient } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const logger = require('@lib/logger');

/**
 * IERS Security Middleware
 * 
 * 1. Validates Supabase JWT
 * 2. Resolves IERS Identity (iers_users table)
 * 3. Populates RBAC Permissions
 * 4. Injects RLS-bound Supabase Client
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'IERS Authentication Required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify token with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user) {
      return res.status(401).json({ success: false, message: 'Invalid or expired IERS session' });
    }

    const { user: authUser } = authData;

    // 2. Resolve IERS Identity (Bypassing RLS for identity resolution)
    const { data: iersUser, error: iersError } = await supabaseAdmin
      .from('iers_users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (iersError) {
      logger.error('CRITICAL: IERS Identity resolution failed', { userId: authUser.id, error: iersError.message });
      return res.status(500).json({ success: false, message: 'IERS Security Fault' });
    }

    if (!iersUser) {
      return res.status(403).json({
        success: false,
        message: 'IERS Identity Mismatch: This account is not registered in the educational database.'
      });
    }

    // 3. Populate Permissions (PBAC)
    const permissions = await PermissionService.getFinalPermissions(authUser.id, iersUser.role);

    // 4. Attach Identity Context to Request Object
    req.user = {
      id: authUser.id,
      email: authUser.email,
      role: iersUser.role?.toUpperCase(),
      fullName: iersUser.full_name,
      iersId: iersUser.iers_id,
      permissions: permissions || []
    };

    // 5. Attach RLS-compatible client for downstream operations
    req.supabase = getUserClient(token);

    next();
  } catch (error) {
    logger.error('IERS_AUTH_FATAL', { error: error.message });
    return res.status(500).json({ success: false, message: 'Internal security protocol failure' });
  }
};

module.exports = authMiddleware;
