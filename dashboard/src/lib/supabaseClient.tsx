import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabaseClient = async (supabaseAccessToken: string) => {
    const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    });
    // set Supabase JWT on the client object,
    // so it is sent up with all Supabase requests
    return supabase;
};
export default supabaseClient