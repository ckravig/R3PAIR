// vite.config.js
export default {
    base: '/R3PAIR/',
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          about: 'about.html'
        }
      }
    }
  }
  