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

  site: {
    url: 'https://hire-suitops.netlify.app',
    name: 'Hire SuitOps',
  },

  sitemap: {
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
      { label: 'Hreflangs', select: 'count(xhtml:link)', width: '25%' },
    ],
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      ignore: [
        '/dashboard',
        '/dashboard/**',
        '/auth',
        '/auth/**',
        '/blog',
        '/blog/**',
      ]
    }
  },

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
      'Bree+Serif': [100, 200, 300, 400, 500, 600, 700, 800, 900],
    }
  },

  app: {
    head: {
      title: 'SuitOps Hire - Plateforme de Recrutement',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Pro Gestion Soft' },
        { name: 'keywords', content: 'Recrutement, SuitOps, Candidat, Emploie, Embauche, Bénin, PGS, Pro Gestion Soft' },
        {
          name: 'google-site-verification',
          content: 'OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A'
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://hire-suitops.netlify.app' }
      ]
    }
  },

  image: {
    quality: 80,
    format: ['webp']
  }
})
