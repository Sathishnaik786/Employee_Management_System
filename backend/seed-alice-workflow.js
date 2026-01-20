require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function seedStudentWorkflow() {
    console.log('--- Initializing Real-time Workflow Instance for Alice ---');

    // 1. Get Alice's ID
    const aliceId = '00000000-0000-0000-0000-000000000001';

    // 2. Get her PhD Application
    const { data: app } = await supabaseAdmin
        .from('phd_applications')
        .select('id')
        .eq('student_id', aliceId)
        .single();

    if (!app) {
        console.error('Alice PhD application not found. Run master seed first.');
        return;
    }

    // 3. Get the PhD Workflow
    const workflowId = '00000000-0000-0000-0000-000000000001';

    // 4. Create/Upsert Workflow Instance
    const instance = {
        workflow_id: workflowId,
        entity_type: 'phd_application',
        entity_id: app.id,
        current_step: 3, // Scrutiny Approved, waiting for Interview
        status: 'IN_PROGRESS',
        initiated_by: aliceId
    };

    const { error: instError } = await supabaseAdmin
        .from('workflow_instances')
        .upsert(instance, { onConflict: 'entity_type,entity_id' });

    if (instError) {
        console.error('Error seeding workflow instance:', instError.message);
    } else {
        console.log('✅ Workflow instance initialized at Step 3 (Guide Allocation/Interview prep).');
    }
}

seedStudentWorkflow();
