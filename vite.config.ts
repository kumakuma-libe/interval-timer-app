import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/interval-timer-app/',
  plugins: [react(), tailwindcss()],
})
