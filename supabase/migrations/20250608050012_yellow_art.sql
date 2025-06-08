/*
  # Create users table for TrustRx

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users id
      - `email` (text, unique)
      - `phone` (text, unique, nullable)
      - `display_name` (text)
      - `role` (text) - 'patient' or 'doctor'
      - `subscription_tier` (text) - 'free', 'basic', 'premium', 'unlimited'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_verified` (boolean) - for doctors
      - `verification_status` (text) - 'pending', 'approved', 'rejected'
      - `specialty` (text, nullable) - for doctors
      - `license_number` (text, nullable) - for doctors
      - `hospital_affiliation` (text, nullable) - for doctors
      - `education` (text, nullable) - for doctors
      - `years_of_experience` (integer, nullable) - for doctors
      - `documents` (jsonb, nullable) - for doctors
      - `location` (jsonb, nullable) - for doctors
      - `accepting_new_patients` (boolean) - for doctors
      - `rating` (decimal, nullable) - for doctors
      - `review_count` (integer) - for doctors
      - `photo_url` (text, nullable)
      - `bio` (text, nullable)
      - `languages` (text[], nullable)

  2. Security
    - Enable RLS on `users` table
    - Add policies for users to read/update their own data
    - Add policy for public to read doctor profiles
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  phone text UNIQUE,
  display_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('patient', 'doctor')),
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'unlimited')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Doctor specific fields
  is_verified boolean DEFAULT false,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  specialty text,
  license_number text,
  hospital_affiliation text,
  education text,
  years_of_experience integer DEFAULT 0,
  documents jsonb DEFAULT '{}',
  location jsonb DEFAULT '{}',
  accepting_new_patients boolean DEFAULT true,
  rating decimal(3,2) DEFAULT 4.5,
  review_count integer DEFAULT 0,
  photo_url text,
  bio text,
  languages text[] DEFAULT ARRAY['English']
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own data (for registration)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Public can read doctor profiles
CREATE POLICY "Public can read doctor profiles"
  ON users
  FOR SELECT
  TO anon, authenticated
  USING (role = 'doctor');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_specialty ON users(specialty);
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_users_accepting_patients ON users(accepting_new_patients);
CREATE INDEX IF NOT EXISTS idx_users_rating ON users(rating);