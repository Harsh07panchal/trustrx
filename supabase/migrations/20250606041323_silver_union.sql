/*
  # Security Tables Creation

  1. New Tables
    - security_logs: Stores security-related events
    - two_factor_auth: Stores 2FA secrets and settings
    - webauthn_credentials: Stores WebAuthn credentials
    - rate_limits: Stores rate limiting data

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Security Logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  ip_address text,
  action text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Two Factor Authentication table
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  secret text NOT NULL,
  enabled boolean DEFAULT false,
  backup_codes text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- WebAuthn Credentials table
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  credential_id text UNIQUE NOT NULL,
  public_key text NOT NULL,
  counter bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Rate Limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  tokens int DEFAULT 0,
  last_update timestamptz DEFAULT now(),
  UNIQUE(key)
);

-- Enable Row Level Security
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE webauthn_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Security Logs Policies
CREATE POLICY "Users can read their own security logs"
  ON security_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Two Factor Auth Policies
CREATE POLICY "Users can manage their own 2FA"
  ON two_factor_auth
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- WebAuthn Credentials Policies
CREATE POLICY "Users can manage their own WebAuthn credentials"
  ON webauthn_credentials
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Rate Limits Policies
CREATE POLICY "Service role only"
  ON rate_limits
  FOR ALL
  TO service_role
  USING (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON security_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_rate_limits_key ON rate_limits(key);