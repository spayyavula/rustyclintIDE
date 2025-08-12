/*
  # Add Database Indexes for Read Performance

  1. New Indexes
    - Add optimized indexes for frequently queried columns
    - Create composite indexes for common query patterns
    - Add partial indexes for filtered queries
  
  2. Performance Improvements
    - Optimize existing indexes
    - Add covering indexes for common queries
    - Implement better indexing strategies for text columns
*/

-- Add indexes for stripe_customers table
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id_created_at ON stripe_customers(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_active ON stripe_customers(user_id) WHERE deleted_at IS NULL;

-- Add indexes for stripe_subscriptions table
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_price_id ON stripe_subscriptions(price_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_period_end ON stripe_subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_status_customer ON stripe_subscriptions(status, customer_id);

-- Add indexes for stripe_orders table
CREATE INDEX IF NOT EXISTS idx_stripe_orders_payment_status ON stripe_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_created_at ON stripe_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_created ON stripe_orders(customer_id, created_at DESC);

-- Add indexes for stripe_products table
CREATE INDEX IF NOT EXISTS idx_stripe_products_active_price ON stripe_products(is_active, price) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_stripe_products_mode_price ON stripe_products(mode, price);
CREATE INDEX IF NOT EXISTS idx_stripe_products_featured ON stripe_products(is_featured) WHERE is_featured = true;

-- Add indexes for android_deployments table
CREATE INDEX IF NOT EXISTS idx_android_deployments_version_code_name ON android_deployments(version_code, version_name);
CREATE INDEX IF NOT EXISTS idx_android_deployments_status_started ON android_deployments(status, started_at);
CREATE INDEX IF NOT EXISTS idx_android_deployments_user_started ON android_deployments(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_android_deployments_track ON android_deployments(track) WHERE track IS NOT NULL;

-- Add indexes for deployment_progress_events table
CREATE INDEX IF NOT EXISTS idx_deployment_progress_events_type ON deployment_progress_events(event_type);
CREATE INDEX IF NOT EXISTS idx_deployment_progress_events_deployment_type ON deployment_progress_events(deployment_id, event_type);
CREATE INDEX IF NOT EXISTS idx_deployment_progress_events_timestamp_desc ON deployment_progress_events("timestamp" DESC);

-- Add indexes for deployment_progress table
CREATE INDEX IF NOT EXISTS idx_deployment_progress_step ON deployment_progress(step);
CREATE INDEX IF NOT EXISTS idx_deployment_progress_deployment_step ON deployment_progress(deployment_id, step);

-- Add indexes for android_build_configurations table
CREATE INDEX IF NOT EXISTS idx_android_build_configurations_build_output ON android_build_configurations(build_type, output_type);
CREATE INDEX IF NOT EXISTS idx_android_build_configurations_track ON android_build_configurations(track) WHERE track IS NOT NULL;

-- Add text search capabilities for build logs
CREATE INDEX IF NOT EXISTS idx_android_deployments_error_message_gin ON android_deployments USING gin(to_tsvector('english', COALESCE(error_message, '')));

-- Add index for JSON metadata search
CREATE INDEX IF NOT EXISTS idx_android_build_configurations_metadata ON android_build_configurations USING gin(metadata jsonb_path_ops);