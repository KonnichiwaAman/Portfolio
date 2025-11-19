import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { imagetools } from 'vite-imagetools';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    imagetools(), // Enable image optimization
    compression({
      algorithms: ['gzip', 'brotliCompress'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    minify: 'terser',
    sourcemap: mode === 'development',
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
        passes: 2, // Additional compression pass
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-icons', 
            '@radix-ui/react-slot',
            '@radix-ui/react-dialog',
            '@radix-ui/react-toast'
          ],
          'form-vendor': [
            'react-hook-form', 
            '@hookform/resolvers', 
            'zod'
          ],
          // Separate heavy animation libraries for lazy loading
          'framer-motion': ['framer-motion'],
          'gsap': ['gsap'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'icons-vendor': ['lucide-react', 'react-icons'],
          'routing-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.[jt]sx?$/, '') || 'chunk'
            : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    reportCompressedSize: false, // Faster builds
  },
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'react-intersection-observer',
      'framer-motion',
      'lucide-react',
      'react-icons',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
      'react-hook-form',
      'zod',
      '@tanstack/react-query'
    ],
    exclude: [
      '@radix-ui/react-icons'
    ],
  },
  define: {
    __DEV__: mode === 'development',
  },
}));
