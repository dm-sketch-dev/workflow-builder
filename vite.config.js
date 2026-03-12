import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/workflow-builder/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          flow: ['@xyflow/react'],
        },
      },
    },
  },
});
