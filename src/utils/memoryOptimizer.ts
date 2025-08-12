/**
 * Memory Optimization Utilities
 * 
 * This module provides functions to optimize memory usage in the application
 * by cleaning up unused resources and managing cache efficiently.
 */

import localforage from 'localforage';

/**
 * Purges old cache entries to free up memory
 * @param olderThan Time in milliseconds, entries older than this will be purged
 * @returns Number of entries purged
 */
export async function purgeOldCache(olderThan: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
  let purgedCount = 0;
  
  try {
    // Get all keys
    const keys = await localforage.keys();
    
    // Current time
    const now = Date.now();
    
    // Check each item
    for (const key of keys) {
      try {
        const item = await localforage.getItem(key);
        
        // Skip if item is not an object or doesn't have expiry
        if (!item || typeof item !== 'object' || !('expiry' in item)) continue;
        
        // If item is expired or older than specified time
        if (item.expiry < now || (now - item.expiry + olderThan) > 0) {
          await localforage.removeItem(key);
          purgedCount++;
        }
      } catch (err) {
        console.warn(`Failed to process cache item with key ${key}:`, err);
      }
    }
    
    return purgedCount;
  } catch (err) {
    console.error('Error purging old cache:', err);
    return 0;
  }
}

/**
 * Cleans up memory by releasing unused resources
 */
export function cleanupMemory(): void {
  // Clear any timers that might be leaking
  const highestTimeoutId = setTimeout(() => {}, 0);
  for (let i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }
  
  // Force garbage collection if available (only works in some environments)
  if (typeof window !== 'undefined' && 'gc' in window) {
    try {
      (window as any).gc();
    } catch (e) {
      // Garbage collection not available
    }
  }
}

/**
 * Optimizes memory usage by cleaning up resources and purging old cache
 */
export async function optimizeMemory(): Promise<void> {
  // Clean up memory
  cleanupMemory();
  
  // Purge old cache
  const purgedCount = await purgeOldCache();
  
  if (purgedCount > 0) {
    console.log(`Memory optimized: purged ${purgedCount} old cache entries`);
  }
}

/**
 * Monitors memory usage and triggers optimization when needed
 * @param threshold Memory threshold in MB to trigger optimization
 */
export function setupMemoryMonitor(threshold: number = 500): () => void {
  // Check if performance.memory is available (Chrome only)
  const canMonitorMemory = typeof performance !== 'undefined' && 
                          'memory' in performance;
  
  if (!canMonitorMemory) {
    console.warn('Memory monitoring not supported in this browser');
    return () => {}; // Return empty cleanup function
  }
  
  // Convert threshold to bytes
  const thresholdBytes = threshold * 1024 * 1024;
  
  // Set up interval to check memory usage
  const intervalId = setInterval(() => {
    const memoryInfo = (performance as any).memory;
    
    if (memoryInfo && memoryInfo.usedJSHeapSize > thresholdBytes) {
      console.warn(`Memory usage high: ${Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)}MB`);
      optimizeMemory();
    }
  }, 30000); // Check every 30 seconds
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}

/**
 * Initializes memory optimization features
 */
export function initMemoryOptimizer(): () => void {
  // Initial optimization
  optimizeMemory();
  
  // Set up monitoring
  const cleanupMonitor = setupMemoryMonitor();
  
  // Set up periodic optimization
  const intervalId = setInterval(() => {
    optimizeMemory();
  }, 5 * 60 * 1000); // Every 5 minutes
  
  // Return cleanup function
  return () => {
    cleanupMonitor();
    clearInterval(intervalId);
  };
}