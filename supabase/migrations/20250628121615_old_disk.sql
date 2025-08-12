/*
  # Android Build Configurations Schema

  1. New Table
    - `android_build_configurations`: Stores build settings for Android apps
      - Includes user_id reference to auth.users
      - Tracks build preferences like output type, SDK versions
      - Supports multiple configurations per user
      - Implements soft delete pattern

  2. Security
    - Enables Row Level Security (RLS)
    - Policies for authenticated users to manage their own configurations
    - Service role can manage all configurations

  3. Indexing
    - Optimized indexes for user_id lookups
    - Special index for default configurations
    - Active configurations index with deleted_at filter
*/

-- Create function to update updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
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
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'android_build_configurations' AND policyname = 'Users can view their own build configurations') THEN
    DROP POLICY "Users can view their own build configurations" ON android_build_configurations;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'android_build_configurations' AND policyname = 'Users can insert their own build configurations') THEN
    DROP POLICY "Users can insert their own build configurations" ON android_build_configurations;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'android_build_configurations' AND policyname = 'Users can update their own build configurations') THEN
    DROP POLICY "Users can update their own build configurations" ON android_build_configurations;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'android_build_configurations' AND policyname = 'Service role can manage build configurations') THEN
    DROP POLICY "Service role can manage build configurations" ON android_build_configurations;
  END IF;
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
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_android_build_configurations_updated_at') THEN
    DROP TRIGGER update_android_build_configurations_updated_at ON android_build_configurations;
  END IF;
END $$;

-- Create trigger to update updated_at column
CREATE TRIGGER update_android_build_configurations_updated_at
BEFORE UPDATE ON android_build_configurations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Drop existing indexes if they exist to recreate them
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_android_build_configurations_user_id') THEN
    DROP INDEX idx_android_build_configurations_user_id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_android_build_configurations_default') THEN
    DROP INDEX idx_android_build_configurations_default;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_android_build_configurations_active') THEN
    DROP INDEX idx_android_build_configurations_active;
  END IF;
END $$;

-- Create indexes for faster lookups
CREATE INDEX idx_android_build_configurations_user_id ON android_build_configurations(user_id);
CREATE INDEX idx_android_build_configurations_default ON android_build_configurations(is_default) WHERE is_default = true;
CREATE INDEX idx_android_build_configurations_active ON android_build_configurations(user_id, is_default) WHERE deleted_at IS NULL;

-- Insert default configuration if none exists
INSERT INTO android_build_configurations (
  user_id,
  build_type,
  output_type,
  min_sdk_version,
  target_sdk_version,
  enable_minify,
  enable_r8,
  enable_proguard,
  track,
  is_default
)
SELECT 
  auth.uid(),
  'release',
  'aab',
  21,
  34,
  true,
  true,
  true,
  'internal',
  true
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM android_build_configurations 
  WHERE user_id = auth.uid() AND is_default = true
)
AND auth.role() = 'authenticated';