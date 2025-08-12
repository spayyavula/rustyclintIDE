import { useCallback } from 'react';
import { supabase, cachedQuery, createSupabaseQueryKey } from '../lib/supabase';
import { CACHE_EXPIRATION } from '../utils/cacheUtils';
import { useCachedQuery } from './useCachedQuery';

/**
 * Hook for fetching user subscription data with optimized query
 */
export function useUserSubscription(userId: string | undefined) {
  const queryKey = ['subscription', userId];
  
  const fetchSubscription = useCallback(async () => {
    if (!userId) return null;
    
    const { data, error } = await cachedQuery(
      () => supabase.rpc('get_user_active_subscription', { p_user_id: userId }),
      createSupabaseQueryKey('subscription', 'active', userId),
      CACHE_EXPIRATION.MEDIUM
    );
    
    if (error) throw error;
    return data;
  }, [userId]);
  
  return useCachedQuery(queryKey, fetchSubscription, {
    enabled: !!userId,
    staleTime: CACHE_EXPIRATION.MEDIUM,
    cacheTime: CACHE_EXPIRATION.LONG
  });
}

/**
 * Hook for fetching user orders with pagination
 */
export function useUserOrders(userId: string | undefined, limit = 10, offset = 0) {
  const queryKey = ['orders', userId, limit, offset];
  
  const fetchOrders = useCallback(async () => {
    if (!userId) return [];
    
    const { data, error } = await cachedQuery(
      () => supabase.rpc('get_user_orders', { 
        p_user_id: userId,
        p_limit: limit,
        p_offset: offset
      }),
      createSupabaseQueryKey('orders', 'list', userId, `${limit}-${offset}`),
      CACHE_EXPIRATION.MEDIUM
    );
    
    if (error) throw error;
    return data || [];
  }, [userId, limit, offset]);
  
  return useCachedQuery(queryKey, fetchOrders, {
    enabled: !!userId,
    keepPreviousData: true
  });
}

/**
 * Hook for fetching deployment with events
 */
export function useDeploymentWithEvents(deploymentId: number | undefined, eventsLimit = 20) {
  const queryKey = ['deployment', deploymentId, eventsLimit];
  
  const fetchDeployment = useCallback(async () => {
    if (!deploymentId) return null;
    
    const { data, error } = await cachedQuery(
      () => supabase.rpc('get_deployment_with_events', { 
        p_deployment_id: deploymentId,
        p_events_limit: eventsLimit
      }),
      createSupabaseQueryKey('deployment', 'with-events', deploymentId.toString(), eventsLimit.toString()),
      CACHE_EXPIRATION.SHORT // Short cache time for active deployments
    );
    
    if (error) throw error;
    return data;
  }, [deploymentId, eventsLimit]);
  
  return useCachedQuery(queryKey, fetchDeployment, {
    enabled: !!deploymentId,
    refetchInterval: (data) => {
      // Refetch more frequently for in-progress deployments
      if (data && ['pending', 'building', 'signing', 'uploading'].includes(data.status)) {
        return 3000; // 3 seconds
      }
      return false; // Don't auto-refetch for completed deployments
    }
  });
}

/**
 * Hook for fetching user deployment statistics
 */
export function useDeploymentStats(userId: string | undefined) {
  const queryKey = ['deployment-stats', userId];
  
  const fetchStats = useCallback(async () => {
    if (!userId) return null;
    
    const { data, error } = await cachedQuery(
      () => supabase.rpc('get_user_deployment_stats', { p_user_id: userId }),
      createSupabaseQueryKey('deployment', 'stats', userId),
      CACHE_EXPIRATION.MEDIUM
    );
    
    if (error) throw error;
    return data;
  }, [userId]);
  
  return useCachedQuery(queryKey, fetchStats, {
    enabled: !!userId
  });
}

/**
 * Hook for searching deployments
 */
export function useSearchDeployments(userId: string | undefined, searchText: string, limit = 10, offset = 0) {
  const queryKey = ['search-deployments', userId, searchText, limit, offset];
  
  const searchDeployments = useCallback(async () => {
    if (!userId || !searchText) return [];
    
    const { data, error } = await cachedQuery(
      () => supabase.rpc('search_deployments', { 
        p_user_id: userId,
        p_search_text: searchText,
        p_limit: limit,
        p_offset: offset
      }),
      createSupabaseQueryKey('deployment', 'search', userId, searchText, `${limit}-${offset}`),
      CACHE_EXPIRATION.SHORT
    );
    
    if (error) throw error;
    return data || [];
  }, [userId, searchText, limit, offset]);
  
  return useCachedQuery(queryKey, searchDeployments, {
    enabled: !!userId && !!searchText,
    keepPreviousData: true
  });
}

/**
 * Hook for fetching available products with filtering
 */
export function useAvailableProducts(options: {
  mode?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  limit?: number;
  offset?: number;
} = {}) {
  const { mode, minPrice = 0, maxPrice, featured, limit = 20, offset = 0 } = options;
  const queryKey = ['products', { mode, minPrice, maxPrice, featured, limit, offset }];
  
  const fetchProducts = useCallback(async () => {
    const { data, error } = await cachedQuery(
      () => supabase.rpc('get_available_products', { 
        p_mode: mode,
        p_min_price: minPrice,
        p_max_price: maxPrice,
        p_featured: featured,
        p_limit: limit,
        p_offset: offset
      }),
      createSupabaseQueryKey('products', 'available', JSON.stringify(options)),
      CACHE_EXPIRATION.LONG // Products don't change often
    );
    
    if (error) throw error;
    return data || [];
  }, [mode, minPrice, maxPrice, featured, limit, offset]);
  
  return useCachedQuery(queryKey, fetchProducts, {
    staleTime: CACHE_EXPIRATION.LONG,
    cacheTime: CACHE_EXPIRATION.VERY_LONG,
    keepPreviousData: true
  });
}

/**
 * Hook for fetching user build configurations
 */
export function useBuildConfigurations(userId: string | undefined, includeDeleted = false) {
  const queryKey = ['build-configs', userId, includeDeleted];
  
  const fetchConfigurations = useCallback(async () => {
    if (!userId) return [];
    
    const { data, error } = await cachedQuery(
      () => supabase.rpc('get_user_build_configurations', { 
        p_user_id: userId,
        p_include_deleted: includeDeleted
      }),
      createSupabaseQueryKey('build-configs', 'list', userId, includeDeleted.toString()),
      CACHE_EXPIRATION.LONG
    );
    
    if (error) throw error;
    return data || [];
  }, [userId, includeDeleted]);
  
  return useCachedQuery(queryKey, fetchConfigurations, {
    enabled: !!userId
  });
}