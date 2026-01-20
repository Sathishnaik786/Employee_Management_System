require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function applyMigration() {
    console.log('--- Applying Workflow SCHEDULE Migration ---');

    // In Supabase, usually we don't have direct SQL access unless we use an RPC.
    // If the check constraint already exists, we might need to recreate it.
    // We'll try to perform a dummy SCHEDULE action to see if it allows it, 
    // but the most reliable way is if the user has provided the 'exec_sql' RPC.

    const sql = `
        ALTER TABLE workflow_actions DROP CONSTRAINT IF EXISTS workflow_actions_action_check;
        ALTER TABLE workflow_actions ADD CONSTRAINT workflow_actions_action_check CHECK (action IN ('APPROVE', 'REJECT', 'SCHEDULE'));
    `;

    const { error } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql });

    if (error) {
        if (error.message.includes('function "exec_sql" does not exist')) {
            console.error('CRITICAL: RPC "exec_sql" missing. Please enable it in Supabase SQL Editor.');
            console.log('-- SQL TO RUN MANUALLY --');
            console.log(sql);
        } else {
            console.error('Migration failed:', error.message);
        }
    } else {
        console.log('✅ Migration Applied Successfully');
    }
}

applyMigration();
