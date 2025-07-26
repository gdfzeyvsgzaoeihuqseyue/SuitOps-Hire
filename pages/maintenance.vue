<template>
  <main class="flex items-center justify-center">
    <div class="relative bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
      <!-- Icône -->
      <div class="mx-auto mb-6 flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full animate-bounce">
        <IconInfoCircle class="h-12 w-auto text-primary" />
      </div>

      <!-- Texte -->
      <h1 class="text-3xl font-bold text-primary mb-3">Maintenance en cours</h1>
      <p class="text-gray-600 mb-6 leading-relaxed">
        L'accès au <span class="font-semibold text-secondary">Dashboard</span> est temporairement indisponible. <br>
        Nous travaillons sur de nouvelles fonctionnalités pour la version bêta de <span class="text-primary">Suitops Hire</span>.
      </p>

      <!-- Bouton -->
      <NuxtLink
        to="/"
        class="inline-block px-6 py-3 text-lg font-medium bg-primary text-white rounded-xl shadow hover:bg-secondary transition-transform transform hover:scale-105"
      >
        Retour à l'accueil
      </NuxtLink>

      <!-- Badge version -->
      <p class="mt-6 text-sm text-gray-400">Version bêta - Accès limité</p>
    </div>
  </main>
</template>

<script setup>
import { IconInfoCircle } from '@tabler/icons-vue'

useHead({
  title: 'Maintenance en cours',
  meta: [
    { name: 'description', content: 'Le Dashboard est temporairement indisponible durant la phase bêta.' }
  ]
});
</script>
