import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase configuration
const hasValidSupabaseConfig = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://demo.supabase.co' && 
  supabaseAnonKey !== 'demo_anon_key_placeholder' &&
  supabaseUrl.includes('supabase.co');

let supabase: any = null;

if (hasValidSupabaseConfig) {
  console.log('✅ Using real Supabase configuration');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.log('🎭 Running in demo mode - Supabase not configured');
  // Create a mock Supabase client for demo purposes
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode' } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }) }) }),
      insert: () => Promise.resolve({ error: null }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) })
    })
  };
}

export { supabase };