require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

const IERS_USERS = [
    {
        email: 'admin@iers.edu',
        password: 'password123',
        role: 'ADMIN',
        firstName: 'System',
        lastName: 'Administrator',
        iersId: 'ADMIN-001'
    },
    {
        email: 'robert@iers.edu',
        password: 'password123',
        role: 'FACULTY',
        firstName: 'Robert',
        lastName: 'Oppenheimer',
        iersId: 'FAC-PHY-001'
    },
    {
        email: 'alice@iers.edu',
        password: 'password123',
        role: 'STUDENT',
        firstName: 'Alice',
        lastName: 'Stark',
        iersId: 'S2026-001'
    }
];

async function seedUsers() {
    console.log('🌱 Starting IERS User Seeding...');

    for (const user of IERS_USERS) {
        try {
            let userId;

            // 1. Check if user exists in Auth
            console.log(`Checking Auth for ${user.email}...`);
            const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

            const existingUser = users.find(u => u.email === user.email);

            if (existingUser) {
                console.log(`✅ User ${user.email} already exists in Auth. ID: ${existingUser.id}`);
                userId = existingUser.id;
            } else {
                console.log(`Creating Auth user ${user.email}...`);
                const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email: user.email,
                    password: user.password,
                    email_confirm: true
                });

                if (createError) throw createError;
                userId = data.user.id;
                console.log(`✅ Created Auth user ${user.email}. ID: ${userId}`);
            }

            // 2. Upsert into iers_users table
            console.log(`Syncing profile to iers_users for ${user.email}...`);
            const profileData = {
                id: userId,
                email: user.email,
                role: user.role,
                first_name: user.firstName,
                last_name: user.lastName,
                iers_id: user.iersId,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            };

            const { error: upsertError } = await supabaseAdmin
                .from('iers_users')
                .upsert(profileData, { onConflict: 'id' });

            if (upsertError) {
                console.error(`❌ Failed to upsert profile for ${user.email}:`, upsertError.message);
            } else {
                console.log(`✅ Synced profile for ${user.email}`);
            }

        } catch (err) {
            console.error(`❌ Error processing ${user.email}:`, err.message);
        }
    }

    console.log('✨ Seeding Completed!');
}

seedUsers();
