require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function seedPhDWorkflow() {
    console.log('--- Seeding PhD Workflow (Indian Context) ---');

    try {
        // 1. Get Rahul's Student ID
        const { data: student, error: stdError } = await supabaseAdmin
            .from('students')
            .select('id, full_name')
            .eq('email', 'rahul@iers.edu')
            .single();

        if (stdError || !student) {
            console.error('Rahul Sharma not found in Students table. Did seed-18-roles run?');
            return;
        }
        console.log(`Found Student: ${student.full_name} (${student.id})`);

        // 2. Define Workflow Blueprint
        console.log(' defining Workflow Blueprint...');
        const wfName = 'PhD Admission (Indian Mode)';

        // Remove existing to avoid dupes
        await supabaseAdmin.from('workflows').delete().eq('name', wfName);

        const { data: wf, error: wfError } = await supabaseAdmin
            .from('workflows')
            .insert({
                name: wfName,
                module: 'phd',
                entity_type: 'phd_application',
                is_active: true
            })
            .select()
            .single();

        if (wfError) throw wfError;
        console.log(`Workflow Definition Created: ${wf.id}`);

        // 3. Define Steps
        // Note: Using FACULTY as generic approver due to DB role constraints
        const steps = [
            {
                workflow_id: wf.id,
                step_order: 1,
                step_name: 'DRC Scrutiny',
                approval_type: 'SEQUENTIAL',
                approver_roles: ['FACULTY']
            },
            {
                workflow_id: wf.id,
                step_order: 2,
                step_name: 'RAC Interview',
                approval_type: 'SEQUENTIAL',
                approver_roles: ['FACULTY']
            },
            {
                workflow_id: wf.id,
                step_order: 3,
                step_name: 'Principal Approval',
                approval_type: 'SEQUENTIAL',
                approver_roles: ['ADMIN'] // Principal is mapped to ADMIN
            }
        ];

        const { error: stepsError } = await supabaseAdmin.from('workflow_steps').insert(steps);
        if (stepsError) throw stepsError;
        console.log(`Workflow Steps Defined.`);

        // 4. Create PhD Application
        console.log('Submitting PhD Application...');
        const appNo = `PHD-2026-${Math.floor(Math.random() * 1000)}`;

        // Cleanup existing application for Rahul
        await supabaseAdmin.from('phd_applications').delete().eq('student_id', student.id);

        const { data: app, error: appError } = await supabaseAdmin
            .from('phd_applications')
            .insert({
                application_no: appNo,
                student_id: student.id,
                program: 'PhD (Computer Science)',
                research_area: 'AI in Education',
                status: 'SUBMITTED' // Initial status
            })
            .select()
            .single();

        if (appError) throw appError;
        console.log(`Application Submitted: ${app.application_no}`);

        // 5. Initiate Workflow Instance
        console.log('Initiating Workflow Instance...');
        const { error: instError } = await supabaseAdmin
            .from('workflow_instances')
            .insert({
                workflow_id: wf.id,
                entity_type: 'phd_application',
                entity_id: app.id,
                current_step: 1,
                status: 'IN_PROGRESS'
            });

        if (instError) throw instError;
        console.log(`✅ Workflow Initiated!`);

    } catch (err) {
        console.error('❌ Error Seeding Workflow:', err.message);
    }
}

seedPhDWorkflow();
