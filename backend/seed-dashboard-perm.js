require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function seed() {
    console.log('--- Seeding Institutional Dashboard Permission ---');

    const dashboardPerm = {
        slug: 'iers:dashboard:view',
        module: 'campus',
        action: 'view',
        description: 'Base access to the institutional dashboard'
    };

    const { error: permError } = await supabaseAdmin
        .from('permissions')
        .upsert(dashboardPerm, { onConflict: 'slug' });

    if (permError) {
        console.error('Error seeding dashboard permission:', permError.message);
        return;
    }

    const { data: perm } = await supabaseAdmin
        .from('permissions')
        .select('id')
        .eq('slug', 'iers:dashboard:view')
        .single();

    if (!perm) return;

    // Assign to ALL roles
    const roles = [
        'STUDENT', 'FACULTY', 'GUIDE', 'DRC_MEMBER', 'RAC_MEMBER', 'RRC_MEMBER', 'ADJUDICATOR',
        'ADMIN', 'PRINCIPAL', 'MANAGEMENT', 'DEPT_ADMIN', 'FINANCE',
        'IQAC_MEMBER', 'DVV_VERIFIER', 'EXTERNAL_REVIEWER',
        'PLACEMENT_OFFICER', 'RECRUITER', 'MENTOR'
    ];

    for (const role of roles) {
        await supabaseAdmin.from('role_permissions').upsert({
            role_name: role,
            permission_id: perm.id
        }, { onConflict: 'role_name,permission_id' });
    }

    console.log('✅ Dashboard permission assigned to all 18 roles.');
}

seed();
