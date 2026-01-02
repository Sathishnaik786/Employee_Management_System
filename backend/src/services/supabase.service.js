const { createClient } = require('@supabase/supabase-js');

// Validate required environment variables at startup
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Missing required Supabase environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment');
    process.exit(1);
}

// Create Supabase client using environment variables directly
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Service role client for admin operations using environment variables
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

module.exports = {
    supabase,
    supabaseAdmin
};