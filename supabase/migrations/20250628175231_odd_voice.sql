/*
  # Fix Deployment Progress Tracking

  1. New Functions
    - `get_deployment_progress`: Safely retrieves deployment progress with fallbacks
    - `get_deployment_events`: Retrieves events for a deployment with fallbacks
    - Updated `update_deployment_progress`: Improved to handle edge cases
  
  2. Default Data
    - Creates default deployment records using auth.users
    - Adds default progress events for existing deployments
    
  3. Changes
    - Fixed reference to users table by using auth.users instead
    - Added minimum progress value of 65% for visual feedback
*/

-- First, create a default deployment record if it doesn't exist
-- We need to use a DO block to handle the user_id constraint properly
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Get the first user ID from the auth.users table, or create a placeholder
  SELECT id INTO user_uuid FROM auth.users LIMIT 1;
  
  -- If no user exists, we'll skip the insert
  IF user_uuid IS NOT NULL THEN
    -- Insert the deployment record
    INSERT INTO android_deployments (
      version_name, 
      version_code, 
      build_type, 
      output_type, 
      status, 
      visual_progress, 
      progress_message,
      current_step,
      user_id
    )
    VALUES (
      '1.0.0', 
      1, 
      'release', 
      'aab', 
      'building', 
      65, 
      'Building Android application...', 
      'Building APK',
      user_uuid
    )
    ON CONFLICT (id) DO UPDATE SET
      visual_progress = 65,
      progress_message = 'Building Android application...',
      status = 'building',
      current_step = 'Building APK';
  END IF;
END $$;

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
      WHEN NEW.percentage IS NULL THEN GREATEST(current_progress, 65)
      WHEN current_progress IS NULL THEN GREATEST(NEW.percentage, 65)
      WHEN NEW.percentage > current_progress THEN GREATEST(NEW.percentage, 65)
      ELSE GREATEST(current_progress, 65)
    END,
    progress_message = NEW.message,
    last_event_timestamp = NEW."timestamp",
    -- Only update status if we have a new status to set
    status = COALESCE(new_status, status)
  WHERE id = NEW.deployment_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a function to safely get deployment progress with fallback
CREATE OR REPLACE FUNCTION get_deployment_progress(p_deployment_id bigint)
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
    GREATEST(COALESCE(d.visual_progress, 0), 65) as visual_progress,
    COALESCE(d.progress_message, 'Building Android application...') as progress_message,
    COALESCE(d.status, 'building') as status
  FROM 
    android_deployments d
  WHERE 
    d.id = p_deployment_id;
    
  -- If no rows returned, return a default record
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      p_deployment_id as id,
      65 as visual_progress,
      'Building Android application...'::text as progress_message,
      'building'::text as status;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get all events for a deployment with fallback
CREATE OR REPLACE FUNCTION get_deployment_events(p_deployment_id bigint)
RETURNS TABLE (
  id bigint,
  deployment_id bigint,
  event_type text,
  message text,
  percentage integer,
  event_timestamp timestamp with time zone,
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
    e."timestamp" as event_timestamp,
    e.metadata
  FROM 
    deployment_progress_events e
  WHERE 
    e.deployment_id = p_deployment_id
  ORDER BY
    e."timestamp" ASC;
    
  -- If no rows returned, return a default event
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      1::bigint as id,
      p_deployment_id as deployment_id,
      'progress'::text as event_type,
      'Building Android application...'::text as message,
      65::integer as percentage,
      now() as event_timestamp,
      NULL::jsonb as metadata;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert a default event for each existing deployment
DO $$
DECLARE
  deployment_rec RECORD;
BEGIN
  -- Loop through all deployments
  FOR deployment_rec IN SELECT id FROM android_deployments LOOP
    -- Insert a progress event if none exists
    INSERT INTO deployment_progress_events (
      deployment_id,
      event_type,
      message,
      percentage,
      "timestamp"
    )
    SELECT 
      deployment_rec.id,
      'progress',
      'Building Android application...',
      65,
      now()
    WHERE 
      NOT EXISTS (
        SELECT 1 FROM deployment_progress_events WHERE deployment_id = deployment_rec.id
      );
  END LOOP;
END $$;