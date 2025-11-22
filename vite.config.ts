import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Disable Sonner toasts globally by aliasing to a local no-op module
      "sonner": path.resolve(__dirname, "./src/lib/sonner-noop.ts"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core React libs
            if (id.includes('react/') || id.includes('react-dom/')) return 'react-core';
            if (id.includes('react-router')) return 'react-router';
            
            // Query
            if (id.includes('@tanstack/react-query')) return 'react-query';
            
            // Supabase - split into smaller chunks
            if (id.includes('@supabase/supabase-js')) return 'supabase';
            if (id.includes('@supabase/realtime-js')) return 'supabase-realtime';
            if (id.includes('@supabase/postgrest-js')) return 'supabase-postgrest';
            
            // UI libraries - separate radix components
            if (id.includes('@radix-ui/react-dialog')) return 'radix-dialog';
            if (id.includes('@radix-ui/react-dropdown-menu')) return 'radix-dropdown';
            if (id.includes('@radix-ui/react-select')) return 'radix-select';
            if (id.includes('@radix-ui')) return 'radix-ui';
            
            // Icons - lazy load
            if (id.includes('lucide-react')) return 'icons';
            
            // Maps
            if (id.includes('@vis.gl/react-google-maps')) return 'google-maps';
            
            // Other large deps
            if (id.includes('date-fns')) return 'date-fns';
          }
        },
        // Better file naming for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    // Optimize chunk size
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
