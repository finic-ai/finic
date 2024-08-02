import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace';


// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env,
    // global: 'window'
  },
  optimizeDeps: {
    include: ['js-big-decimal']
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: [
      {
        find: '@/subframe',
        replacement: '/src/subframe'
      }
    ]
  }
})