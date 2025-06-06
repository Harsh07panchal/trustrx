import { createClient } from 'npm:@supabase/supabase-js@2';
import { RateLimiter } from 'npm:limiter@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create rate limiters
const ipLimiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: "minute"
});

const userLimiter = new RateLimiter({
  tokensPerInterval: 50,
  interval: "minute"
});

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, userId, ip } = await req.json();

    // Check IP-based rate limit
    const ipRemaining = await ipLimiter.removeTokens(1);
    if (ipRemaining < 0) {
      throw new Error('IP rate limit exceeded');
    }

    // Check user-based rate limit
    if (userId) {
      const userRemaining = await userLimiter.removeTokens(1);
      if (userRemaining < 0) {
        throw new Error('User rate limit exceeded');
      }
    }

    // Log security event
    await supabaseClient
      .from('security_logs')
      .insert({
        user_id: userId,
        ip_address: ip,
        action,
        timestamp: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});