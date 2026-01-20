require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function listAll() {
    const { data: permissions } = await supabaseAdmin.from('permissions').select('slug');
    const { data: rolePerms } = await supabaseAdmin.from('role_permissions').select('*');

    console.log('--- ALL PERMISSIONS ---');
    console.log(permissions.map(p => p.slug));

    console.log('\n--- ROLE PERMISSIONS ---');
    const grouped = {};
    rolePerms.forEach(rp => {
        if (!grouped[rp.role_name]) grouped[rp.role_name] = [];
        // Note: rp.permission_id needs to be resolved to slug if needed, but for now we just see roles
        grouped[rp.role_name].push(rp.permission_id);
    });
    console.log(Object.keys(grouped));
}

listAll();
