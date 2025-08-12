import { useState, useEffect, useCallback } from 'react';
import { supabase, cachedQuery, createSupabaseQueryKey } from '../lib/supabase';
import { CACHE_EXPIRATION } from '../utils/cacheUtils';
import { useDeploymentWithEvents } from './useOptimizedQuery';

// Default values for when no deployment exists
const DEFAULT_PROGRESS = 65;
const DEFAULT_MESSAGE = 'Building Android application...';
const DEFAULT_STATUS = 'building';

interface DeploymentDetails {
  id: number;
  visual_progress: number;
  progress_message: string;
  status: string;
}

interface ProgressEvent {
  id: number;
  deployment_id: number;
  event_type: 'start' | 'progress' | 'success' | 'error' | 'warning' | 'info';
  message: string;
  percentage?: number;
  timestamp: string;
  metadata?: any;
}

interface DeploymentProgress {
  id: number;
  visual_progress: number;
  progress_message: string;
  status: string;
  events: ProgressEvent[];
  isLoading: boolean;
  error: string | null;
}

export const useDeploymentProgress = (deploymentId?: number) => {
  const initialProgress: DeploymentProgress = {
    id: deploymentId || 0,
    visual_progress: DEFAULT_PROGRESS,
    progress_message: DEFAULT_MESSAGE,
    status: DEFAULT_STATUS,
    events: [],
    isLoading: false,
    error: null
  };
  
  const [progress, setProgress] = useState<DeploymentProgress>(initialProgress);
  
  // Add polling interval state
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Use the optimized query hook for deployment with events
  const { 
    data: deploymentData,
    isLoading,
    error,
    refetch
  } = useDeploymentWithEvents(deploymentId, 50);

  // Update progress state when deployment data changes
  useEffect(() => {
    if (!deploymentData) return;
    
    // Map events from the JSON array
    const mappedEvents = deploymentData.events ? 
      JSON.parse(deploymentData.events).map((e: any) => ({
        ...e,
        timestamp: e.timestamp,
      })) : 
      [];
    
    setProgress({
      id: deploymentData.deployment_id,
      visual_progress: Math.max(deploymentData.visual_progress ?? 0, 65),
      progress_message: deploymentData.progress_message ?? 'Building Android application...',
      status: deploymentData.status ?? 'building',
      events: mappedEvents,
      isLoading: false,
      error: null
    });
  }, [deploymentData]);
  
  // Update loading and error states
  useEffect(() => {
    setProgress(prev => ({
      ...prev,
      isLoading,
      error: error ? String(error) : null
    }));
  }, [isLoading, error]);

  const addProgressEvent = useCallback(async (
    event_type: ProgressEvent['event_type'],
    message: string,
    percentage?: number,
    metadata?: any
  ) => {
    if (!deploymentId) return;

    try {
      const { data, error } = await supabase
        .from('deployment_progress_events')
        .insert({
          deployment_id: deploymentId,
          event_type,
          message,
          percentage,
          metadata
        })
        .select()
        .single();

      if (error) throw error;

      setProgress(prev => ({
        ...prev,
        visual_progress: Math.max(percentage || prev.visual_progress, 65),
        progress_message: message,
        events: [...prev.events, data]
      }));
    } catch (error) {
      console.error('Error adding progress event:', error);
    }
  }, [deploymentId]);

  useEffect(() => {
    // Initial fetch
    refetch();

    // Set up polling instead of real-time subscriptions
    const pollingInterval = setInterval(() => {
      refetch();
    }, 3000);

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [deploymentId, refetch]);

  return {
    progress: Math.max(progress.visual_progress, DEFAULT_PROGRESS),
    message: progress.progress_message,
    status: progress.status,
    events: progress.events,
    isLoading: progress.isLoading,
    error: progress.error,
    addProgressEvent,
    refreshProgress: refetch
  };
};