/**
 * Test-specific Supabase client configuration
 * Uses only anonymous key for client-side testing
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For demo purposes, provide safe fallback values
const defaultUrl = 'https://localhost:54321';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const finalUrl = supabaseUrl && supabaseUrl !== 'https://your-production-project.supabase.co' ? supabaseUrl : defaultUrl;
const finalKey = supabaseAnonKey && supabaseAnonKey !== 'your_production_supabase_anon_key' ? supabaseAnonKey : defaultKey;

// Test client using only anonymous key
export const supabaseTest = createClient(finalUrl, finalKey);

// Mock authenticated user for testing
export const mockAuthenticatedUser = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString()
};

// Helper function to simulate authenticated session
export const simulateAuthenticatedSession = async () => {
  // In a real test environment, you would sign in with test credentials
  // For demo purposes, we'll simulate the session
  return {
    data: {
      session: {
        access_token: 'mock_access_token',
        user: mockAuthenticatedUser
      }
    },
    error: null
  };
};

// Test helper to create mock Stripe customer data
export const createMockStripeData = () => ({
  customerId: `cus_test_${Date.now()}`,
  subscriptionId: `sub_test_${Date.now()}`,
  paymentIntentId: `pi_test_${Date.now()}`,
  checkoutSessionId: `cs_test_${Date.now()}`
});