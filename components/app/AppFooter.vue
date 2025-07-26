<template>
  <footer class="py-6 sm:py-8 mt-8 bg-WtBAct mt-auto border-t">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="flex flex-col lg:flex-row justify-between items-start">
        <!-- Gauche : Info -->
        <div class="w-full mb-6 sm:mb-8 text-center sm:text-left border-b sm:border-none pb-6 sm:pb-0 px-0 sm:px-8">
          <div class="flex justify-center sm:justify-start items-center">
            <span class="font-bold text-lg">HIRE</span>
          </div>
          <p class="mt-2 text-sm sm:text-base">La simplicité au service de votre carrière.</p>

          <!-- Liens sociaux -->
          <div class="mt-4 space-x-4 flex justify-center">
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
          <p class="text-xs sm:text-sm mt-3 sm:mt-2">
            &copy; {{ new Date().getFullYear() }} SuitOps Hire. Tous droits réservés.
          </p>
        </div>

        <!-- Droit : Navigation -->
        <div class="w-full mt-4 sm:mt-0">
          <div class="grid grid-cols-2 gap-6 sm:gap-8 sm:grid-cols-4 px-6">
            <div v-for="section in navSections" :key="section.title" class="mb-4 sm:mb-0">
              <h3 class="text-xs sm:text-sm font-semibold mb-2 uppercase">{{ section.title }}</h3>
              <ul class="space-y-1 text-xs sm:text-sm">
                <li v-for="link in section.links" :key="link.name">
                  <component :is="link.disabled ? 'span' : link.external ? 'a' : NuxtLink"
                    :href="!link.disabled && link.external ? link.to : undefined"
                    :to="!link.disabled && !link.external ? (link.to) : undefined"
                    :target="!link.disabled && link.external ? '_blank' : undefined"
                    :class="[link.disabled ? 'not-link' : 'hover:text-primary', 'py-1 block']"
                    :title="link.disabled ? `${link.name} est indisponible pour le moment` : undefined">
                    {{ link.name }}
                  </component>
                </li>
              </ul>
            </div>
          </div>

          <!-- Copyright -->
          <div
            class="flex flex-col sm:flex-row items-center border-t mt-4 pt-4 justify-center md:justify-end sm:justify-around text-center">
            <p class="font-mono text-xs sm:text-sm">
              par
              <span
                class="mx-1 sm:mx-2 bg-transparent text-xs font-bold p-1 rounded-lg inline-block border border-textClr hover:bg-ash hover:text-primary transition-all">
                <a href="https://progestionsoft.org" target="_blank" class="px-1">PRO GESTION SOFT</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

// Sections de navigation 
const navSections: any[] = [
  {
    title: 'Navigation',
    links: [
      { name: 'Blog', to: '/blog' },
      { name: 'Réccruter', to: 'https://web-suitops.netlify.app' }
    ]
  },
  {
    title: 'Documentations',
    links: [
      { name: 'Candidats', to: '', disabled: true },
      { name: 'Récruteur', to: '', disabled: true }
    ]
  }
]

// Réseaux sociaux
const { filteredLinks: socialLinks, error: socialError, isLoading: socialLoading } =
  await useSocialLinks(['Facebook', 'LinkedIn', 'Youtube'])
</script>

<style scoped>
.not-link {
  @apply text-gray-400/40 cursor-not-allowed opacity-40;
}
</style>