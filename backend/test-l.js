require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function t() {
    const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@iers.edu',
        password: 'password123'
    });
    if (error) console.log('FAIL ' + error.message);
    else console.log('OK');
}
t();
