import './initialize'; // <-- Add this as the very first import
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App.tsx';
import './index.css';
import { initMemoryOptimizer } from './utils/memoryOptimizer';

// Create a client for React Query with safer configuration
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 30 * 60 * 1000, // 30 minutes
        retry: 1,
        onError: (error) => {
          console.error('Query error:', error);
        }
      },
    },
  });
};

const queryClient = createQueryClient();

// Make sure the DOM is fully loaded before creating the root
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// Initialize memory optimizer
const cleanupMemoryOptimizer = initMemoryOptimizer();

// Register service worker only in production and only if supported
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  try {
    // Clear any development caches first
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    });
  } catch (error) {
    console.warn('Error clearing caches:', error);
  }
  
  // Only register in production
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      updateViaCache: 'none' // Disable cache for the service worker file itself
    })
    .then((registration) => {
      console.log('SW registered: ', registration);
    })
    .catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
} else if (import.meta.env.DEV) {
  // In development, aggressively unregister any existing service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        console.log('Unregistering service worker in development:', registration);
        registration.unregister();
      }
    });
  }
  
  // Clear all caches in development
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Clearing development cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).catch(error => console.warn('Error clearing development caches:', error));
  }
}

// Preload critical components
if ('requestIdleCallback' in window) {
  try {
    window.requestIdleCallback(() => {
      // Preload critical components in sequence to avoid overwhelming the browser
      import('./components/LandingPage')
        .then(() => import('./components/auth/LoginPage'))
        .then(() => import('./components/auth/SignupPage'))
        .catch(error => console.warn('Error preloading components:', error));
    });
  } catch (error) {
    console.warn('Error in requestIdleCallback:', error);
    // Fallback already defined below
  }
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(() => {
    try {
      // Preload critical components in sequence
      import('./components/LandingPage')
        .then(() => import('./components/auth/LoginPage'))
        .then(() => import('./components/auth/SignupPage'))
        .catch(error => console.warn('Error preloading components:', error));
    } catch (error) {
      console.warn('Error preloading components:', error);
    }
  }, 1000);
}

// Clean up memory optimizer on page unload
window.addEventListener('beforeunload', () => {
  cleanupMemoryOptimizer();
});