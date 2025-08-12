import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react({
      // Disable automatic JSX runtime in dev to reduce preloading
      jsxRuntime: command === 'serve' ? 'classic' : 'automatic'
    }),
    ...(command === 'build' ? [
      compression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      visualizer({
        filename: './dist/bundle-analysis.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    ] : []),
  ],
  optimizeDeps: {
    // Only include if not auto-detected; Vite is good at this
    include: [],
    exclude: [],
    esbuildOptions: {
      // Avoid unnecessary polyfills for node built-ins
      define: { 'process.env': '{}' },
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true, 
    assetsInlineLimit: 4096, 
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      maxParallelFileOps: 3, // Limit parallel file operations
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'lucide-icons': ['lucide-react'],
          'storage': ['localforage'],
          'utils': ['./src/utils/stringUtils.ts', './src/utils/cacheUtils.ts']
        }
      }
    },
    // Disable automatic preload generation completely
    modulePreload: {
      polyfill: false
    }
  },
  server: {
    host: true,
    fs: {
      strict: false,
    },
    // Disable preload in development
    preTransformRequests: false,
    hmr: {
      overlay: true,
      timeout: 30000, // Lowered timeout for faster feedback
      port: 24678,
    },
    headers: {
      'Cache-Control': 'no-cache', // Disable caching in development
      // Prevent preload warnings in development
      'X-Content-Type-Options': 'nosniff',
    },
    watch: {
      usePolling: false, // Disable polling for faster startup (enable only if needed)
      interval: 1000,
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    },
    // Optionally, set cacheDir for faster disk access (uncomment if needed)
    // cacheDir: './.vite_cache',
  }
}));