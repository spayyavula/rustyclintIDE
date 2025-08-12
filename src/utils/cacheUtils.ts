import localforage from 'localforage';

// Configure localforage
localforage.config({
  name: 'rustyclint',
  storeName: 'app-cache-v2',
  description: 'Cache for rustyclint application'
});

// Cache expiration times (in milliseconds)
export const CACHE_EXPIRATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 12 * 60 * 60 * 1000, // 12 hours
  VERY_LONG: 3 * 24 * 60 * 60 * 1000 // 3 days
};

// Cache item with expiration
interface CacheItem<T> {
  data: T;
  expiry: number;
}

/**
 * Set an item in the cache with expiration
 */
export async function setCache<T>(key: string, data: T, expiration = CACHE_EXPIRATION.MEDIUM): Promise<void> {
  if (!key || data === undefined) {
    console.warn('Attempted to cache invalid data or key');
    return;
  }
  
  const item: CacheItem<T> = {
    data,
    expiry: Date.now() + expiration
  };
  
  try {
    await localforage.setItem(key, item);
  } catch (error) {
    await localforage.removeItem(key); // Try to clean up if error occurs
    console.error('Cache set error:', error);
  }
}

/**
 * Get an item from the cache, returns null if expired or not found
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const item = await localforage.getItem<CacheItem<T>>(key);
    
    if (!item) {
      return null;
    }
    
    // Return null if item doesn't exist or is expired
    if (!item || Date.now() > item.expiry) {
      // Remove expired items to free up storage
      if (item && Date.now() > item.expiry) {
        try {
          await localforage.removeItem(key);
        } catch (removeError) {
          console.warn(`Failed to remove expired cache item ${key}:`, removeError);
        }
      }
      return null;
    }
    
    return item.data;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Remove an item from the cache
 */
export async function removeCache(key: string): Promise<void> {
  if (!key) {
    console.warn('Attempted to remove cache with invalid key');
    return;
  }
  
  try {
    await localforage.removeItem(key);
  } catch (error) {
    console.error('Cache remove error:', error);
  }
}

/**
 * Clear all items from the cache
 */
export async function clearCache(): Promise<void> {
  // Log cache size before clearing
  try {
    const keys = await localforage.keys();
    console.log(`Clearing cache with ${keys.length} items`);
  } catch (e) {
    // Ignore logging errors
  }
  try {
    await localforage.clear();
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

/**
 * Get data with caching
 * If data is in cache and not expired, returns cached data
 * Otherwise, fetches data using fetchFn and caches it
 */
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  expiration = CACHE_EXPIRATION.MEDIUM,
  skipCache = false
): Promise<T> {
  // Skip cache if explicitly requested
  if (skipCache) {
    return fetchFn();
  }
  
  if (!key) {
    console.warn('Invalid cache key provided');
    return fetchFn();
  }
  
  try {
    // Try to get from cache first
    const cachedData = await getCache<T>(key);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    // If not in cache or expired, fetch fresh data
    const freshData = await fetchFn();
    
    // Cache the fresh data if it's not null or undefined
    try {
      await setCache(key, freshData, expiration);
    } catch (cacheError) {
      console.warn(`Failed to cache data for ${key}:`, cacheError);
    }
    
    return freshData;
  } catch (error) {
    console.error(`Error in getCachedData for ${key}:`, error);
    // If cache operations fail, fall back to direct fetch with error handling
    return fetchFn();
  }
}

/**
 * Prefetch and cache data (renamed from prefetchCache to prefetchData for compatibility)
 */
export async function prefetchData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  expiration: number = CACHE_EXPIRATION.MEDIUM,
  force: boolean = false
): Promise<void> {
  try {
    // Check if we already have cached data and it's not expired
    if (!force) {
      if (!key) {
        console.warn('Invalid cache key provided for prefetch');
        return;
      }
      
      const cachedItem = await localforage.getItem<CacheItem<T>>(key);
      if (cachedItem && Date.now() < cachedItem.expiry) {
        // Data already cached and not expired, no need to prefetch
        return;
      }
    }
    
    const data = await fetchFn();
    
    if (data !== undefined && data !== null) {
      await setCache(key, data, expiration);
    }
  } catch (error) {
    console.error('Prefetch error:', error);
  }
}

// For backward compatibility
export const prefetchCache = prefetchData;

/**
 * Generate a cache key with namespace
 */
export function createCacheKey(namespace: string, ...parts: (string | number)[]): string {
  return `${namespace}:${parts.join(':')}`;
}