require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function debugIersUsers() {
    console.log('--- Debugging IERS Users ---');

    console.log('1. Checking Auth Users:');
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) console.error('Error listing auth users:', listError);
    else {
        users.forEach(u => console.log(`   - ${u.email} (ID: ${u.id})`));
    }

    console.log('\n2. Checking iers_users Table:');
    const { data: iersUsers, error: iersError } = await supabaseAdmin
        .from('iers_users')
        .select('*');

    if (iersError) console.error('Error listing iers_users:', iersError);
    else {
        if (iersUsers.length === 0) console.log('   [EMPTY] No records found in iers_users');
        iersUsers.forEach(u => console.log(`   - ${u.email} (ID: ${u.id}) [Role: ${u.role}]`));
    }
}

debugIersUsers();
