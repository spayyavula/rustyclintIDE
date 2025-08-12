/*
  # Android Build Configurations Schema

  1. New Tables
    - `android_build_configurations`: Stores build configuration settings for Android apps
      - Includes build type (debug/release), output type (apk/aab)
      - Tracks SDK versions, optimization settings
      - Stores keystore information
      - Supports multiple configurations per user with default flag
      - Implements soft delete pattern

  2. Security
    - Enables Row Level Security (RLS) on the table
    - Implements policies for authenticated users to manage their own configurations
    - Provides service role access for administrative functions
    - Creates appropriate indexes for performance optimization

  3. Utilities
    - Creates update_updated_at_column() function if it doesn't exist
    - Sets up trigger for automatic timestamp updates
    - Adds indexes for common query patterns
*/

-- Create function to update updated_at column if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create android_build_configurations table
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
CREATE INDEX IF NOT EXISTS idx_android_build_configurations_user_id 
ON android_build_configurations(user_id);

CREATE INDEX IF NOT EXISTS idx_android_build_configurations_default 
ON android_build_configurations(is_default) 
WHERE is_default = true;

-- Create index for active configurations (not deleted)
CREATE INDEX IF NOT EXISTS idx_android_build_configurations_active 
ON android_build_configurations(user_id, is_default) 
WHERE deleted_at IS NULL;