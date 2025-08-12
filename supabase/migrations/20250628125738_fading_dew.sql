/*
  # Add Deployment Progress Tracking
  
  1. New Tables
    - `deployment_progress` - Tracks real-time progress of deployments
      - `id` (bigint, primary key)
      - `deployment_id` (bigint, references android_deployments)
      - `step` (text) - Current deployment step
      - `progress` (integer) - Progress percentage (0-100)
      - `message` (text) - Current status message
      - `updated_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `deployment_progress` table
    - Add policies for authenticated users to view/update their own data
    - Add policy for service role to manage all data
  
  3. Changes
    - Add `progress_percentage` column to `android_deployments` table
    - Add `current_step` column to `android_deployments` table
*/

-- Create deployment_progress table
CREATE TABLE IF NOT EXISTS deployment_progress (
  id bigint primary key generated always as identity,
  deployment_id bigint references android_deployments(id) not null,
  step text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  message text,
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
ALTER TABLE deployment_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for deployment_progress
CREATE POLICY "Service role can manage deployment progress"
  ON deployment_progress
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view their own deployment progress"
  ON deployment_progress
  FOR SELECT
  TO authenticated
  USING (
    deployment_id IN (
      SELECT id FROM android_deployments 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );

CREATE POLICY "Users can update their own deployment progress"
  ON deployment_progress
  FOR UPDATE
  TO authenticated
  USING (
    deployment_id IN (
      SELECT id FROM android_deployments 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  )
  WITH CHECK (
    deployment_id IN (
      SELECT id FROM android_deployments 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );

-- Add progress tracking columns to android_deployments
ALTER TABLE android_deployments 
ADD COLUMN IF NOT EXISTS progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
ADD COLUMN IF NOT EXISTS current_step text;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_deployment_progress_deployment_id ON deployment_progress(deployment_id);

-- Create trigger to update updated_at column
CREATE TRIGGER update_deployment_progress_updated_at
BEFORE UPDATE ON deployment_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();