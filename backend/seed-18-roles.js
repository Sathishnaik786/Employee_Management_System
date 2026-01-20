require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');
const users = require('./indian-users-data');

// Database constraint fallback mapping
const ROLE_MAPPING = {
    'STUDENT': 'STUDENT',
    'FACULTY': 'FACULTY',
    'ADMIN': 'ADMIN',
    // Map academic extensions to FACULTY
    'GUIDE': 'GUIDE',  // GUIDE has its own specific permissions
    'DRC_MEMBER': 'DRC_MEMBER',
    'RAC_MEMBER': 'RAC_MEMBER',
    'RRC_MEMBER': 'RRC_MEMBER',
    'ADJUDICATOR': 'FACULTY',
    'EXTERNAL_REVIEWER': 'FACULTY',
    'MENTOR': 'FACULTY',
    // Map admin extensions to ADMIN
    'PRINCIPAL': 'PRINCIPAL',
    'MANAGEMENT': 'MANAGEMENT',
    'DEPT_ADMIN': 'ADMIN',
    'FINANCE': 'ADMIN',
    'IQAC_MEMBER': 'IQAC_MEMBER',
    'DVV_VERIFIER': 'DVV_VERIFIER',
    'EXTERNAL_REVIEWER': 'EXTERNAL_REVIEWER',
    'PLACEMENT_OFFICER': 'PLACEMENT_OFFICER',
    'RECRUITER': 'RECRUITER'
};

async function seedIndianUsers() {
    console.log('--- Seeding 18 Indian Roles (Mapped to Supported Schema) ---');

    for (const user of users) {
        try {
            const safeRole = ROLE_MAPPING[user.role] || 'FACULTY';
            console.log(`Processing ${user.name} (${user.role} -> ${safeRole})...`);

            // 1. Create/Get Auth User
            let userId;
            const { data: { users: existingUsers } } = await supabaseAdmin.auth.admin.listUsers();

            // Clean up: Delete existing user to ensure fresh start with correct metadata? 
            // No, just find existing.
            const existing = existingUsers.find(u => u.email === user.email);

            if (existing) {
                console.log(`   - Auth user exists: ${existing.id}`);
                userId = existing.id;
            } else {
                console.log(`   - Creating Auth user...`);
                const { data, error } = await supabaseAdmin.auth.admin.createUser({
                    email: user.email,
                    password: 'password123',
                    email_confirm: true
                });
                if (error) throw new Error(`Auth creation failed: ${error.message}`);
                userId = data.user.id;
            }

            // 2. Upsert into iers_users
            const { error: profileError } = await supabaseAdmin
                .from('iers_users')
                .upsert({
                    id: userId,
                    email: user.email,
                    role: safeRole, // Use safe role
                    full_name: user.name,
                    // iers_id: user.iers_id // Omitted
                });

            if (profileError) {
                console.error(`   ❌ Profile sync failed: ${profileError.message}`);
                continue;
            }

            // 3. Create Master Records
            if (safeRole === 'STUDENT') {
                await supabaseAdmin.from('students').upsert({
                    student_id: user.iers_id,
                    full_name: user.name,
                    email: user.email,
                    department: user.dept,
                    program_type: 'PhD'
                }, { onConflict: 'email' });
            } else if (safeRole === 'FACULTY') {
                await supabaseAdmin.from('faculty').upsert({
                    faculty_id: user.iers_id,
                    full_name: user.name,
                    email: user.email,
                    department: user.dept,
                    designation: user.role // Store actual role as designation!
                }, { onConflict: 'email' });
            }
            // For ADMIN mapped roles, we don't have a specific table, but they are in iers_users.

            console.log(`   ✅ Success`);

        } catch (err) {
            console.error(`   ❌ Critical Error for ${user.email}:`, err.message);
        }
    }

    console.log('--- Seeding Complete ---');
}

seedIndianUsers();
