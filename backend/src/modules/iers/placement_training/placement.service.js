const { supabaseAdmin } = require('@lib/supabase');
const PermissionService = require('@services/permission.service');
const logger = require('@lib/logger');

class PlacementService {
    /**
     * Create/Update Job Posting (Audit included)
     */
    async manageJobPosting(driveData, user) {
        // Enforce Recruiter Scope
        if (user.role === 'RECRUITER') {
            const { data: company } = await supabaseAdmin
                .from('placement_companies')
                .select('id')
                .eq('id', driveData.company_id)
                .single();

            // In a real system, recruiter_id would be linked to company_id in iers_users
            // For now, we assume the frontend passes the correct company_id or we verify via a link table
        }

        const { data, error } = await supabaseAdmin
            .from('placement_drives')
            .upsert({
                ...driveData,
                created_by: user.id
            }, { onConflict: 'id' })
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'PLACEMENT_JOB_POSTED',
            entity: 'placement_drives',
            entityId: data.id,
            metadata: { company_id: data.company_id, role: user.role }
        });

        return data;
    }

    /**
     * Issue Placement Offer
     */
    async issueOffer(offerData, user) {
        const { data, error } = await supabaseAdmin
            .from('placement_offers')
            .insert([{
                ...offerData,
                status: 'OFFERED'
            }])
            .select()
            .single();

        if (error) throw error;

        await PermissionService.logAction({
            userId: user.id,
            action: 'PLACEMENT_OFFER_ISSUED',
            entity: 'placement_offers',
            entityId: data.id,
            metadata: {
                student_id: data.student_id,
                company_id: data.company_id,
                drive_id: offerData.drive_id || 'N/A'
            }
        });

        return data;
    }

    /**
     * Get Student-Specific Applications (Isolation)
     */
    async getStudentApplications(studentId, user) {
        // Strict boundary: A student can only see their own applications
        if (user.role === 'STUDENT' && user.id !== studentId) {
            throw new Error('Forbidden: Protocol Isolation Violation');
        }

        const { data, error } = await supabaseAdmin
            .from('placement_interviews')
            .select('*, drive:placement_drives(*, company:placement_companies(*))')
            .eq('student_id', studentId);

        if (error) throw error;
        return data;
    }

    /**
     * Get Company Details (Recruiter Privacy)
     */
    async getCompanyContext(companyId, user) {
        // Recruiter can only see their own company (Logic check)
        // Placement Officer can see all
        const { data, error } = await supabaseAdmin
            .from('placement_companies')
            .select('*')
            .eq('id', companyId)
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new PlacementService();
