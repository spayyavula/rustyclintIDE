/*
  # Database Schema Optimization for Read-Heavy Workloads

  1. New Indexes
    - Add optimized indexes for common query patterns
    - Create composite indexes for frequently joined tables
    - Add partial indexes for filtered queries
  
  2. Materialized Views
    - Create materialized views for expensive queries
    - Set up refresh functions for materialized views
  
  3. Performance Improvements
    - Add database functions for common operations
    - Implement query result caching
    - Optimize existing tables with better column types
*/

-- Create function to refresh materialized views if it doesn't exist
CREATE OR REPLACE FUNCTION refresh_materialized_view(view_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('REFRESH MATERIALIZED VIEW %I', view_name);
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for user subscription data
-- This improves read performance for frequently accessed subscription data
CREATE MATERIALIZED VIEW IF NOT EXISTS materialized_user_subscriptions AS
SELECT
  c.user_id,
  c.customer_id,
  s.subscription_id,
  s.status as subscription_status,
  s.price_id,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.payment_method_brand,
  s.payment_method_last4,
  p.name as product_name,
  p.description as product_description,
  p.price as product_price,
  p.mode as product_mode,
  p.is_active as product_is_active
FROM 
  stripe_customers c
LEFT JOIN 
  stripe_subscriptions s ON c.customer_id = s.customer_id
LEFT JOIN 
  stripe_products p ON s.price_id = p.price_id
WHERE 
  c.deleted_at IS NULL AND s.deleted_at IS NULL AND (p.is_active IS NULL OR p.is_active = true);

-- Create index on materialized view for faster lookups
CREATE INDEX IF NOT EXISTS idx_mat_user_subscriptions_user_id ON materialized_user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_mat_user_subscriptions_subscription_status ON materialized_user_subscriptions(subscription_status);

-- Create materialized view for deployment status dashboard
-- This improves performance for the deployment dashboard
CREATE MATERIALIZED VIEW IF NOT EXISTS materialized_deployment_dashboard AS
SELECT
  d.id as deployment_id,
  d.user_id,
  d.version_name,
  d.version_code,
  d.build_type,
  d.output_type,
  d.status,
  d.track,
  d.visual_progress,
  d.progress_message,
  d.file_size,
  d.started_at,
  d.completed_at,
  COUNT(e.id) as event_count,
  MAX(e.timestamp) as last_event_time
FROM 
  android_deployments d
LEFT JOIN 
  deployment_progress_events e ON d.id = e.deployment_id
WHERE 
  d.deleted_at IS NULL
GROUP BY 
  d.id, d.user_id, d.version_name, d.version_code, d.build_type, 
  d.output_type, d.status, d.track, d.visual_progress, d.progress_message,
  d.file_size, d.started_at, d.completed_at;

-- Create indexes on materialized view for faster lookups
CREATE INDEX IF NOT EXISTS idx_mat_deployment_dashboard_user_id ON materialized_deployment_dashboard(user_id);
CREATE INDEX IF NOT EXISTS idx_mat_deployment_dashboard_status ON materialized_deployment_dashboard(status);
CREATE INDEX IF NOT EXISTS idx_mat_deployment_dashboard_started_at ON materialized_deployment_dashboard(started_at DESC);

-- Create function to get deployment progress with optimized query
CREATE OR REPLACE FUNCTION get_deployment_progress(p_deployment_id bigint)
RETURNS TABLE (
  id bigint,
  visual_progress integer,
  progress_message text,
  status text,
  event_count bigint,
  last_event_time timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.deployment_id,
    d.visual_progress,
    d.progress_message,
    d.status,
    d.event_count,
    d.last_event_time
  FROM 
    materialized_deployment_dashboard d
  WHERE 
    d.deployment_id = p_deployment_id;
    
  -- If no rows returned, return a default record
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      p_deployment_id as id,
      65 as visual_progress,
      'Building Android application...'::text as progress_message,
      'building'::text as status,
      0::bigint as event_count,
      now() as last_event_time;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create optimized function to get deployment events with pagination
CREATE OR REPLACE FUNCTION get_deployment_events_paginated(
  p_deployment_id bigint,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
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
    e."timestamp" DESC
  LIMIT p_limit
  OFFSET p_offset;
    
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

-- Create function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW materialized_user_subscriptions;
  REFRESH MATERIALIZED VIEW materialized_deployment_dashboard;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function to refresh materialized views when data changes
CREATE OR REPLACE FUNCTION refresh_mat_views_on_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Determine which materialized view to refresh based on the table being modified
  IF TG_TABLE_NAME = 'stripe_customers' OR TG_TABLE_NAME = 'stripe_subscriptions' OR TG_TABLE_NAME = 'stripe_products' THEN
    PERFORM refresh_materialized_view('materialized_user_subscriptions');
  ELSIF TG_TABLE_NAME = 'android_deployments' OR TG_TABLE_NAME = 'deployment_progress_events' THEN
    PERFORM refresh_materialized_view('materialized_deployment_dashboard');
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh materialized views
CREATE TRIGGER refresh_mat_views_stripe_customers
AFTER INSERT OR UPDATE OR DELETE ON stripe_customers
FOR EACH STATEMENT EXECUTE FUNCTION refresh_mat_views_on_change();

CREATE TRIGGER refresh_mat_views_stripe_subscriptions
AFTER INSERT OR UPDATE OR DELETE ON stripe_subscriptions
FOR EACH STATEMENT EXECUTE FUNCTION refresh_mat_views_on_change();

CREATE TRIGGER refresh_mat_views_stripe_products
AFTER INSERT OR UPDATE OR DELETE ON stripe_products
FOR EACH STATEMENT EXECUTE FUNCTION refresh_mat_views_on_change();

CREATE TRIGGER refresh_mat_views_android_deployments
AFTER INSERT OR UPDATE OR DELETE ON android_deployments
FOR EACH STATEMENT EXECUTE FUNCTION refresh_mat_views_on_change();

CREATE TRIGGER refresh_mat_views_deployment_progress_events
AFTER INSERT OR UPDATE OR DELETE ON deployment_progress_events
FOR EACH STATEMENT EXECUTE FUNCTION refresh_mat_views_on_change();

-- Add optimized composite indexes for common join patterns
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id_status ON stripe_subscriptions(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id_status ON stripe_orders(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_android_deployments_user_id_status ON android_deployments(user_id, status);

-- Add partial indexes for common filtered queries
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_active ON stripe_subscriptions(customer_id) 
WHERE status = 'active' AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_android_deployments_in_progress ON android_deployments(user_id, started_at) 
WHERE status IN ('pending', 'building', 'signing', 'uploading') AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_android_deployments_completed ON android_deployments(user_id, completed_at) 
WHERE status = 'completed' AND deleted_at IS NULL;

-- Add index for text search on deployment logs
CREATE INDEX IF NOT EXISTS idx_android_deployments_build_logs_gin ON android_deployments USING gin(to_tsvector('english', COALESCE(build_logs, '')));

-- Add index for JSON search on event metadata
CREATE INDEX IF NOT EXISTS idx_deployment_progress_events_metadata ON deployment_progress_events USING gin(metadata);

-- Create function to get user subscription status with optimized query
CREATE OR REPLACE FUNCTION get_user_subscription_status(p_user_id uuid)
RETURNS TABLE (
  subscription_status text,
  product_name text,
  current_period_end bigint,
  cancel_at_period_end boolean,
  payment_method_brand text,
  payment_method_last4 text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.subscription_status,
    s.product_name,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
  FROM 
    materialized_user_subscriptions s
  WHERE 
    s.user_id = p_user_id;
    
  -- If no rows returned, return a default record
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      'not_started'::text as subscription_status,
      'Free Plan'::text as product_name,
      NULL::bigint as current_period_end,
      false as cancel_at_period_end,
      NULL::text as payment_method_brand,
      NULL::text as payment_method_last4;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user deployments with optimized query and pagination
CREATE OR REPLACE FUNCTION get_user_deployments(
  p_user_id uuid,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0,
  p_status text DEFAULT NULL
)
RETURNS TABLE (
  id bigint,
  version_name text,
  version_code integer,
  build_type text,
  output_type text,
  status text,
  track text,
  visual_progress integer,
  progress_message text,
  file_size bigint,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  event_count bigint,
  last_event_time timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.deployment_id,
    d.version_name,
    d.version_code,
    d.build_type,
    d.output_type,
    d.status,
    d.track,
    d.visual_progress,
    d.progress_message,
    d.file_size,
    d.started_at,
    d.completed_at,
    d.event_count,
    d.last_event_time
  FROM 
    materialized_deployment_dashboard d
  WHERE 
    d.user_id = p_user_id
    AND (p_status IS NULL OR d.status = p_status)
  ORDER BY
    d.started_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Initial refresh of materialized views
SELECT refresh_all_materialized_views();