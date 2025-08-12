/*
  # Android Deployments Table

  1. New Tables
    - `android_deployments`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `version_name` (text)
      - `version_code` (integer)
      - `build_type` (text, check constraint)
      - `output_type` (text, check constraint)
      - `status` (text, check constraint)
      - `track` (text, check constraint)
      - `build_logs` (text)
      - `error_message` (text)
      - `file_path` (text)
      - `file_size` (bigint)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz)
  
  2. Security
    - Enable RLS on `android_deployments` table
    - Add policies for authenticated users to manage their own deployments
    - Add policy for service role to manage all deployments
  
  3. Indexes
    - Add indexes for user_id, status, and version_code
*/

-- Create android_deployments table if it doesn't exist
CREATE TABLE IF NOT EXISTS android_deployments (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null,
  version_name text not null,
  version_code integer not null,
  build_type text not null check (build_type in ('debug', 'release')),
  output_type text not null check (output_type in ('apk', 'aab')),
  status text not null check (status in ('pending', 'building', 'signing', 'uploading', 'completed', 'failed')),
  track text check (track in ('internal', 'alpha', 'beta', 'production')),
  build_logs text,
  error_message text,
  file_path text,
  file_size bigint,
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Enable Row Level Security
ALTER TABLE android_deployments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'android_deployments' AND policyname = 'Service role can manage deployments'
  ) THEN
    DROP POLICY "Service role can manage deployments" ON android_deployments;
  END IF;
END $$;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'android_deployments' AND policyname = 'Users can insert their own deployments'
  ) THEN
    DROP POLICY "Users can insert their own deployments" ON android_deployments;
  END IF;
END $$;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'android_deployments' AND policyname = 'Users can update their own deployments'
  ) THEN
    DROP POLICY "Users can update their own deployments" ON android_deployments;
  END IF;
END $$;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'android_deployments' AND policyname = 'Users can view their own deployments'
  ) THEN
    DROP POLICY "Users can view their own deployments" ON android_deployments;
  END IF;
END $$;

-- Create policy for service role to manage deployments
CREATE POLICY "Service role can manage deployments"
  ON android_deployments
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policy for users to insert their own deployments
CREATE POLICY "Users can insert their own deployments"
  ON android_deployments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create policy for users to update their own deployments
CREATE POLICY "Users can update their own deployments"
  ON android_deployments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

-- Create policy for users to view their own deployments
CREATE POLICY "Users can view their own deployments"
  ON android_deployments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Drop existing trigger if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_android_deployments_updated_at'
  ) THEN
    DROP TRIGGER update_android_deployments_updated_at ON android_deployments;
  END IF;
END $$;

-- Create trigger to update updated_at column
CREATE TRIGGER update_android_deployments_updated_at
BEFORE UPDATE ON android_deployments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Drop existing indexes if they exist
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_android_deployments_user_id'
  ) THEN
    DROP INDEX idx_android_deployments_user_id;
  END IF;
END $$;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_android_deployments_status'
  ) THEN
    DROP INDEX idx_android_deployments_status;
  END IF;
END $$;

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_android_deployments_version_code'
  ) THEN
    DROP INDEX idx_android_deployments_version_code;
  END IF;
END $$;

-- Create indexes for faster lookups
CREATE INDEX idx_android_deployments_user_id ON android_deployments(user_id);
CREATE INDEX idx_android_deployments_status ON android_deployments(status);
CREATE INDEX idx_android_deployments_version_code ON android_deployments(version_code);