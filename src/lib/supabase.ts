import { createClient } from '@supabase/supabase-js';
import { getCachedData, CACHE_EXPIRATION, createCacheKey, setCache, getCache } from '../utils/cacheUtils';

// Database query timeout (in milliseconds)
const QUERY_TIMEOUT = 10000;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Memoize the check to avoid recalculating
const isValidUrl = (url: string) => url && url !== 'https://your-production-project.supabase.co' && url.includes('supabase.co');
const isValidKey = (key: string) => key && key !== 'your_production_supabase_anon_key';

// Check if we have valid Supabase configuration
export const isSupabaseConfigured = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey);

// Use real Supabase if configured, otherwise use placeholder values
const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Create a single instance to avoid multiple client warnings
// Define the type but don't initialize yet to avoid reference errors
let supabaseInstance: any = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    if (!isSupabaseConfigured) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.info('Supabase not configured. Running in demo mode.');
      }
    }
    
    try {
      // Create client with optimized settings
      supabaseInstance = createClient(finalUrl, finalKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'x-application-name': 'rustyclint',
            'x-application-version': import.meta.env.VITE_APP_VERSION || '1.0.0'
          },
          fetch: (url, options) => {
            // Add timeout to all fetch requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);
            
            return fetch(url, {
              ...options,
              signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
          }
        }
      });
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      // Provide a fallback client with minimal functionality
      supabaseInstance = {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: undefined } })
        },
        from: () => ({ select: () => ({ data: null, error: null }) })
      };
    }
  }
  return supabaseInstance;
})();

/**
 * Optimized Supabase query with timeout and retry logic
 */
export async function optimizedQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  retries = 1
): Promise<{ data: T | null; error: any }> {
  try {
    const result = await queryFn();
    
    if (result.error && retries > 0) {
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
      return optimizedQuery(queryFn, retries - 1);
    }
    
    return result;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError' && retries > 0) {
      // Query timed out, retry
      await new Promise(resolve => setTimeout(resolve, 500));
      return optimizedQuery(queryFn, retries - 1);
    }
    
    return { data: null, error };
  }
}

/**
 * Enhanced Supabase query with caching
 * @param queryFn Function that returns a Supabase query
 * @param cacheKey Key to use for caching
 * @param expiration Cache expiration time
 */
export async function cachedQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  cacheKey: string,
  expiration = CACHE_EXPIRATION.MEDIUM,
  retries = 1
): Promise<{ data: T | null; error: any }> {
  try {
    // Use getCachedData to handle caching logic
    const data = await getCachedData<T>(
      cacheKey,
      async () => {
        // Use optimized query with retry logic
        const { data, error } = await optimizedQuery(queryFn, retries);
        if (error) throw error;
        return data as T;
      },
      expiration
    );
    
    return { data, error: null };
  } catch (error) {
    console.error('Cached query error:', error);
    return { data: null, error };
  }
}

/**
 * Create a cache key for Supabase queries
 */
export function createSupabaseQueryKey(table: string, query: string, params?: any): string {
  return createCacheKey('supabase', table, query, params ? JSON.stringify(params) : '');
}

/**
 * Batch multiple Supabase queries into a single request
 * This reduces network overhead for multiple related queries
 */
export async function batchQueries<T>(
  queries: Array<() => Promise<{ data: any; error: any }>>,
  cacheKeys: string[],
  expiration = CACHE_EXPIRATION.MEDIUM
): Promise<T[]> {
  try {
    // Try to get all results from cache first
    const cachedResults = await Promise.all(
      cacheKeys.map(key => getCache<any>(key))
    );
    
    // If all results are in cache, return them
    if (cachedResults.every(result => result !== null)) {
      return cachedResults as T[];
    }
    
    // Otherwise, execute all queries in parallel
    const results = await Promise.all(
      queries.map(query => optimizedQuery(query))
    );
    
    // Cache results and handle errors
    const processedResults = results.map((result, index) => {
      if (result.error) {
        console.error(`Error in batch query ${index}:`, result.error);
        return null;
      }
      
      // Cache the successful result
      setCache(cacheKeys[index], result.data, expiration);
      return result.data;
    });
    
    return processedResults as T[];
  } catch (error) {
    console.error('Batch query error:', error);
    return [];
  }
}

// Remove PWA icon requirements by updating manifest and service worker references
// If you use a manifest.json, ensure it does not reference icon-192.png or icon-512.png
// If you use a service worker, ensure it does not cache or reference those icons
// You may also remove the icons from the public/assets directory if not needed