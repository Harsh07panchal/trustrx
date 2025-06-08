/*
  # Create medical records table

  1. New Tables
    - `medical_records`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to users)
      - `file_name` (text)
      - `file_type` (text)
      - `file_size` (bigint)
      - `file_url` (text)
      - `thumbnail_url` (text, nullable)
      - `category` (text)
      - `description` (text)
      - `upload_date` (timestamp)
      - `blockchain_hash` (text, nullable)
      - `blockchain_tx_id` (text, nullable)
      - `is_verified` (boolean)
      - `shared_with` (uuid[], nullable) - array of doctor IDs
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `medical_records` table
    - Add policies for patients to manage their own records
    - Add policies for doctors to read shared records
*/

CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  file_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL CHECK (category IN ('lab_results', 'imaging', 'prescriptions', 'consultations', 'surgeries', 'vaccinations', 'allergies', 'other')),
  description text,
  upload_date timestamptz DEFAULT now(),
  blockchain_hash text,
  blockchain_tx_id text,
  is_verified boolean DEFAULT false,
  shared_with uuid[] DEFAULT ARRAY[]::uuid[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Patients can manage their own records
CREATE POLICY "Patients can manage own records"
  ON medical_records
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.uid() = ANY(shared_with)
  );

-- Create updated_at trigger
CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON medical_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_category ON medical_records(category);
CREATE INDEX IF NOT EXISTS idx_medical_records_upload_date ON medical_records(upload_date);
CREATE INDEX IF NOT EXISTS idx_medical_records_shared_with ON medical_records USING GIN(shared_with);