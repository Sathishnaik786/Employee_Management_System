require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function updateSchema() {
    console.log('--- Updating Workflow Schema ---');

    // 1. Add required_permission to workflow_steps
    const { error: err1 } = await supabaseAdmin.rpc('exec_sql', {
        sql: 'ALTER TABLE workflow_steps ADD COLUMN IF NOT EXISTS required_permission VARCHAR;'
    });

    if (err1) {
        console.error('Error adding required_permission:', err1.message);
        // Fallback: If RPC is not available, we might need another way or just assume it's created via manual SQL if possible
        // But since I can't run raw SQL easily without RPC, I'll hope it works or use a dummy insert to check
    } else {
        console.log('✅ Column required_permission added to workflow_steps');
    }
}

updateSchema();
