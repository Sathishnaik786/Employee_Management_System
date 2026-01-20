const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const WorkflowService = require('../workflow/workflow.service');
const logger = require('@lib/logger');

class TrainingService {
    async createProgram(data, user) {
        const { data: program, error } = await supabaseAdmin
            .from('training_programs')
            .insert([data])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'TRAINING_PROGRAM_CREATED',
            entity: 'training_programs',
            entityId: program.id,
            metadata: { title: data.title }
        });

        // Initiate Training Program Approval Workflow
        try {
            await WorkflowService.initiateWorkflow('training_program', program.id, user);
        } catch (wfErr) {
            logger.error('Failed to initiate training program workflow', { error: wfErr.message });
        }

        return program;
    }

    async enrollStudent(data, user) {
        if (user.role === 'STUDENT') {
            const { data: student } = await supabaseAdmin.from('students').select('id').eq('email', user.email).single();
            if (!student || student.id !== data.student_id) {
                throw new Error('Forbidden: You can only enroll yourself');
            }
        }

        const { data: enrollment, error } = await supabaseAdmin
            .from('training_participants')
            .insert([{ ...data, status: 'ENROLLED' }])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'TRAINING_STUDENT_ENROLLED',
            entity: 'training_participants',
            entityId: enrollment.id,
            metadata: { program_id: data.program_id }
        });

        return enrollment;
    }

    async getAllPrograms(user) {
        const { data, error } = await supabaseAdmin
            .from('training_programs')
            .select('*, participants:training_participants(*)');

        if (error) throw error;
        return data;
    }
}

module.exports = new TrainingService();
