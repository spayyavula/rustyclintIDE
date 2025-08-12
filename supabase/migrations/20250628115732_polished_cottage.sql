/*
  # Android Build Configuration Schema

  1. New Table
    - `android_build_configurations`: Stores build configuration settings
      - Links to `auth.users` via `user_id`
      - Tracks build preferences like minify, target SDK, etc.
      - Stores keystore information references
      - Implements soft delete

  2. Security
    - Enables Row Level Security (RLS)
    - Implements policies for authenticated users to manage their own configurations
    - Service role can manage all configurations
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
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at column
CREATE TRIGGER update_android_build_configurations_updated_at
BEFORE UPDATE ON android_build_configurations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_android_build_configurations_user_id ON android_build_configurations(user_id);
CREATE INDEX idx_android_build_configurations_default ON android_build_configurations(is_default) WHERE is_default = true;

-- Insert default configuration
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
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'release',
  'aab',
  21,
  34,
  true,
  true,
  true,
  'internal',
  true
);