require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function check() {
    console.log('--- Verifying Permissions ---');
    const { data: perms } = await supabaseAdmin.from('permissions').select('slug').ilike('slug', '%iers:student:profile:read%');
    console.log('Permissions found matching student profile read:', perms);

    const { data: rolePerms } = await supabaseAdmin
        .from('role_permissions')
        .select('role_name, permissions!inner(slug)')
        .eq('permissions.slug', 'iers:student:profile:read');

    console.log('Roles with iers:student:profile:read:', rolePerms?.map(rp => rp.role_name));
}

check();
