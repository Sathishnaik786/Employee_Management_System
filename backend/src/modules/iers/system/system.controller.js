const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');

exports.createPermission = async (req, res, next) => {
    try {
        const { slug, module, action, description } = req.body;

        if (!slug || !module || !action) {
            return res.status(400).json({ success: false, message: 'Slug, module, and action are required' });
        }

        const { data, error } = await supabaseAdmin
            .from('permissions')
            .insert([{ slug, module, action, description }])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: req.user.id,
            action: 'CREATE_PERMISSION',
            entity: 'permissions',
            entityId: data.id,
            metadata: { slug }
        });

        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getPermissions = async (req, res, next) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('permissions')
            .select('*')
            .order('slug', { ascending: true });

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.assignPermissionToRole = async (req, res, next) => {
    try {
        const { roleName, permissionId } = req.body;

        if (!roleName || !permissionId) {
            return res.status(400).json({ success: false, message: 'roleName and permissionId are required' });
        }

        const { data, error } = await supabaseAdmin
            .from('role_permissions')
            .insert([{ role_name: roleName.toUpperCase(), permission_id: permissionId }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ success: false, message: 'Permission already assigned to this role' });
            }
            throw error;
        }

        // Invalidate Redis cache for this role
        const { redis } = require('@lib/redis');
        if (redis) {
            await redis.del(`rbac:role:${roleName.toUpperCase()}:permissions`);
        }

        await PermissionService.logAction({
            userId: req.user.id,
            action: 'ASSIGN_ROLE_PERMISSION',
            entity: 'role_permissions',
            entityId: data.id,
            metadata: { roleName, permissionId }
        });

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.getMyPermissions = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user.permissions || []
        });
    } catch (err) {
        next(err);
    }
};
