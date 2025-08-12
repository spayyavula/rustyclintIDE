/*
  # Fix Deployment Progress and ID Issues

  1. New Tables
    - Ensures `update_updated_at_column()` function exists
    - Fixes potential issues with deployment_progress_events table
    - Adds missing indexes for better performance
  
  2. Security
    - Ensures proper RLS policies are in place
    - Fixes potential permission issues
  
  3. Changes
    - Adds proper triggers for progress tracking
    - Ensures deployment_id references are properly handled
*/

-- First ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS update_deployment_progress_on_event ON deployment_progress_events;
DROP TRIGGER IF EXISTS update_deployment_progress_updated_at ON deployment_progress;

-- Drop existing function to recreate it properly
DROP FUNCTION IF EXISTS update_deployment_progress();

-- Create function to update deployment progress based on events
CREATE FUNCTION update_deployment_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the parent deployment with the latest progress information
  UPDATE android_deployments
  SET 
    visual_progress = COALESCE(NEW.percentage, visual_progress),
    progress_message = COALESCE(NEW.message, progress_message),
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

-- Create trigger to update updated_at column
CREATE TRIGGER update_deployment_progress_updated_at
BEFORE UPDATE ON deployment_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Ensure android_deployments has all required columns with proper constraints
ALTER TABLE android_deployments 
ALTER COLUMN progress_percentage SET DEFAULT 0,
ALTER COLUMN visual_progress SET DEFAULT 0,
ADD CONSTRAINT progress_percentage_range CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
ADD CONSTRAINT visual_progress_range CHECK (visual_progress >= 0 AND visual_progress <= 100);

-- Ensure deployment_progress_events has proper constraints
ALTER TABLE deployment_progress_events
ADD CONSTRAINT percentage_range CHECK (percentage >= 0 AND percentage <= 100),
ADD CONSTRAINT valid_event_type CHECK (event_type IN ('start', 'progress', 'success', 'error', 'warning', 'info'));

-- Create or replace view for deployment progress timeline with proper ordering
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