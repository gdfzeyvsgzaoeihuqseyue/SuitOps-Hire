<template>
  <main class="relative p-6 flex flex-col items-center justify-center mt-6">
    <!-- Données floutées en arrière-plan -->
    <!-- <section class="absolute inset-0 z-0 opacity-50 blur-sm pointer-events-none">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
        <div
          v-for="n in 6"
          :key="n"
          class="bg-white border border-gray-200 rounded-xl p-4 shadow-md h-32"
        >
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </section> -->

    <!-- Message -->
    <section class="z-10 text-center max-w-xl bg-white/80 bg-opacity-60 backdrop-blur-sm p-6 rounded-xl shadow-lg border">
      <IconMoodSad class="mx-auto w-12 h-12 text-gray-500 mb-4" />
      <h1 class="text-2xl font-bold text-gray-800 mb-2"> Cette page n’est pas encore disponible </h1>
      <p class="text-gray-600 mb-4"> L'affichage des offres selon vos préférences arrive très bientôt.</p>

      <p class="text-gray-700 font-medium">
        En attendant, explorez les 
        <NuxtLink to="/offer" class="text-primary hover:text-secondary">offres disponibles</NuxtLink>
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { IconMoodSad } from '@tabler/icons-vue'

useHead({
  title: "Préférences",
  meta: [
    {
      name: 'description',
      content: "Cette page d'offres personnalisées sera disponible très prochainement. En attendant, explorez les autres options."
    }
  ]
})
</script>
