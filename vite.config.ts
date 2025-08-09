import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default Vite port, or your chosen port
    host: true, // This will make Vite accessible externally
    // Or specifically: host: '0.0.0.0'
  },
});