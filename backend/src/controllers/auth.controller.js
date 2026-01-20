const { supabase, supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const logger = require('@lib/logger');

/**
 * IERS Authentication Controller
 * Strictly handles Integrated Resource & Education System identities.
 */

// Login function - Pointing to IERS identity tables
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email?.trim().toLowerCase();
        const cleanPassword = password?.trim();

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // 1. Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
        });

        if (error) {
            logger.warn('Login attempt failed', { email, error: error.message });
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        const authUser = data.user;

        // 2. Resolve IERS Identity (Bridge Table)
        const { data: iersUser, error: iersError } = await supabaseAdmin
            .from('iers_users')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();

        if (iersError) {
            logger.error('IERS Identity resolution error', { userId: authUser.id, error: iersError.message });
            return res.status(500).json({
                success: false,
                message: 'Internal identity resolution error'
            });
        }

        if (!iersUser) {
            logger.warn('Auth user has no IERS record', { userId: authUser.id });
            return res.status(403).json({
                success: false,
                message: 'Access Denied: No IERS profile associated with this account.',
            });
        }

        // 3. Populate Permissions
        const permissions = await PermissionService.getFinalPermissions(authUser.id, iersUser.role);

        // 4. Return IERS Context
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: authUser.id,
                    email: authUser.email,
                    role: iersUser.role,
                    fullName: iersUser.full_name,
                    iersId: iersUser.iers_id,
                    permissions: permissions || []
                },
                token: data.session.access_token
            },
            message: 'Login successful'
        });
    } catch (err) {
        logger.error('Fatal Login Error', { error: err.message });
        next(err);
    }
};

// Get current IERS profile
exports.getMe = async (req, res, next) => {
    try {
        const { data: iersUser, error } = await supabaseAdmin
            .from('iers_users')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error || !iersUser) {
            return res.status(404).json({
                success: false,
                message: 'IERS Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    ...req.user,
                    fullName: iersUser.full_name,
                    iersId: iersUser.iers_id
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

// Password Reset logic (Minimal IERS flow)
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`
        });

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your registered IERS email.'
        });
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const { error } = await supabaseAdmin.auth.admin.updateUserById(token, { password });

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Password reset successfully.'
        });
    } catch (err) {
        next(err);
    }
};

// Check if IERS email exists
exports.checkEmailExists = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { data, error } = await supabaseAdmin
            .from('iers_users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (error) throw error;

        res.status(200).json({
            success: true,
            exists: !!data
        });
    } catch (err) {
        next(err);
    }
};

// Admin: Create IERS User
exports.createUser = async (req, res, next) => {
    try {
        const { email, password, role, fullName, iersId } = req.body;

        // 1. Create Supabase Auth User
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: password || 'Iers@123', // Default institutional password
            email_confirm: true
        });

        if (authError) throw authError;

        // 2. Create IERS Identity Bridge
        const { error: iersError } = await supabaseAdmin
            .from('iers_users')
            .insert([{
                id: authUser.user.id,
                email,
                role,
                full_name: fullName,
                iers_id: iersId
            }]);

        if (iersError) throw iersError;

        res.status(201).json({
            success: true,
            message: 'IERS User created successfully',
            data: { id: authUser.user.id }
        });
    } catch (err) {
        logger.error('Error creating IERS user', { error: err.message });
        next(err);
    }
};
