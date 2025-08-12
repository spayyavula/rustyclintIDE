// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCB9KSA9PiAoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAgLy8gRGlzYWJsZSBhdXRvbWF0aWMgSlNYIHJ1bnRpbWUgaW4gZGV2IHRvIHJlZHVjZSBwcmVsb2FkaW5nXG4gICAgICBqc3hSdW50aW1lOiBjb21tYW5kID09PSAnc2VydmUnID8gJ2NsYXNzaWMnIDogJ2F1dG9tYXRpYydcbiAgICB9KSxcbiAgICAuLi4oY29tbWFuZCA9PT0gJ2J1aWxkJyA/IFtcbiAgICAgIGNvbXByZXNzaW9uKHtcbiAgICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXG4gICAgICAgIGV4dDogJy5neicsXG4gICAgICB9KSxcbiAgICAgIGNvbXByZXNzaW9uKHtcbiAgICAgICAgYWxnb3JpdGhtOiAnYnJvdGxpQ29tcHJlc3MnLFxuICAgICAgICBleHQ6ICcuYnInLFxuICAgICAgfSksXG4gICAgICB2aXN1YWxpemVyKHtcbiAgICAgICAgZmlsZW5hbWU6ICcuL2Rpc3QvYnVuZGxlLWFuYWx5c2lzLmh0bWwnLFxuICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcbiAgICAgIH0pXG4gICAgXSA6IFtdKSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgLy8gT25seSBpbmNsdWRlIGlmIG5vdCBhdXRvLWRldGVjdGVkOyBWaXRlIGlzIGdvb2QgYXQgdGhpc1xuICAgIGluY2x1ZGU6IFtdLFxuICAgIGV4Y2x1ZGU6IFtdLFxuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBwb2x5ZmlsbHMgZm9yIG5vZGUgYnVpbHQtaW5zXG4gICAgICBkZWZpbmU6IHsgJ3Byb2Nlc3MuZW52JzogJ3t9JyB9LFxuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgY3NzTWluaWZ5OiB0cnVlLCBcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NiwgXG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgbWF4UGFyYWxsZWxGaWxlT3BzOiAzLCAvLyBMaW1pdCBwYXJhbGxlbCBmaWxlIG9wZXJhdGlvbnNcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAnc3VwYWJhc2UtdmVuZG9yJzogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcbiAgICAgICAgICAnbHVjaWRlLWljb25zJzogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICAnc3RvcmFnZSc6IFsnbG9jYWxmb3JhZ2UnXSxcbiAgICAgICAgICAndXRpbHMnOiBbJy4vc3JjL3V0aWxzL3N0cmluZ1V0aWxzLnRzJywgJy4vc3JjL3V0aWxzL2NhY2hlVXRpbHMudHMnXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBEaXNhYmxlIGF1dG9tYXRpYyBwcmVsb2FkIGdlbmVyYXRpb24gY29tcGxldGVseVxuICAgIG1vZHVsZVByZWxvYWQ6IHtcbiAgICAgIHBvbHlmaWxsOiBmYWxzZVxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogdHJ1ZSxcbiAgICBmczoge1xuICAgICAgc3RyaWN0OiBmYWxzZSxcbiAgICB9LFxuICAgIC8vIERpc2FibGUgcHJlbG9hZCBpbiBkZXZlbG9wbWVudFxuICAgIHByZVRyYW5zZm9ybVJlcXVlc3RzOiBmYWxzZSxcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IHRydWUsXG4gICAgICB0aW1lb3V0OiAzMDAwMCwgLy8gTG93ZXJlZCB0aW1lb3V0IGZvciBmYXN0ZXIgZmVlZGJhY2tcbiAgICAgIHBvcnQ6IDI0Njc4LFxuICAgICAgY2xpZW50UG9ydDogNDQzLFxuICAgIH0sXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLCAvLyBEaXNhYmxlIGNhY2hpbmcgaW4gZGV2ZWxvcG1lbnRcbiAgICAgIC8vIFByZXZlbnQgcHJlbG9hZCB3YXJuaW5ncyBpbiBkZXZlbG9wbWVudFxuICAgICAgJ1gtQ29udGVudC1UeXBlLU9wdGlvbnMnOiAnbm9zbmlmZicsXG4gICAgfSxcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogZmFsc2UsIC8vIERpc2FibGUgcG9sbGluZyBmb3IgZmFzdGVyIHN0YXJ0dXAgKGVuYWJsZSBvbmx5IGlmIG5lZWRlZClcbiAgICAgIGludGVydmFsOiAxMDAwLFxuICAgICAgaWdub3JlZDogWycqKi9ub2RlX21vZHVsZXMvKionLCAnKiovZGlzdC8qKicsICcqKi8uZ2l0LyoqJ11cbiAgICB9LFxuICAgIC8vIE9wdGlvbmFsbHksIHNldCBjYWNoZURpciBmb3IgZmFzdGVyIGRpc2sgYWNjZXNzICh1bmNvbW1lbnQgaWYgbmVlZGVkKVxuICAgIC8vIGNhY2hlRGlyOiAnLi8udml0ZV9jYWNoZScsXG4gIH1cbn0pKTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLGtCQUFrQjtBQUczQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFFBQVEsT0FBTztBQUFBLEVBQzVDLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQTtBQUFBLE1BRUosWUFBWSxZQUFZLFVBQVUsWUFBWTtBQUFBLElBQ2hELENBQUM7QUFBQSxJQUNELEdBQUksWUFBWSxVQUFVO0FBQUEsTUFDeEIsWUFBWTtBQUFBLFFBQ1YsV0FBVztBQUFBLFFBQ1gsS0FBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLE1BQ0QsWUFBWTtBQUFBLFFBQ1YsV0FBVztBQUFBLFFBQ1gsS0FBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1QsVUFBVTtBQUFBLFFBQ1YsTUFBTTtBQUFBLFFBQ04sVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLE1BQ2QsQ0FBQztBQUFBLElBQ0gsSUFBSSxDQUFDO0FBQUEsRUFDUDtBQUFBLEVBQ0EsY0FBYztBQUFBO0FBQUEsSUFFWixTQUFTLENBQUM7QUFBQSxJQUNWLFNBQVMsQ0FBQztBQUFBLElBQ1YsZ0JBQWdCO0FBQUE7QUFBQSxNQUVkLFFBQVEsRUFBRSxlQUFlLEtBQUs7QUFBQSxNQUM5QixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLG1CQUFtQjtBQUFBLElBQ25CLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxNQUNiLG9CQUFvQjtBQUFBO0FBQUEsTUFDcEIsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osZ0JBQWdCLENBQUMsU0FBUyxXQUFXO0FBQUEsVUFDckMsbUJBQW1CLENBQUMsdUJBQXVCO0FBQUEsVUFDM0MsZ0JBQWdCLENBQUMsY0FBYztBQUFBLFVBQy9CLFdBQVcsQ0FBQyxhQUFhO0FBQUEsVUFDekIsU0FBUyxDQUFDLDhCQUE4QiwyQkFBMkI7QUFBQSxRQUNyRTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsUUFBUTtBQUFBLElBQ1Y7QUFBQTtBQUFBLElBRUEsc0JBQXNCO0FBQUEsSUFDdEIsS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBO0FBQUEsTUFDVCxNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsSUFDZDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsaUJBQWlCO0FBQUE7QUFBQTtBQUFBLE1BRWpCLDBCQUEwQjtBQUFBLElBQzVCO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxZQUFZO0FBQUE7QUFBQSxNQUNaLFVBQVU7QUFBQSxNQUNWLFNBQVMsQ0FBQyxzQkFBc0IsY0FBYyxZQUFZO0FBQUEsSUFDNUQ7QUFBQTtBQUFBO0FBQUEsRUFHRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
