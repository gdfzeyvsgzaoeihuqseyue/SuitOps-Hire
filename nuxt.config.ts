// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    ['nuxt-gtag', {
      id: process.env.GTAG_ID || 'G-EQ1NZNBVB4', 
      enabled: process.env.NODE_ENV === 'production'
    }],
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],

  runtimeConfig: {
    public: {
      suitipsApiBase: process.env.SUITOPS_API_URL,
      pgsBaseAPI: process.env.PGS_API_URL,
      betaMode: process.env.NUXT_BETA_MODE === 'true',
      pgsSharedFiles: process.env.PGS_SHARED_FILES,
      siteIdentifier: process.env.NUXT_PUBLIC_SITE_IDENTIFIER || 'hire',
    }
  },

  googleFonts: {
    display: 'swap',
    families: {
      'Dosis': [200, 300, 400, 500, 600, 700, 800],
      'Smooch+Sans': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'Bree+Serif': [100, 200, 300, 400, 500, 600, 700, 800, 900],
    }
  },

  app: {
    head: {
      title: 'SuitOps Hire - Plateforme de Recrutement',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'PGS Hire - Plateforme moderne de recrutement intégrée à PGS' },
        {
          name: 'google-site-verification',
          content: 'OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A'
        }
      ]
    }
  },
  image: {
    quality: 80,
    format: ['webp']
  }
})