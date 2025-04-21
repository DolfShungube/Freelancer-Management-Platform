 //import { createClient } from '@supabase/supabase-js'

 import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

 import  config  from './config.js';
 
 
 const supabaseUrl = config.SUPABASE_URL
 
 const supabaseRole = config.SUPABASE_SERVICE_ROLE
 
 
 
 const supabase1 = createClient(supabaseUrl, supabaseRole, {
     auth: {
       persistSession: true,
       autoRefreshToken: true,
     }
   });
 
 export default supabase1