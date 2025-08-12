/*
  # Add deployment progress tracking

  1. New Tables
    - `deployment_progress_events` - Detailed progress events for deployments
      - `id` (bigint, primary key)
      - `deployment_id` (bigint, references android_deployments)
      - `event_type` (text, enum of event types)
      - `message` (text)
      - `percentage` (integer, 0-100)
      - `timestamp` (timestamptz)
      - `metadata` (jsonb)
  
  2. Changes
    - Add visual progress tracking fields to android_deployments
      - `visual_progress` (integer, 0-100)
      - `progress_message` (text)
      - `last_event_timestamp` (timestamptz)
  
  3. Security
    - Enable RLS on new table
    - Add policies for service role and authenticated users
*/

-- Create deployment_progress_events table
CREATE TABLE IF NOT EXISTS deployment_progress_events (
  id bigint primary key generated always as identity,
  deployment_id bigint references android_deployments(id) not null,
  event_type text not null check (event_type in ('start', 'progress', 'success', 'error', 'warning', 'info')),
  message text not null,
  percentage integer check (percentage >= 0 and percentage <= 100),
  timestamp timestamp with time zone default now(),
  metadata jsonb
);

-- Enable Row Level Security
ALTER TABLE deployment_progress_events ENABLE ROW LEVEL SECURITY;

-- Create policies for deployment_progress_events
CREATE POLICY "Service role can manage progress events"
  ON deployment_progress_events
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view their own progress events"
  ON deployment_progress_events
  FOR SELECT
  TO authenticated
  USING (
    deployment_id IN (
      SELECT id FROM android_deployments 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );

CREATE POLICY "Users can insert their own progress events"
  ON deployment_progress_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    deployment_id IN (
      SELECT id FROM android_deployments 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );

-- Add visual progress tracking fields to android_deployments
ALTER TABLE android_deployments 
ADD COLUMN IF NOT EXISTS visual_progress integer default 0 check (visual_progress >= 0 and visual_progress <= 100),
ADD COLUMN IF NOT EXISTS progress_message text,
ADD COLUMN IF NOT EXISTS last_event_timestamp timestamp with time zone;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_deployment_progress_events_deployment_id 
ON deployment_progress_events(deployment_id);

CREATE INDEX IF NOT EXISTS idx_deployment_progress_events_timestamp 
ON deployment_progress_events(timestamp);

-- Create function to update deployment progress based on events
CREATE OR REPLACE FUNCTION update_deployment_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the parent deployment with the latest progress information
  UPDATE android_deployments
  SET 
    visual_progress = NEW.percentage,
    progress_message = NEW.message,
    last_event_timestamp = NEW.timestamp
  WHERE id = NEW.deployment_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update deployment progress
CREATE TRIGGER update_deployment_progress_on_event
AFTER INSERT ON deployment_progress_events
FOR EACH ROW
EXECUTE FUNCTION update_deployment_progress();

-- Create view for deployment progress timeline
CREATE OR REPLACE VIEW deployment_progress_timeline AS
SELECT 
  d.id as deployment_id,
  d.version_name,
  d.version_code,
  d.status,
  d.visual_progress,
  d.progress_message,
  e.id as event_id,
  e.event_type,
  e.message,
  e.percentage,
  e.timestamp,
  e.metadata
FROM 
  android_deployments d
LEFT JOIN 
  deployment_progress_events e ON d.id = e.deployment_id
ORDER BY 
  d.id DESC, e.timestamp ASC;