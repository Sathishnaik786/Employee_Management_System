require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing user_id column in employees...');
    try {
        const { data, error } = await supabase
            .from('employees')
            .select('user_id')
            .limit(1);

        if (error) {
            console.error('Column user_id check failed:', error.message);
        } else {
            console.log('Column user_id exists.');
        }

    } catch (err) {
        console.error('Exception:', err.message);
    }
}

test();
