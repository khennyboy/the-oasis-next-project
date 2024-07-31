import { createClient } from "@supabase/supabase-js";
const supabaseUrl = 'https://qvimrligfqvjxvesfpcb.supabase.co'
export const supabase = createClient(supabaseUrl, process.env.supabaseKey)
