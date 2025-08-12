/*
  # Create Android Build Configurations Table

  1. New Tables
    - `android_build_configurations`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `build_type` (text, check constraint)
      - `output_type` (text, check constraint)
      - `min_sdk_version` (integer, default 21)
      - `target_sdk_version` (integer, default 34)
      - `enable_minify` (boolean, default true)
      - `enable_r8` (boolean, default true)
      - `enable_proguard` (boolean, default true)
      - `keystore_path` (text, nullable)
      - `keystore_alias` (text, nullable)
      - `track` (text, check constraint, nullable)
      - `is_default` (boolean, default false)
      - `metadata` (jsonb, nullable)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
      - `deleted_at` (timestamp with time zone, nullable)
  2. Security
    - Enable RLS on `android_build_configurations` table
    - Add policies for authenticated users to manage their own configurations
    - Add policy for service role to manage all configurations
  3. Indexes
    - Create index on user_id
    - Create index on is_default
    - Create index on user_id and is_default for active configurations
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

-- Enable Row Level Security
ALTER TABLE android_build_configurations ENABLE ROW LEVEL SECURITY;

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

-- Create trigger to update updated_at column
CREATE TRIGGER update_android_build_configurations_updated_at
BEFORE UPDATE ON android_build_configurations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster lookups
CREATE INDEX idx_android_build_configurations_user_id ON android_build_configurations(user_id);
CREATE INDEX idx_android_build_configurations_default ON android_build_configurations(is_default) WHERE is_default = true;
CREATE INDEX idx_android_build_configurations_active ON android_build_configurations(user_id, is_default) WHERE deleted_at IS NULL;