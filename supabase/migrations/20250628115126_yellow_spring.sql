/*
  # Add Android Deployment Tracking

  1. New Tables
    - `android_deployments`: Tracks Android app deployment status
      - Records deployment details like version, build type, status
      - Stores build logs and error messages
      - Tracks deployment timestamps
      - Implements soft delete pattern

  2. Security
    - Enables Row Level Security (RLS) on the table
    - Implements policies for authenticated users to view their own deployments
    - Service role can manage all deployments
*/

-- Create table for tracking Android deployments
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
  deleted_at timestamp with time zone default null
);

-- Enable Row Level Security
ALTER TABLE android_deployments ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own deployments
CREATE POLICY "Users can view their own deployments"
  ON android_deployments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

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

-- Create policy for service role to manage all deployments
CREATE POLICY "Service role can manage deployments"
  ON android_deployments
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at column
CREATE TRIGGER update_android_deployments_updated_at
BEFORE UPDATE ON android_deployments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_android_deployments_user_id ON android_deployments(user_id);
CREATE INDEX idx_android_deployments_status ON android_deployments(status);
CREATE INDEX idx_android_deployments_version_code ON android_deployments(version_code);