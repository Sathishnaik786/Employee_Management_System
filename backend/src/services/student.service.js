const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const logger = require('@lib/logger');

class StudentService {
    /**
     * Get all students with role-based scoping.
     */
    async getAll(user) {
        let query = supabaseAdmin.from('students').select('*');

        // Apply scoping logic
        if (user.role === 'ADMIN' || user.role === 'HR' || user.role === 'FACULTY') {
            // Can see all students
        } else if (user.role === 'STUDENT') {
            // Can only see their own record
            query = query.or(`created_by.eq.${user.id},email.eq.${user.email}`);
        } else {
            // Fallback for unknown roles - empty list or restricted
            return [];
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }

    /**
     * Get student by ID with role-based scoping.
     */
    async getById(id, user) {
        const { data, error } = await supabaseAdmin
            .from('students')
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
     * Create student record.
     */
    async create(studentData, user) {
        const payload = {
            ...studentData,
            created_by: user.id
        };

        const { data, error } = await supabaseAdmin
            .from('students')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'STUDENT_CREATED',
            entity: 'students',
            entityId: data.id,
            metadata: { student_id: data.student_id }
        });

        return data;
    }

    /**
     * Update student record.
     */
    async update(id, updateData, user) {
        // First check if user can access this record
        const student = await this.getById(id, user);
        if (!student) {
            throw new Error('Student not found');
        }

        const { data, error } = await supabaseAdmin
            .from('students')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'STUDENT_UPDATED',
            entity: 'students',
            entityId: data.id,
            metadata: { student_id: data.student_id }
        });

        return data;
    }

    /**
     * Delete student record.
     */
    async delete(id, user) {
        // Verify existence and access
        const student = await this.getById(id, user);
        if (!student) {
            throw new Error('Student not found');
        }

        const { error } = await supabaseAdmin
            .from('students')
            .delete()
            .eq('id', id);

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'STUDENT_DELETED',
            entity: 'students',
            entityId: id,
            metadata: { student_id: student.student_id }
        });

        return true;
    }

    /**
     * Internal helper to verify ownership or systemic access.
     */
    verifyOwnership(student, user) {
        if (user.role === 'ADMIN' || user.role === 'HR' || user.role === 'FACULTY') {
            return true;
        }

        if (user.role === 'STUDENT') {
            const isOwner = student.created_by === user.id || student.email === user.email;
            if (!isOwner) {
                const error = new Error('Forbidden: You do not have access to this student record');
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

module.exports = new StudentService();
