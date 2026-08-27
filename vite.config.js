import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes on all network interfaces (0.0.0.0)
    port: 3000,
    open: false,
  },
});
