require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function checkSchema() {
    console.log('--- Checking Schema ---');

    console.log('Attempting to read iers_users columns via RPC (if available) or raw insert error...');

    // Strategy: Try to Insert a dummy row with a KNOWN BAD column and parsing the error, 
    // OR just try to select * from iers_users limit 1 and print the object keys.
    // Since we successfully inserted a minimal row for Alice (id, email, role) in Step 877, 
    // we should be able to SELECT her record and see the available columns that are NULL.

    const { data, error } = await supabaseAdmin
        .from('iers_users')
        .select('*')
        .eq('email', 'alice@iers.edu')
        .single();

    if (error) {
        console.error('Select error:', error);
    } else {
        console.log('Columns found in returned object:', Object.keys(data));
    }
}

checkSchema();
