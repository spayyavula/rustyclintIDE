/*
  # Android Build Configurations Table

  1. New Tables
    - `android_build_configurations` - Stores build configuration settings for Android deployments
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `build_type` (text, 'debug' or 'release')
      - `output_type` (text, 'apk' or 'aab')
      - Various build settings and preferences
  
  2. Security
    - Enable RLS on `android_build_configurations` table
    - Add policies for authenticated users to manage their own configurations
    - Add policy for service role to manage all configurations
  
  3. Indexes
    - Create indexes for faster lookups by user_id and default configurations
*/

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

-- Check if policies already exist before creating them
DO $$
BEGIN
  -- Create policy for users to view their own configurations
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'android_build_configurations' 
    AND policyname = 'Users can view their own build configurations'
  ) THEN
    CREATE POLICY "Users can view their own build configurations"
      ON android_build_configurations
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid() AND deleted_at IS NULL);
  END IF;

  -- Create policy for users to insert their own configurations
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'android_build_configurations' 
    AND policyname = 'Users can insert their own build configurations'
  ) THEN
    CREATE POLICY "Users can insert their own build configurations"
      ON android_build_configurations
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- Create policy for users to update their own configurations
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'android_build_configurations' 
    AND policyname = 'Users can update their own build configurations'
  ) THEN
    CREATE POLICY "Users can update their own build configurations"
      ON android_build_configurations
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid() AND deleted_at IS NULL)
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- Create policy for service role to manage all configurations
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'android_build_configurations' 
    AND policyname = 'Service role can manage build configurations'
  ) THEN
    CREATE POLICY "Service role can manage build configurations"
      ON android_build_configurations
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- Create trigger to update updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_android_build_configurations_updated_at'
  ) THEN
    CREATE TRIGGER update_android_build_configurations_updated_at
    BEFORE UPDATE ON android_build_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_android_build_configurations_user_id'
  ) THEN
    CREATE INDEX idx_android_build_configurations_user_id ON android_build_configurations(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_android_build_configurations_default'
  ) THEN
    CREATE INDEX idx_android_build_configurations_default ON android_build_configurations(is_default) WHERE is_default = true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_android_build_configurations_active'
  ) THEN
    CREATE INDEX idx_android_build_configurations_active ON android_build_configurations(user_id, is_default) WHERE deleted_at IS NULL;
  END IF;
END
$$;

-- Note: Removed the default configuration insert that was causing the foreign key constraint error
-- Users will create their own configurations when they use the system