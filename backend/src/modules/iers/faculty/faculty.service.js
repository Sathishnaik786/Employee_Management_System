const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const logger = require('@lib/logger');

class FacultyService {
    /**
     * Get all faculty records with role-based scoping.
     */
    async getAll(user) {
        // Block students immediately
        if (user.role === 'STUDENT') {
            const error = new Error('Forbidden: Students cannot access faculty directory');
            error.status = 403;
            throw error;
        }

        let query = supabaseAdmin.from('faculty').select('*');

        // Apply scoping logic
        if (user.role === 'ADMIN' || user.role === 'HR' || user.role === 'HOD') {
            // Full access (HOD department filter in Phase 4)
        } else if (user.role === 'FACULTY') {
            // Can only see their own record
            query = query.or(`created_by.eq.${user.id},email.eq.${user.email}`);
        } else {
            return [];
        }

        const { data, error } = await query.order('full_name', { ascending: true });
        if (error) throw error;
        return data;
    }

    /**
     * Get faculty record by ID with role-based scoping.
     */
    async getById(id, user) {
        if (user.role === 'STUDENT') {
            const error = new Error('Forbidden: Students cannot access faculty data');
            error.status = 403;
            throw error;
        }

        const { data, error } = await supabaseAdmin
            .from('faculty')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        // Check access rights
        this.verifyOwnership(data, user);

        return data;
    }

    /**
     * Create faculty record.
     */
    async create(facultyData, user) {
        const payload = {
            ...facultyData,
            created_by: user.id
        };

        const { data, error } = await supabaseAdmin
            .from('faculty')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'FACULTY_CREATED',
            entity: 'faculty',
            entityId: data.id,
            metadata: { faculty_id: data.faculty_id, role: user.role }
        });

        return data;
    }

    /**
     * Update faculty record.
     */
    async update(id, updateData, user) {
        // First check if user can access this record
        const faculty = await this.getById(id, user);
        if (!faculty) {
            const error = new Error('Faculty record not found');
            error.status = 404;
            throw error;
        }

        const { data, error } = await supabaseAdmin
            .from('faculty')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'FACULTY_UPDATED',
            entity: 'faculty',
            entityId: data.id,
            metadata: {
                faculty_id: data.faculty_id,
                updated_fields: Object.keys(updateData)
            }
        });

        return data;
    }

    /**
     * Delete faculty record.
     */
    async delete(id, user) {
        // Strictly only ADMIN can delete
        if (user.role !== 'ADMIN') {
            const error = new Error('Forbidden: Only Administrators can delete faculty records');
            error.status = 403;
            throw error;
        }

        const { data: faculty, error: fetchError } = await supabaseAdmin
            .from('faculty')
            .select('faculty_id')
            .eq('id', id)
            .single();

        if (fetchError || !faculty) {
            const error = new Error('Faculty record not found');
            error.status = 404;
            throw error;
        }

        const { error } = await supabaseAdmin
            .from('faculty')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'FACULTY_DELETED',
            entity: 'faculty',
            entityId: id,
            metadata: { faculty_id: faculty.faculty_id }
        });

        return true;
    }

    /**
     * Internal helper to verify ownership or systemic access.
     */
    verifyOwnership(faculty, user) {
        if (user.role === 'ADMIN' || user.role === 'HR' || user.role === 'HOD') {
            return true;
        }

        if (user.role === 'FACULTY') {
            const isOwner = faculty.created_by === user.id || faculty.email === user.email;
            if (!isOwner) {
                const error = new Error('Forbidden: You do not have access to this faculty record');
                error.status = 403;
                throw error;
            }
            return true;
        }

        const error = new Error('Forbidden: Insufficient role permissions');
        error.status = 403;
        throw error;
    }
}

module.exports = new FacultyService();
