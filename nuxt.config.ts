// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  // Enable pages directory
  pages: true,

  // TresJS requires client-side rendering for WebGL
  ssr: false,

  app: {
    head: {
      title: '3D Dice Roller',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' }
      ]
    }
  },

  // Vite config for Three.js
  vite: {
    optimizeDeps: {
      include: ['three', '@dimforge/rapier3d-compat']
    }
  }
})