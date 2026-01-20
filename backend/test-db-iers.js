require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
    const { data, error } = await supabase.from(tableName).select('count').limit(1);
    if (error) {
        console.log(`❌ Table '${tableName}' error: ${error.message}`);
    } else {
        console.log(`✅ Table '${tableName}' exists.`);
    }
}

async function test() {
    console.log('--- IERS Schema Validation ---');
    await checkTable('iers_users');
    await checkTable('permissions');
    await checkTable('role_permissions');
    await checkTable('students');
    await checkTable('faculty');
    await checkTable('phd_applications');
    await checkTable('workflows');
    console.log('--- End of Validation ---');
}

test();
