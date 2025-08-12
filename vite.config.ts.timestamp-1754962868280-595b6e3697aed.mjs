// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import compression from "file:///home/project/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///home/project/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig(({ command }) => ({
  plugins: [
    react({
      // Disable automatic JSX runtime in dev to reduce preloading
      jsxRuntime: command === "serve" ? "classic" : "automatic"
    }),
    ...command === "build" ? [
      compression({
        algorithm: "gzip",
        ext: ".gz"
      }),
      compression({
        algorithm: "brotliCompress",
        ext: ".br"
      }),
      visualizer({
        filename: "./dist/bundle-analysis.html",
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ] : []
  ],
  optimizeDeps: {
    // Only include if not auto-detected; Vite is good at this
    include: [],
    exclude: [],
    esbuildOptions: {
      // Avoid unnecessary polyfills for node built-ins
      define: { "process.env": "{}" },
      target: "esnext"
    }
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    assetsInlineLimit: 4096,
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      maxParallelFileOps: 3,
      // Limit parallel file operations
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "supabase-vendor": ["@supabase/supabase-js"],
          "lucide-icons": ["lucide-react"],
          "storage": ["localforage"],
          "utils": ["./src/utils/stringUtils.ts", "./src/utils/cacheUtils.ts"]
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
      strict: false
    },
    proxy: {
      "/ws": {
        target: "ws://localhost:3002",
        ws: true,
        changeOrigin: true
      }
    },
    // Disable preload in development
    preTransformRequests: false,
    hmr: {
      overlay: true,
      timeout: 3e4,
      // Lowered timeout for faster feedback
      port: 24678,
      clientPort: 443
    },
    headers: {
      "Cache-Control": "no-cache",
      // Disable caching in development
      // Prevent preload warnings in development
      "X-Content-Type-Options": "nosniff"
    },
    watch: {
      usePolling: false,
      // Disable polling for faster startup (enable only if needed)
      interval: 1e3,
      ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"]
    }
    // Optionally, set cacheDir for faster disk access (uncomment if needed)
    // cacheDir: './.vite_cache',
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCB9KSA9PiAoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAgLy8gRGlzYWJsZSBhdXRvbWF0aWMgSlNYIHJ1bnRpbWUgaW4gZGV2IHRvIHJlZHVjZSBwcmVsb2FkaW5nXG4gICAgICBqc3hSdW50aW1lOiBjb21tYW5kID09PSAnc2VydmUnID8gJ2NsYXNzaWMnIDogJ2F1dG9tYXRpYydcbiAgICB9KSxcbiAgICAuLi4oY29tbWFuZCA9PT0gJ2J1aWxkJyA/IFtcbiAgICAgIGNvbXByZXNzaW9uKHtcbiAgICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXG4gICAgICAgIGV4dDogJy5neicsXG4gICAgICB9KSxcbiAgICAgIGNvbXByZXNzaW9uKHtcbiAgICAgICAgYWxnb3JpdGhtOiAnYnJvdGxpQ29tcHJlc3MnLFxuICAgICAgICBleHQ6ICcuYnInLFxuICAgICAgfSksXG4gICAgICB2aXN1YWxpemVyKHtcbiAgICAgICAgZmlsZW5hbWU6ICcuL2Rpc3QvYnVuZGxlLWFuYWx5c2lzLmh0bWwnLFxuICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICAgIH0pXG4gICAgXSA6IFtdKSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgLy8gT25seSBpbmNsdWRlIGlmIG5vdCBhdXRvLWRldGVjdGVkOyBWaXRlIGlzIGdvb2QgYXQgdGhpc1xuICAgIGluY2x1ZGU6IFtdLFxuICAgIGV4Y2x1ZGU6IFtdLFxuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBwb2x5ZmlsbHMgZm9yIG5vZGUgYnVpbHQtaW5zXG4gICAgICBkZWZpbmU6IHsgJ3Byb2Nlc3MuZW52JzogJ3t9JyB9LFxuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgY3NzTWluaWZ5OiB0cnVlLCBcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NiwgXG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgbWF4UGFyYWxsZWxGaWxlT3BzOiAzLCAvLyBMaW1pdCBwYXJhbGxlbCBmaWxlIG9wZXJhdGlvbnNcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAnc3VwYWJhc2UtdmVuZG9yJzogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcbiAgICAgICAgICAnbHVjaWRlLWljb25zJzogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICAnc3RvcmFnZSc6IFsnbG9jYWxmb3JhZ2UnXSxcbiAgICAgICAgICAndXRpbHMnOiBbJy4vc3JjL3V0aWxzL3N0cmluZ1V0aWxzLnRzJywgJy4vc3JjL3V0aWxzL2NhY2hlVXRpbHMudHMnXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBEaXNhYmxlIGF1dG9tYXRpYyBwcmVsb2FkIGdlbmVyYXRpb24gY29tcGxldGVseVxuICAgIG1vZHVsZVByZWxvYWQ6IHtcbiAgICAgIHBvbHlmaWxsOiBmYWxzZVxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogdHJ1ZSxcbiAgICBmczoge1xuICAgICAgc3RyaWN0OiBmYWxzZSxcbiAgICB9LFxuICAgIHByb3h5OiB7XG4gICAgICAnL3dzJzoge1xuICAgICAgICB0YXJnZXQ6ICd3czovL2xvY2FsaG9zdDozMDAyJyxcbiAgICAgICAgd3M6IHRydWUsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gRGlzYWJsZSBwcmVsb2FkIGluIGRldmVsb3BtZW50XG4gICAgcHJlVHJhbnNmb3JtUmVxdWVzdHM6IGZhbHNlLFxuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogdHJ1ZSxcbiAgICAgIHRpbWVvdXQ6IDMwMDAwLCAvLyBMb3dlcmVkIHRpbWVvdXQgZm9yIGZhc3RlciBmZWVkYmFja1xuICAgICAgcG9ydDogMjQ2NzgsXG4gICAgICBjbGllbnRQb3J0OiA0NDMsXG4gICAgfSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZScsIC8vIERpc2FibGUgY2FjaGluZyBpbiBkZXZlbG9wbWVudFxuICAgICAgLy8gUHJldmVudCBwcmVsb2FkIHdhcm5pbmdzIGluIGRldmVsb3BtZW50XG4gICAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJyxcbiAgICB9LFxuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiBmYWxzZSwgLy8gRGlzYWJsZSBwb2xsaW5nIGZvciBmYXN0ZXIgc3RhcnR1cCAoZW5hYmxlIG9ubHkgaWYgbmVlZGVkKVxuICAgICAgaW50ZXJ2YWw6IDEwMDAsXG4gICAgICBpZ25vcmVkOiBbJyoqL25vZGVfbW9kdWxlcy8qKicsICcqKi9kaXN0LyoqJywgJyoqLy5naXQvKionXVxuICAgIH0sXG4gICAgLy8gT3B0aW9uYWxseSwgc2V0IGNhY2hlRGlyIGZvciBmYXN0ZXIgZGlzayBhY2Nlc3MgKHVuY29tbWVudCBpZiBuZWVkZWQpXG4gICAgLy8gY2FjaGVEaXI6ICcuLy52aXRlX2NhY2hlJyxcbiAgfVxufSkpOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLFNBQVMsa0JBQWtCO0FBRzNCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsUUFBUSxPQUFPO0FBQUEsRUFDNUMsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsTUFFSixZQUFZLFlBQVksVUFBVSxZQUFZO0FBQUEsSUFDaEQsQ0FBQztBQUFBLElBQ0QsR0FBSSxZQUFZLFVBQVU7QUFBQSxNQUN4QixZQUFZO0FBQUEsUUFDVixXQUFXO0FBQUEsUUFDWCxLQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUEsTUFDRCxZQUFZO0FBQUEsUUFDVixXQUFXO0FBQUEsUUFDWCxLQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxVQUFVO0FBQUEsUUFDVixNQUFNO0FBQUEsUUFDTixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsTUFDZCxDQUFDO0FBQUEsSUFDSCxJQUFJLENBQUM7QUFBQSxFQUNQO0FBQUEsRUFDQSxjQUFjO0FBQUE7QUFBQSxJQUVaLFNBQVMsQ0FBQztBQUFBLElBQ1YsU0FBUyxDQUFDO0FBQUEsSUFDVixnQkFBZ0I7QUFBQTtBQUFBLE1BRWQsUUFBUSxFQUFFLGVBQWUsS0FBSztBQUFBLE1BQzlCLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsbUJBQW1CO0FBQUEsSUFDbkIsUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsZUFBZTtBQUFBLE1BQ2Isb0JBQW9CO0FBQUE7QUFBQSxNQUNwQixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixnQkFBZ0IsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUNyQyxtQkFBbUIsQ0FBQyx1QkFBdUI7QUFBQSxVQUMzQyxnQkFBZ0IsQ0FBQyxjQUFjO0FBQUEsVUFDL0IsV0FBVyxDQUFDLGFBQWE7QUFBQSxVQUN6QixTQUFTLENBQUMsOEJBQThCLDJCQUEyQjtBQUFBLFFBQ3JFO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFFBQ1IsSUFBSTtBQUFBLFFBQ0osY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxzQkFBc0I7QUFBQSxJQUN0QixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUE7QUFBQSxNQUNULE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxJQUNkO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxpQkFBaUI7QUFBQTtBQUFBO0FBQUEsTUFFakIsMEJBQTBCO0FBQUEsSUFDNUI7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQTtBQUFBLE1BQ1osVUFBVTtBQUFBLE1BQ1YsU0FBUyxDQUFDLHNCQUFzQixjQUFjLFlBQVk7QUFBQSxJQUM1RDtBQUFBO0FBQUE7QUFBQSxFQUdGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
