require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing singular names...');
    try {
        const { data: user, error: userError } = await supabase
            .from('user')
            .select('*')
            .limit(1);

        if (userError) {
            console.error('Error fetching user:', userError.message);
        } else {
            console.log('Table "user" exists.');
        }

        const { data: employee, error: empError } = await supabase
            .from('employee')
            .select('*')
            .limit(1);

        if (empError) {
            console.error('Error fetching employee:', empError.message);
        } else {
            console.log('Table "employee" exists.');
        }

    } catch (err) {
        console.error('Exception:', err.message);
    }
}

test();
