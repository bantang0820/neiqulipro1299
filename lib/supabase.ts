import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for public access (Browser & default Server Actions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for Admin access (Server Actions only - Bypasses RLS)
// Only initialize if the key exists to prevent client-side errors if accidentally imported
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey) 
  : null
