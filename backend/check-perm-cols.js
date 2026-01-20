require('dotenv').config();
const { supabaseAdmin } = require('./src/lib/supabase');

async function check() {
    const { data, error } = await supabaseAdmin.from('permissions').select('*').limit(1);
    if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    } else {
        console.log('No data found, error:', error);
    }
}
check();
