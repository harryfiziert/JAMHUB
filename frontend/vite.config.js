import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/flashcards': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/flashcard': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/exam-simulation': 'http://localhost:8000',
      '/leaderboard': 'http://localhost:8000',
      '/user': 'http://localhost:8000',
    }
  }
});
