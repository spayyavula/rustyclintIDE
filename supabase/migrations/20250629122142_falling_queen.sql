/*
  # Create Optimized Query Functions

  1. New Functions
    - Add optimized query functions for common operations
    - Create efficient data access patterns
    - Implement pagination for large result sets
  
  2. Performance Improvements
    - Use efficient SQL patterns
    - Implement result limiting and pagination
    - Optimize join operations
*/

-- Create function to get user's active subscription with product details
CREATE OR REPLACE FUNCTION get_user_active_subscription(p_user_id uuid)
RETURNS TABLE (
  subscription_id text,
  subscription_status text,
  price_id text,
  current_period_start bigint,
  current_period_end bigint,
  cancel_at_period_end boolean,
  payment_method_brand text,
  payment_method_last4 text,
  product_name text,
  product_description text,
  product_price numeric,
  product_mode text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.subscription_id,
    s.status::text as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4,
    p.name as product_name,
    p.description as product_description,
    p.price as product_price,
    p.mode as product_mode
  FROM 
    stripe_customers c
  JOIN 
    stripe_subscriptions s ON c.customer_id = s.customer_id
  LEFT JOIN 
    stripe_products p ON s.price_id = p.price_id
  WHERE 
    c.user_id = p_user_id
    AND c.deleted_at IS NULL
    AND s.deleted_at IS NULL
    AND s.status = 'active'
  LIMIT 1;
    
  -- If no rows returned, return NULL values
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      NULL::text as subscription_id,
      'not_started'::text as subscription_status,
      NULL::text as price_id,
      NULL::bigint as current_period_start,
      NULL::bigint as current_period_end,
      false as cancel_at_period_end,
      NULL::text as payment_method_brand,
      NULL::text as payment_method_last4,
      'Free Plan'::text as product_name,
      'Free tier access'::text as product_description,
      0::numeric as product_price,
      'subscription'::text as product_mode;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user's order history with pagination
CREATE OR REPLACE FUNCTION get_user_orders(
  p_user_id uuid,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  order_id bigint,
  checkout_session_id text,
  payment_intent_id text,
  amount_total bigint,
  currency text,
  payment_status text,
  order_status text,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status::text as order_status,
    o.created_at
  FROM 
    stripe_customers c
  JOIN 
    stripe_orders o ON c.customer_id = o.customer_id
  WHERE 
    c.user_id = p_user_id
    AND c.deleted_at IS NULL
    AND o.deleted_at IS NULL
  ORDER BY
    o.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Create function to get deployment details with events
CREATE OR REPLACE FUNCTION get_deployment_with_events(
  p_deployment_id bigint,
  p_events_limit integer DEFAULT 20
)
RETURNS TABLE (
  deployment_id bigint,
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
  events jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id as deployment_id,
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
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', e.id,
            'event_type', e.event_type,
            'message', e.message,
            'percentage', e.percentage,
            'timestamp', e."timestamp",
            'metadata', e.metadata
          )
          ORDER BY e."timestamp" DESC
        )
        FROM (
          SELECT * FROM deployment_progress_events 
          WHERE deployment_id = d.id 
          ORDER BY "timestamp" DESC 
          LIMIT p_events_limit
        ) e
      ),
      '[]'::jsonb
    ) as events
  FROM 
    android_deployments d
  WHERE 
    d.id = p_deployment_id
    AND d.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user's deployment statistics
