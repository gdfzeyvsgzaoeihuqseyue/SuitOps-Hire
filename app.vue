<template>
  <div class="min-h-screen bg-gray-50 font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const sharedFilesUrl = runtimeConfig.public.pgsSharedFiles;

const heroImagePath = `${sharedFilesUrl}/Hire_SuitOps/metaImg.png`;
const baseUrl = "https://hire-suitops.netlify.app";

useHead({
  titleTemplate: '%s | SUITOPS HIRE',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      key: 'description',
      name: 'description',
      content: 'Plateforme moderne de recrutement intégrée à PGS SuitOps.'
    },
    { name: 'author', content: 'Pro Gestion Soft' },
    { name: 'keywords', content: 'Recrutement, SuitOps, Candidat, Emploie, Embauche, Bénin, PGS, Pro Gestion Soft' },

    // Open Graph (Facebook, LinkedIn)
    { property: 'og:title', content: 'SuitOps Hire - Plateforme de Recrutement' },
    { property: 'og:description', content: 'La simplicité au service de votre carrière.' },
    { property: 'og:image', content: heroImagePath },
    { property: 'og:url', content: baseUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'SuitOps Hire - Plateforme de Recrutement' },
    { name: 'twitter:description', content: 'La simplicité au service de votre carrière.' },
    { name: 'twitter:image', content: heroImagePath },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>
