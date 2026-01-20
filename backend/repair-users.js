require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function repairIersUsers() {
    console.log('--- Repairing IERS Users (Final Fix: No iers_id) ---');

    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) return;

    const alice = users.find(u => u.email === 'alice@iers.edu');
    const robert = users.find(u => u.email === 'robert@iers.edu');
    const admin = users.find(u => u.email === 'admin@iers.edu');

    const repairs = [];

    if (alice) {
        repairs.push({
            id: alice.id,
            email: alice.email,
            role: 'STUDENT',
            full_name: 'Alice Stark',
            // iers_id removed as it doesn't exist in DB
        });
    }

    if (robert) {
        repairs.push({
            id: robert.id,
            email: robert.email,
            role: 'FACULTY',
            full_name: 'Robert Oppenheimer',
        });
    }

    if (admin) {
        repairs.push({
            id: admin.id,
            email: admin.email,
            role: 'ADMIN',
            full_name: 'System Administrator',
        });
    }

    for (const user of repairs) {
        console.log(`Syncing ${user.email}...`);
        const { error } = await supabaseAdmin
            .from('iers_users')
            .upsert(user);

        if (error) {
            console.error(`❌ Failed to insert ${user.email}:`, error.message);
        } else {
            console.log(`✅ Successfully synced ${user.email}`);
        }
    }
}

repairIersUsers();
