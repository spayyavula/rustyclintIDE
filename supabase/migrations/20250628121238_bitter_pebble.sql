/*
  # Android Build Configurations Schema

  1. New Tables
    - `android_build_configurations`: Stores build configuration settings for Android apps
      - Includes user-specific build preferences
      - Tracks build type, output format, SDK versions
      - Supports keystore configuration
      - Implements soft delete pattern

  2. Security
    - Enables Row Level Security (RLS)
    - Policies for authenticated users to manage their own configurations
    - Service role has full access for administration

  3. Indexing
    - Optimized indexes for user lookups
    - Special index for default configurations
    - Active configurations index for performance
*/

-- Create function to update updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;
END $$;

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

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  BEGIN
    DROP POLICY IF EXISTS "Users can view their own build configurations" ON android_build_configurations;
  EXCEPTION
    WHEN undefined_object THEN
      NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Users can insert their own build configurations" ON android_build_configurations;
  EXCEPTION
    WHEN undefined_object THEN
      NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Users can update their own build configurations" ON android_build_configurations;
  EXCEPTION
    WHEN undefined_object THEN
      NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Service role can manage build configurations" ON android_build_configurations;
  EXCEPTION
    WHEN undefined_object THEN
      NULL;
  END;
END $$;

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
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_android_build_configurations_updated_at ON android_build_configurations;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create trigger to update updated_at column
CREATE TRIGGER update_android_build_configurations_updated_at
BEFORE UPDATE ON android_build_configurations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Drop existing indexes if they exist to avoid conflicts
DO $$
BEGIN
  DROP INDEX IF EXISTS idx_android_build_configurations_user_id;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

DO $$
BEGIN
  DROP INDEX IF EXISTS idx_android_build_configurations_default;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

DO $$
BEGIN
  DROP INDEX IF EXISTS idx_android_build_configurations_active;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create indexes for faster lookups
CREATE INDEX idx_android_build_configurations_user_id ON android_build_configurations(user_id);
CREATE INDEX idx_android_build_configurations_default ON android_build_configurations(is_default) WHERE is_default = true;
CREATE INDEX idx_android_build_configurations_active ON android_build_configurations(user_id, is_default) WHERE deleted_at IS NULL;