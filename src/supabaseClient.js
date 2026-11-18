import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://mzsxryxuvyllljvbrzul.supabase.co';
const supabaseAnonKey = 'sb_publishable_a_Ujek9gxuIV9vESF2xl4A_ibpGwUV_';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
