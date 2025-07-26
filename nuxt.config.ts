// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  runtimeConfig: {
    public: {
      pgsApiBase: process.env.PGS_API_BASE_URL
    }
  },

  app: {
    head: {
      title: 'PGS Hire - Plateforme de Recrutement',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'PGS Hire - Plateforme moderne de recrutement intégrée à PGS' }
      ]
    }
  },
  image: {
    quality: 80,
    format: ['webp']
  }
})