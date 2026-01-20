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
            const isOwner = student.id === user.id || student.email === user.email;
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

    /**
     * Get workflows associated with the current student.
     */
    async getMeWorkflows(user) {
        // 1. Get student identity (Sealed via getMyProfile)
        const student = await this.getMyProfile(user);

        // 2. Get PhD Application(s) for the student using internal student.id
        const { data: apps, error: appError } = await supabaseAdmin
            .from('phd_applications')
            .select('id, application_no, research_area, status, research_interest')
            .eq('student_id', student.id);

        if (appError) throw appError;
        if (!apps || apps.length === 0) return [];

        const appId = apps[0].id; // Handling primary application for now

        // 2. Fetch Workflow Instance
        const { data: instances, error: instError } = await supabaseAdmin
            .from('workflow_instances')
            .select(`
                *,
                workflow:workflows(*),
                actions:workflow_actions(*)
            `)
            .eq('entity_id', appId)
            .eq('entity_type', 'phd_application');

        if (instError) throw instError;
        if (!instances || instances.length === 0) return [];

        const instance = instances[0];

        // 3. Fetch all steps for this workflow to build the timeline
        const { data: steps, error: stepError } = await supabaseAdmin
            .from('workflow_steps')
            .select('*')
            .eq('workflow_id', instance.workflow_id)
            .order('step_order', { ascending: true });

        if (stepError) throw stepError;

        return {
            application: apps[0],
            workflow: {
                ...instance,
                steps: steps.map(step => ({
                    ...step,
                    is_completed: step.step_order < instance.current_step || instance.status === 'APPROVED',
                    is_current: step.step_order === instance.current_step && instance.status === 'IN_PROGRESS'
                }))
            }
        };
    }

    /**
     * Get real-time academic metrics for the student.
     */
    /**
     * Get metrics for the current student.
     */
    async getMeMetrics(user) {
        // 1. Get student identity (Sealed via getMyProfile)
        const student = await this.getMyProfile(user);

        // 2. Fetch latest academic record using student INTERNAL ID
        const { data: records, error: recError } = await supabaseAdmin
            .from('academic_records')
            .select('*')
            .eq('student_id', student.id)
            .order('semester', { ascending: false })
            .limit(1);

        if (recError) throw recError;

        const latestRecord = records?.[0] || {};

        // 3. Get PhD Stage if applicable
        let phdStage = 'N/A';
        if (student.program_type === 'PhD') {
            const { data: app } = await supabaseAdmin
                .from('phd_applications')
                .select('status')
                .eq('student_id', student.id)
                .maybeSingle();
            phdStage = app?.status || 'NOT_STARTED';
        }

        return {
            cgpa: latestRecord.cgpa || 0,
            attendance_percentage: latestRecord.attendance_percentage || 0,
            credits_completed: latestRecord.credits_completed || 0,
            academic_status: latestRecord.academic_status || 'UNDEFINED',
            phd_stage: phdStage,
            department: student.department,
            program: student.program_type
        };
    }

    /**
     * Get the current student profile based on auth user.
     * Identity Resolution Order: user_id lookup -> email lookup -> link -> auto-create
     */
    async getMyProfile(user) {
        // a) Find student by user_id
        let { data, error } = await supabaseAdmin
            .from('students')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) throw error;

        // b) If not found -> find student by email (Legacy/Imported Linkage)
        if (!data) {
            let { data: emailData, error: emailError } = await supabaseAdmin
                .from('students')
                .select('*')
                .eq('email', user.email)
                .maybeSingle();

            if (emailError) throw emailError;

            // c) If found by email -> LINK it
            if (emailData) {
                logger.info(`Linking student profile for email ${user.email} to user ID ${user.id}`);
                const { data: linkedData, error: linkError } = await supabaseAdmin
                    .from('students')
                    .update({ user_id: user.id })
                    .eq('id', emailData.id) // Use internal ID for update stability
                    .select()
                    .single();

                if (linkError) throw linkError;
                data = linkedData;
            }
        }

        // d) If still not found and DEV: auto-create (Safe Mode)
        if (!data && process.env.NODE_ENV === 'development') {
            logger.info(`Auto-bootstrapping NEW student profile for ${user.email} (DEV MODE)`);
            const studentId = `S-AUTO-${Date.now().toString().slice(-6)}`;

            const payload = {
                user_id: user.id,
                student_id: studentId,
                full_name: user.full_name || 'Autonomous Scholar',
                email: user.email,
                department: 'UNKNOWN',
                program_type: 'UNKNOWN',
                is_auto_generated: true
            };

            const { data: newData, error: insertError } = await supabaseAdmin
                .from('students')
                .insert([payload])
                .select()
                .single();

            if (insertError) {
                logger.error('Auto-bootstrap failed', insertError);
                throw insertError;
            }
            data = newData;
        }

        // Final check for identity
        if (!data) {
            const err = new Error('Student profile not initialized. Contact admin.');
            err.code = 'STUDENT_PROFILE_NOT_INITIALIZED';
            err.status = 404;
            throw err;
        }

        return data;
    }
}

module.exports = new StudentService();
