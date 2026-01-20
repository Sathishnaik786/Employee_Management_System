require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

const roles = [
    'STUDENT', 'FACULTY', 'GUIDE', 'DRC_MEMBER', 'RAC_MEMBER', 'RRC_MEMBER', 'ADJUDICATOR',
    'ADMIN', 'PRINCIPAL', 'MANAGEMENT', 'DEPT_ADMIN', 'FINANCE',
    'IQAC_MEMBER', 'DVV_VERIFIER', 'EXTERNAL_REVIEWER',
    'PLACEMENT_OFFICER', 'RECRUITER', 'MENTOR'
];

async function checkRoles() {
    console.log('--- Checking Supported Roles ---');

    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    const admin = users.find(u => u.email === 'admin@iers.edu');

    if (!admin) return;

    const supported = [];
    const unsupported = [];

    for (const role of roles) {
        const { error } = await supabaseAdmin
            .from('iers_users')
            .update({ role: role })
            .eq('id', admin.id);

        if (error) unsupported.push(role);
        else supported.push(role);
    }

    await supabaseAdmin.from('iers_users').update({ role: 'ADMIN' }).eq('id', admin.id);

    console.log('✅ Supported:', supported.join(', '));
    console.log('❌ Unsupported:', unsupported.join(', '));
}

checkRoles();
