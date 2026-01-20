const { createClient } = require('@supabase/supabase-js');

/**
 * Public Supabase client using Anon Key.
 * Subject to RLS policies.
 */
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

/**
 * Administrative Supabase client using Service Role Key.
 * Bypasses RLS - use only for system-level operations.
 */
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

/**
 * Creates a user-bound Supabase client for RLS compatibility.
 * This ensures auth.uid() is correctly identified in SQL policies.
 * 
 * @param {string} token - The user's JWT token from Authorization header.
 */
const getUserClient = (token) => {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    );
};

module.exports = {
    supabase,
    supabaseAdmin,
    getUserClient
};