CREATE OR REPLACE FUNCTION get_user_deployment_stats(p_user_id uuid)
RETURNS TABLE (
  total_deployments bigint,
  successful_deployments bigint,
  failed_deployments bigint,
  in_progress_deployments bigint,
  average_build_time interval,
  latest_deployment_id bigint,
  latest_deployment_status text,
  latest_deployment_time timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(d.id) as total_deployments,
    COUNT(d.id) FILTER (WHERE d.status = 'completed') as successful_deployments,
    COUNT(d.id) FILTER (WHERE d.status = 'failed') as failed_deployments,
    COUNT(d.id) FILTER (WHERE d.status IN ('pending', 'building', 'signing', 'uploading')) as in_progress_deployments,
    AVG(d.completed_at - d.started_at) FILTER (WHERE d.status = 'completed' AND d.completed_at IS NOT NULL) as average_build_time,
    (SELECT id FROM android_deployments WHERE user_id = p_user_id AND deleted_at IS NULL ORDER BY started_at DESC LIMIT 1) as latest_deployment_id,
    (SELECT status FROM android_deployments WHERE user_id = p_user_id AND deleted_at IS NULL ORDER BY started_at DESC LIMIT 1) as latest_deployment_status,
    (SELECT started_at FROM android_deployments WHERE user_id = p_user_id AND deleted_at IS NULL ORDER BY started_at DESC LIMIT 1) as latest_deployment_time
  FROM
    android_deployments d
  WHERE
    d.user_id = p_user_id
    AND d.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to search deployments by text
CREATE OR REPLACE FUNCTION search_deployments(
  p_user_id uuid,
  p_search_text text,
  p_limit integer DEFAULT 10,
  p_offset integer DEFAULT 0
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
  started_at timestamp with time zone,
  relevance float
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.version_name,
    d.version_code,
    d.build_type,
    d.output_type,
    d.status,
    d.track,
    d.visual_progress,
    d.progress_message,
    d.started_at,
    ts_rank(
      to_tsvector('english', 
        COALESCE(d.version_name, '') || ' ' || 
        COALESCE(d.build_type, '') || ' ' || 
        COALESCE(d.output_type, '') || ' ' || 
        COALESCE(d.status, '') || ' ' || 
        COALESCE(d.track, '') || ' ' || 
        COALESCE(d.progress_message, '') || ' ' || 
        COALESCE(d.build_logs, '') || ' ' || 
        COALESCE(d.error_message, '')
      ),
      to_tsquery('english', p_search_text)
    ) as relevance
  FROM 
    android_deployments d
  WHERE 
    d.user_id = p_user_id
    AND d.deleted_at IS NULL
    AND to_tsvector('english', 
      COALESCE(d.version_name, '') || ' ' || 
      COALESCE(d.build_type, '') || ' ' || 
      COALESCE(d.output_type, '') || ' ' || 
      COALESCE(d.status, '') || ' ' || 
      COALESCE(d.track, '') || ' ' || 
      COALESCE(d.progress_message, '') || ' ' || 
      COALESCE(d.build_logs, '') || ' ' || 
      COALESCE(d.error_message, '')
    ) @@ to_tsquery('english', p_search_text)
  ORDER BY
    relevance DESC,
    d.started_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Create function to get available products with filtering and pagination
CREATE OR REPLACE FUNCTION get_available_products(
  p_mode text DEFAULT NULL,
  p_min_price numeric DEFAULT 0,
  p_max_price numeric DEFAULT NULL,
  p_featured boolean DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  price_id text,
  name text,
  description text,
  mode text,
  price numeric,
  currency text,
  interval text,
  interval_count integer,
  is_featured boolean,
  sort_order integer,
  metadata jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.price_id,
    p.name,
    p.description,
    p.mode,
    p.price,
    p.currency,
    p.interval,
    p.interval_count,
    p.is_featured,
    p.sort_order,
    p.metadata
  FROM 
    stripe_products p
  WHERE 
    p.is_active = true
    AND p.deleted_at IS NULL
    AND (p_mode IS NULL OR p.mode = p_mode)
    AND p.price >= p_min_price
    AND (p_max_price IS NULL OR p.price <= p_max_price)
    AND (p_featured IS NULL OR p.is_featured = p_featured)
  ORDER BY
    p.is_featured DESC,
    p.sort_order,
    p.price
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user's build configurations
CREATE OR REPLACE FUNCTION get_user_build_configurations(
  p_user_id uuid,
  p_include_deleted boolean DEFAULT false
)
RETURNS TABLE (
  id bigint,
  build_type text,
  output_type text,
  min_sdk_version integer,
  target_sdk_version integer,
  enable_minify boolean,
  enable_r8 boolean,
  enable_proguard boolean,
  keystore_path text,
  keystore_alias text,
  track text,
  is_default boolean,
  metadata jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.build_type,
    c.output_type,
    c.min_sdk_version,
    c.target_sdk_version,
    c.enable_minify,
    c.enable_r8,
    c.enable_proguard,
    c.keystore_path,
    c.keystore_alias,
    c.track,
    c.is_default,
    c.metadata,
    c.created_at,
    c.updated_at,
    c.deleted_at
  FROM 
    android_build_configurations c
  WHERE 
    c.user_id = p_user_id
    AND (p_include_deleted OR c.deleted_at IS NULL)
  ORDER BY
    c.is_default DESC,
    c.created_at DESC;
END;
$$ LANGUAGE plpgsql;