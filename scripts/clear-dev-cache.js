#!/usr/bin/env node

/**
 * Clear development cache script
 * Run this to completely clear service workers and caches in development
 */

console.log('🧹 Clearing development caches...');

// Script to run in browser console or add to HTML
const clearScript = `
// Clear all service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      console.log('Unregistering service worker:', registration);
      registration.unregister();
    }
  });
}

// Clear all caches
caches.keys().then(function(cacheNames) {
  return Promise.all(
    cacheNames.map(function(cacheName) {
      console.log('Deleting cache:', cacheName);
      return caches.delete(cacheName);
    })
  );
}).then(() => {
  console.log('All caches cleared!');
  // Reload page to get fresh state
  window.location.reload(true);
});
`;

console.log('Copy and paste this script into your browser console:');
console.log('=====================================');
console.log(clearScript);
console.log('=====================================');
console.log('Or open browser dev tools -> Application -> Storage -> Clear storage');
