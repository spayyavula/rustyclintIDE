/*
  # Android Build Configurations

  1. New Tables
    - `android_build_configurations`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `build_type` (text, debug/release)
      - `output_type` (text, apk/aab)
      - `min_sdk_version` (integer, default 21)
      - `target_sdk_version` (integer, default 34)
      - `enable_minify` (boolean, default true)
      - `enable_r8` (boolean, default true)
      - `enable_proguard` (boolean, default true)
      - `keystore_path` (text, optional)
      - `keystore_alias` (text, optional)
      - `track` (text, internal/alpha/beta/production)
      - `is_default` (boolean, default false)
      - `metadata` (jsonb, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `deleted_at` (timestamp, soft delete)

  2. Security
    - Enable RLS on `android_build_configurations` table
    - Add policies for authenticated users to manage their own configurations
    - Add policy for service role to manage all configurations

  3. Triggers
    - Add trigger to automatically update `updated_at` column

  4. Indexes
    - Add indexes for user_id, is_default, and active configurations
*/

-- Create function to update updated_at column if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create android_build_configurations table if it doesn't exist
CREATE TABLE IF NOT EXISTS android_build_configurations (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null,
  build_type text not null check (build_type in ('debug', 'release')),
  output_type text not null check (output_type in ('apk', 'aab')),
  min_sdk_version integer not null default 21,
  target_sdk_version integer not null default 34,
  enable_minify boolean not null default true,
  enable_r8 boolean not null default true,
  enable_proguard boolean not null default true,
  keystore_path text,
  keystore_alias text,
  track text check (track in ('internal', 'alpha', 'beta', 'production')),
  is_default boolean not null default false,
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

-- Enable Row Level Security if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'android_build_configurations' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE android_build_configurations ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Users can view their own build configurations" ON android_build_configurations;
DROP POLICY IF EXISTS "Users can insert their own build configurations" ON android_build_configurations;
DROP POLICY IF EXISTS "Users can update their own build configurations" ON android_build_configurations;
DROP POLICY IF EXISTS "Service role can manage build configurations" ON android_build_configurations;

-- Create policy for users to view their own configurations
CREATE POLICY "Users can view their own build configurations"
  ON android_build_configurations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Create policy for users to insert their own configurations
CREATE POLICY "Users can insert their own build configurations"
  ON android_build_configurations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create policy for users to update their own configurations
CREATE POLICY "Users can update their own build configurations"
  ON android_build_configurations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

-- Create policy for service role to manage all configurations
CREATE POLICY "Service role can manage build configurations"
  ON android_build_configurations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_android_build_configurations_updated_at ON android_build_configurations;

-- Create trigger to update updated_at column
CREATE TRIGGER update_android_build_configurations_updated_at
BEFORE UPDATE ON android_build_configurations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Drop existing indexes if they exist to recreate them
DROP INDEX IF EXISTS idx_android_build_configurations_user_id;
DROP INDEX IF EXISTS idx_android_build_configurations_default;
DROP INDEX IF EXISTS idx_android_build_configurations_active;

-- Create indexes for faster lookups
CREATE INDEX idx_android_build_configurations_user_id ON android_build_configurations(user_id);
CREATE INDEX idx_android_build_configurations_default ON android_build_configurations(is_default) WHERE is_default = true;
CREATE INDEX idx_android_build_configurations_active ON android_build_configurations(user_id, is_default) WHERE deleted_at IS NULL;