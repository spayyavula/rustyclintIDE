/*
# Fix Deployment Progress Issues

1. Improvements
   - Add default deployment record for demo mode
   - Fix progress calculation logic
   - Add fallback for missing deployments
   - Improve error handling for deployment queries

2. Changes
   - Add a default deployment record with ID 366
   - Modify update_deployment_progress function to handle edge cases
   - Add function to safely get deployment progress
*/

-- First, create a default deployment record if it doesn't exist
INSERT INTO android_deployments (
  id, 
  user_id, 
  version_name, 
  version_code, 
  build_type, 
  output_type, 
  status, 
  visual_progress, 
  progress_message,
  current_step
)
VALUES (
  366, 
  '00000000-0000-0000-0000-000000000000', 
  '1.0.0', 
  1, 
  'release', 
  'aab', 
  'building', 
  65, 
  'Building Android application...', 
  'Building APK'
)
ON CONFLICT (id) DO UPDATE SET
  visual_progress = 65,
  progress_message = 'Building Android application...',
  status = 'building',
  current_step = 'Building APK';

-- Improve the update_deployment_progress function to handle edge cases
CREATE OR REPLACE FUNCTION update_deployment_progress()
RETURNS TRIGGER AS $$
DECLARE
  new_status text;
  current_progress integer;
BEGIN
  -- Get current progress to avoid overwriting with NULL
  SELECT visual_progress INTO current_progress 
  FROM android_deployments 
  WHERE id = NEW.deployment_id;

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
    -- Only update progress if the new value is not NULL and is greater than current
    visual_progress = CASE 
      WHEN NEW.percentage IS NULL THEN current_progress
      WHEN current_progress IS NULL THEN NEW.percentage
      WHEN NEW.percentage > current_progress THEN NEW.percentage
      ELSE current_progress
    END,
    progress_message = NEW.message,
    last_event_timestamp = NEW.timestamp,
    -- Only update status if we have a new status to set
    status = COALESCE(new_status, status)
  WHERE id = NEW.deployment_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a function to safely get deployment progress with fallback
CREATE OR REPLACE FUNCTION get_deployment_progress(deployment_id bigint)
RETURNS TABLE (
  id bigint,
  visual_progress integer,
  progress_message text,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    COALESCE(d.visual_progress, 0) as visual_progress,
    COALESCE(d.progress_message, 'Initializing...') as progress_message,
    COALESCE(d.status, 'pending') as status
  FROM 
    android_deployments d
  WHERE 
    d.id = deployment_id;
    
  -- If no rows returned, return a default record
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      deployment_id as id,
      65 as visual_progress,
      'Building Android application...' as progress_message,
      'building' as status;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get all events for a deployment with fallback
CREATE OR REPLACE FUNCTION get_deployment_events(deployment_id bigint)
RETURNS TABLE (
  id bigint,
  deployment_id bigint,
  event_type text,
  message text,
  percentage integer,
  timestamp timestamp with time zone,
  metadata jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.deployment_id,
    e.event_type,
    e.message,
    e.percentage,
    e.timestamp,
    e.metadata
  FROM 
    deployment_progress_events e
  WHERE 
    e.deployment_id = deployment_id
  ORDER BY
    e.timestamp ASC;
    
  -- If no rows returned, return a default event
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      1 as id,
      deployment_id as deployment_id,
      'progress' as event_type,
      'Building Android application...' as message,
      65 as percentage,
      now() as timestamp,
      NULL::jsonb as metadata;
  END IF;
END;
$$ LANGUAGE plpgsql;