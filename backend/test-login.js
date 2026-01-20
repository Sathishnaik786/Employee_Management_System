require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use PUBLIC anon key for login (client simulation)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testLogin(email) {
    console.log(`Trying login for ${email} with password 'password123'...`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'password123'
    });

    if (error) {
        console.error(`❌ Login Failed: ${error.message}`);
    } else {
        console.log(`✅ Login Success! User ID: ${data.user.id}`);
        console.log(`   Session Token: ${data.session.access_token.substring(0, 20)}...`);
    }
}

async function runTests() {
    await testLogin('admin@iers.edu');
    await testLogin('rahul@iers.edu');
}

runTests();
