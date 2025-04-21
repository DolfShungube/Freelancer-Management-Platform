 //import { createClient } from '@supabase/supabase-js'

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

import  config  from './config.js';


const supabaseUrl = config.SUPABASE_URL

const supabaseKey = config.SUPABASE_ANON_KEY



const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });

export default supabase