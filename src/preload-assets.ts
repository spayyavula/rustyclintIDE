// Preload critical assets
// This file is imported in main.tsx to ensure critical assets are loaded early

// Preload critical CSS (only in production to avoid console warnings)
const preloadCSS = () => {
  if (import.meta.env.DEV) {
    console.log('Skipping CSS preload in development mode');
    return;
  }
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = '/src/index.css';
  document.head.appendChild(link);
};

// Preload critical fonts if any (only in production)
const preloadFonts = () => {
  if (import.meta.env.DEV) {
    return;
  }
  // Add font preloading if needed
};

// Preload critical images (only in production)
const preloadImages = () => {
  if (import.meta.env.DEV) {
    return;
  }
  // No critical images to preload
};

// Execute preloading only in production
if (!import.meta.env.DEV) {
  preloadCSS();
  preloadFonts();
  preloadImages();
} else {
  console.log('Preloading disabled in development mode to prevent console warnings');
}

// Add event listener for page load to measure performance
window.addEventListener('load', () => {
  // Report performance metrics if needed
  if (window.performance) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
  }
});

export {};