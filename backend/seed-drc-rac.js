require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function seed() {
    console.log('--- Seeding DRC and RAC Roles & Permissions ---');

    // 1. Define New Permissions
    const newPermissions = [
        { slug: 'iers:phd:application:read', module: 'phd', action: 'read', description: 'View PhD Application' },
        { slug: 'iers:phd:drc:evaluate', module: 'phd', action: 'evaluate', description: 'DRC Evaluation and scoring' },
        { slug: 'iers:phd:rac:meeting:view', module: 'phd', action: 'view', description: 'View RAC meetings data' },
        { slug: 'iers:phd:rac:progress:review', module: 'phd', action: 'review', description: 'Review progress reports in RAC' },
        { slug: 'iers:phd:rac:decision:submit', module: 'phd', action: 'submit', description: 'Submit final RAC decisions' }
    ];

    for (const perm of newPermissions) {
        const { error } = await supabaseAdmin
            .from('permissions')
            .upsert(perm, { onConflict: 'slug' });
        if (error) console.error(`Error seeding permission ${perm.slug}:`, error.message);
        else console.log(`✅ Permission ${perm.slug} seeded.`);
    }

    // 2. Define Roles
    // Note: In this system, roles are just strings in iers_users.role, 
    // but we need to add them to role_permissions to define their PBAC.

    // Get permission IDs
    const { data: allPerms } = await supabaseAdmin.from('permissions').select('id, slug');
    const getPermId = (slug) => allPerms.find(p => p.slug === slug)?.id;

    const drcPerms = [
        'iers:phd:application:read',
        'iers:phd:scrutiny:review',
        'iers:phd:interview:schedule',
        'iers:phd:drc:evaluate'
    ];

    const racPerms = [
        'iers:phd:rac:meeting:view',
        'iers:phd:rac:progress:review',
        'iers:phd:rac:decision:submit'
    ];

    // Assign to DRC_MEMBER
    console.log('Assigning permissions to DRC_MEMBER...');
    for (const slug of drcPerms) {
        const id = getPermId(slug);
        if (id) {
            await supabaseAdmin.from('role_permissions').upsert({
                role_name: 'DRC_MEMBER',
                permission_id: id
            }, { onConflict: 'role_name,permission_id' });
        }
    }

    // Assign to RAC_MEMBER
    console.log('Assigning permissions to RAC_MEMBER...');
    for (const slug of racPerms) {
        const id = getPermId(slug);
        if (id) {
            await supabaseAdmin.from('role_permissions').upsert({
                role_name: 'RAC_MEMBER',
                permission_id: id
            }, { onConflict: 'role_name,permission_id' });
        }
    }

    console.log('✅ DRC and RAC seeding complete.');
}

seed();
