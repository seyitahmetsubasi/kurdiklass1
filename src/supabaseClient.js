import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://mzsxryxuvyllljvbrzul.supabase.co/rest/v1/';
const supabaseAnonKey = 'sb_publishable_a_Ujek9gxuIV9vESF2xl4A_ibpGwUV_';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'BURAYA_PROJECT_URL_YAPISTIRIN';
const supabaseAnonKey = 'BURAYA_PUBLIC_KEY_YAPISTIRIN';
console.log('AKTIF SUPABASE URL:', supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
