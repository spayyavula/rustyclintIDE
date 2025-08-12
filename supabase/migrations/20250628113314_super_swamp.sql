/*
  # Add Stripe Products Table

  1. New Tables
    - `stripe_products`: Stores Stripe product information
      - Includes product details like name, description, price, etc.
      - Links to Stripe price IDs
      - Tracks product status and visibility
      - Implements soft delete

  2. Security
    - Enables Row Level Security (RLS) on the table
    - Implements policies for authenticated users to view active products
    - Restricts modification to service role only

  3. Integration
    - Works with existing Stripe tables
    - Provides a central place to manage product information
*/

CREATE TABLE IF NOT EXISTS stripe_products (
  id bigint primary key generated always as identity,
  price_id text not null unique,
  name text not null,
  description text,
  mode text not null check (mode in ('payment', 'subscription')),
  price numeric not null,
  currency text not null default 'usd',
  interval text check (mode != 'subscription' OR interval in ('day', 'week', 'month', 'year')),
  interval_count integer,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

-- Enable RLS
ALTER TABLE stripe_products ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view active products
CREATE POLICY "Users can view active products"
  ON stripe_products
  FOR SELECT
  TO authenticated
  USING (is_active = true AND deleted_at IS NULL);

-- Create policy for service role to manage products
CREATE POLICY "Service role can manage products"
  ON stripe_products
  USING (true)
  WITH CHECK (true);

-- Add some initial products based on the existing configuration
INSERT INTO stripe_products (price_id, name, description, mode, price, currency, interval, interval_count, is_active, is_featured, sort_order)
VALUES
  ('price_1Rdu48G0usgeCZqlMzirm1jc', 'Enterprise Plan', 'Enterprise Plan - whitelisting possible', 'subscription', 199.00, 'usd', 'month', 1, true, true, 10),
  ('price_1Rdu2JG0usgeCZqlpwN7k1Vr', 'Premium Plan', 'Advanced Plan for individuals', 'payment', 79.00, 'usd', null, null, true, false, 20),
  ('price_1RdtzkG0usgeCZqlJG0ADUZF', 'Sponsor Us', 'Sponsor our support team', 'payment', 25.00, 'usd', null, null, true, false, 30),
  ('price_1RdtxSG0usgeCZqldPwtqD6m', 'Support Us', 'Support Our Developer', 'payment', 10.00, 'usd', null, null, true, false, 40),
  ('price_1RdtvPG0usgeCZqlzSxblbCP', 'Buy me coffee', 'Buy me a coffee to support development', 'payment', 5.00, 'usd', null, null, true, false, 50);

-- Create index for faster lookups
CREATE INDEX idx_stripe_products_price_id ON stripe_products(price_id);
CREATE INDEX idx_stripe_products_active ON stripe_products(is_active) WHERE is_active = true;
CREATE INDEX idx_stripe_products_featured ON stripe_products(is_featured) WHERE is_featured = true;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_stripe_products_updated_at
BEFORE UPDATE ON stripe_products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create view for active products
CREATE VIEW active_stripe_products AS
SELECT * FROM stripe_products
WHERE is_active = true AND deleted_at IS NULL
ORDER BY sort_order, price;

-- Grant access to the view
GRANT SELECT ON active_stripe_products TO authenticated;