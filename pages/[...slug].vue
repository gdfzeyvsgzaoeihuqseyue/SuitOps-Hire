<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-textClr p-4">
    <!-- Préférences -->
    <div class="mb-6">
      <prefSettings />
    </div>

    <!-- Conteneur principal -->
    <div
      class="bg-white rounded-xl shadow-lg p-8 sm:p-10 md:p-12 max-w-5xl w-full flex flex-col md:flex-row gap-8 items-center">
      <!-- Colonne texte -->
      <div class="md:w-1/2 text-center md:text-left space-y-6">
        <!-- Logos Desktop -->
        <div class="flex-shrink-0 items-center justify-center mx-4 hidden lg:block">
          <img src="/img/logoDeskCol.png" alt="SuitOps" class="h-14 mx-auto md:mx-0 dark:hidden" />
          <img src="/img/logoDeskWhite.png" alt="SuitOps" class="h-14 mx-auto md:mx-0 hidden dark:block" />
        </div>

        <!-- Logos Mobiles -->
        <div class="sm:hidden flex-shrink-0 flex items-center mx-4 justify-center">
          <img src="/img/logoMobCol.png" alt="Logo" class="h-12 w-auto dark:hidden" />
          <img src="/img/logoMobWhite.png" alt="Logo" class="h-12 w-auto hidden dark:block" />
        </div>

        <!-- Titre -->
        <h1 class="text-7xl font-extrabold text-primary">404</h1>
        <h2 class="text-2xl sm:text-3xl font-semibold">
          Oups ! Page introuvable
        </h2>
        <p class="text-base sm:text-lg leading-relaxed">
          Désolé, la page que vous recherchez semble s'être perdue dans l'espace numérique.
          Il est possible qu'elle ait été déplacée, supprimée, ou que l'adresse soit incorrecte.
        </p>

        <!-- Boutons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink :to="'/'"
            class="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full shadow-md hover:bg-secondary hover:scale-105 transition-transform duration-300">
            <IconHome class="w-5 h-5 mr-2" />
            Aller à l'accueil
          </NuxtLink>
          <button @click="router.go(-1)"
            class="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-300 hover:scale-105 transition-transform duration-300">
            <IconArrowLeft class="w-5 h-5 mr-2" />
            Retour
          </button>
        </div>

        <!-- Suggestions -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-3">
            Que faire maintenant ?
          </h3>
          <ul class="space-y-2 text-base">
            <li class="flex items-start">
              <IconArrowRight class="text-primary w-5 h-5 mr-2 mt-1" />
              <span>
                Visiter notre
                <NuxtLink to="/" class="text-primary hover:underline">
                  page d'accueil
                </NuxtLink>
              </span>
            </li>
            <li class="flex items-start">
              <IconArrowRight class="text-primary w-5 h-5 mr-2 mt-1" />
              Vérifier l'URL pour toute erreur de frappe.
            </li>
            <li class="flex items-start">
              <IconArrowRight class="text-primary w-5 h-5 mr-2 mt-1" />
              <span>
                <NuxtLink to="/contact" class="text-primary hover:underline">
                  Nous contacter
                </NuxtLink>
                si le problème persiste.
              </span>
            </li>
            <li class="flex items-start">
              <IconArrowRight class="text-primary w-5 h-5 mr-2 mt-1" />
              <span>
                <NuxtLink to="/faq" class="text-primary hover:underline">
                  Consulter notre FAQ
                </NuxtLink>
                pour les questions fréquentes.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Colonne image -->
      <div class="md:w-1/2 flex justify-center">
        <img src="https://www.disneyclips.com/images5/images/sadness5.png" alt="Illustration erreur"
          class="w-full max-w-sm h-auto object-contain" />
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="py-4 border-t bg-WtBAct">
    <div class="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto w-full gap-4 px-4">
      <!-- Logos Desktop -->
      <div class="flex-shrink-0 items-center justify-center mx-4 hidden lg:block">
        <img src="/img/logoDeskCol.png" alt="Logo" class="h-12 w-auto dark:hidden" />
        <img src="/img/logoDeskWhite.png" alt="Logo" class="h-12 w-auto hidden dark:block" />
      </div>

      <!-- Logos Mobiles -->
      <div class="sm:hidden flex-shrink-0 flex items-center mx-4">
        <img src="/img/logoMobCol.png" alt="Logo" class="h-12 w-auto dark:hidden" />
        <img src="/img/logoMobWhite.png" alt="Logo" class="h-12 w-auto hidden dark:block" />
      </div>

      <div>
        <p>© {{ new Date().getFullYear() }} SuitOps Hire. Tous droits réservés.</p>
      </div>

      <!-- Liens sociaux -->
      <div class="mt-4 space-x-4 flex justify-center sm:justify-start">
        <span v-if="socialLoading" class="text-sm">Chargement des liens sociaux...</span>
        <span v-else-if="socialError" class="text-critique text-sm">Erreur lors du chargement.</span>
        <div v-else class="flex items-center gap-4">
          <a v-for="item in socialLinks" :key="item.name" :href="item.href"
            class="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            target="_blank" rel="noopener">
            <span class="sr-only">{{ item.name }}</span>
            <component :is="item.icon" class="h-6 w-6" aria-hidden="true" v-if="item.icon" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { IconHome, IconArrowLeft, IconArrowRight } from '@tabler/icons-vue'

const router = useRouter()

// Réseaux sociaux
const { filteredLinks: socialLinks, error: socialError, isLoading: socialLoading } =
  await useSocialLinks(['Facebook', 'LinkedIn', 'Youtube'])

// SEO
useHead({
  title: 'Erreur 404',
  meta: [{ name: 'description', content: 'Page introuvable.' }]
})

definePageMeta({
  layout: false
})
</script>
