require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing Supabase connection...');
    try {
        const { data: employees, error: empError } = await supabase
            .from('employees')
            .select('*')
            .limit(5);

        if (empError) {
            console.error('Error fetching employees:', empError.message);
        } else {
            console.log('Employees table found. Rows:', employees.length);
            console.log('Sample IDs:', employees.map(e => e.user_id));
        }

        const { data: users, error: userError } = await supabase
            .from('users')
            .select('*')
            .limit(5);

        if (userError) {
            console.error('Error fetching users:', userError.message);
        } else {
            console.log('Users table found. Rows:', users.length);
        }

    } catch (err) {
        console.error('Exception:', err.message);
    }
}

test();
