/*
  # Fix Deployment Progress Tracking

  1. New Constraints
    - Add constraints to ensure progress values are valid
    - Fix visual_progress and progress_percentage validation
  
  2. Trigger Updates
    - Improve update_deployment_progress function to handle all event types
    - Ensure progress is properly updated based on event type
  
  3. Validation Rules
    - Add validation rules for percentage values
    - Ensure consistent progress tracking
*/

-- Add constraints to ensure progress values are valid
ALTER TABLE android_deployments 
DROP CONSTRAINT IF EXISTS progress_percentage_range,
DROP CONSTRAINT IF EXISTS visual_progress_range,
ADD CONSTRAINT progress_percentage_range CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
ADD CONSTRAINT visual_progress_range CHECK (visual_progress >= 0 AND visual_progress <= 100);

-- Drop existing trigger and function to recreate with improvements
DROP TRIGGER IF EXISTS update_deployment_progress_on_event ON deployment_progress_events;
DROP FUNCTION IF EXISTS update_deployment_progress() CASCADE;

-- Create improved function to update deployment progress based on events
CREATE OR REPLACE FUNCTION update_deployment_progress()
RETURNS TRIGGER AS $$
DECLARE
  new_status text;
BEGIN
  -- Determine if we need to update the status based on event type
  CASE NEW.event_type
    WHEN 'start' THEN
      new_status := 'building';
    WHEN 'success' THEN
      new_status := 'completed';
    WHEN 'error' THEN
      new_status := 'failed';
    ELSE
      -- For progress, warning, info events, keep current status
      new_status := NULL;
  END CASE;

  -- Update the parent deployment with the latest progress information
  UPDATE android_deployments
  SET 
    visual_progress = COALESCE(NEW.percentage, visual_progress),
    progress_message = NEW.message,
    last_event_timestamp = NEW.timestamp,
    -- Only update status if we have a new status to set
    status = COALESCE(new_status, status)
  WHERE id = NEW.deployment_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update deployment progress
CREATE TRIGGER update_deployment_progress_on_event
AFTER INSERT ON deployment_progress_events
FOR EACH ROW
EXECUTE FUNCTION update_deployment_progress();

-- Add validation rules for percentage values in deployment_progress_events
ALTER TABLE deployment_progress_events
DROP CONSTRAINT IF EXISTS percentage_range,
DROP CONSTRAINT IF EXISTS valid_event_type,
ADD CONSTRAINT percentage_range CHECK (percentage >= 0 AND percentage <= 100),
ADD CONSTRAINT valid_event_type CHECK (event_type IN ('start', 'progress', 'success', 'error', 'warning', 'info'));

-- Create index for faster event queries
CREATE INDEX IF NOT EXISTS idx_deployment_progress_events_type_timestamp 
ON deployment_progress_events(event_type, timestamp);

-- Create function to get latest deployment progress
CREATE OR REPLACE FUNCTION get_latest_deployment_progress(deployment_id bigint)
RETURNS TABLE (
  current_progress integer,
  current_message text,
  current_status text,
  last_event_timestamp timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.visual_progress as current_progress,
    d.progress_message as current_message,
    d.status as current_status,
    d.last_event_timestamp
  FROM 
    android_deployments d
  WHERE 
    d.id = deployment_id;
END;
$$ LANGUAGE plpgsql;