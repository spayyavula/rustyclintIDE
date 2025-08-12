import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { CACHE_EXPIRATION } from '../utils/cacheUtils';

/**
 * Custom hook for cached data fetching using React Query
 * 
 * @param queryKey Unique key for the query
 * @param queryFn Function that returns a promise with the data
 * @param options Additional React Query options
 * @returns UseQueryResult with data, loading state, and error
 */
export function useCachedQuery<TData = unknown, TError = unknown>(
  queryKey: string | readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>(
    queryKey,
    queryFn,
    {
      staleTime: CACHE_EXPIRATION.MEDIUM,
      cacheTime: CACHE_EXPIRATION.LONG,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      ...options,
    }
  );
}

/**
 * Hook for fetching data with different caching strategies
 */
export function useCachedData<TData = unknown, TError = unknown>(
  queryKey: string | readonly unknown[],
  queryFn: () => Promise<TData>,
  cacheStrategy: 'short' | 'medium' | 'long' | 'very-long' = 'medium',
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn' | 'staleTime' | 'cacheTime'>
): UseQueryResult<TData, TError> {
  // Set cache times based on strategy
  let staleTime = CACHE_EXPIRATION.MEDIUM;
  let cacheTime = CACHE_EXPIRATION.LONG;
  
  switch (cacheStrategy) {
    case 'short':
      staleTime = CACHE_EXPIRATION.SHORT;
      cacheTime = CACHE_EXPIRATION.MEDIUM;
      break;
    case 'medium':
      staleTime = CACHE_EXPIRATION.MEDIUM;
      cacheTime = CACHE_EXPIRATION.LONG;
      break;
    case 'long':
      staleTime = CACHE_EXPIRATION.LONG;
      cacheTime = CACHE_EXPIRATION.VERY_LONG;
      break;
    case 'very-long':
      staleTime = CACHE_EXPIRATION.VERY_LONG;
      cacheTime = CACHE_EXPIRATION.VERY_LONG;
      break;
  }
  
  return useQuery<TData, TError>(
    queryKey,
    queryFn,
    {
      staleTime,
      cacheTime,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      ...options,
    }
  );
}