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
          <ul role="list" class="flex justify-center sm:justify-start space-x-4">
            <SocialCustomLink />
          </ul>
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
            <p class="font-mono text-xs sm:text-sm flex items-center">
              par
              <span
                class="mx-1 sm:mx-2 inline-flex items-center gap-2 px-2 py-1 rounded-full bg-transparent text-xs font-bold p-1 inline-block border border-textClr hover:bg-blue-100 hover:text-primary transition-all">
                <!-- Logo PGS -->
                <div
                  class="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 overflow-hidden border border-gray-300">
                  <img :src="sharedFiles.paths.logo.pgs" alt="PGS" class="w-4 h-4 object-contain" />
                </div>

                <!-- Marque -->
                <a :href="footerData?.brandUrl" target="_blank">{{ footerData?.brand }}</a>
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
import { useSharedFiles } from '~/stores/sharedFiles';

const sharedFiles = useSharedFiles();

// Récupérer les données du footer depuis le store
type FooterData = { brand: string; brandUrl: string }
const { data: footerData, pending, error } = await useAsyncData<FooterData>(
  'footerData',
  () => sharedFiles.getFooterData()
)

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
</script>

<style scoped>
.not-link {
  @apply text-gray-400/40 cursor-not-allowed opacity-40;
}
</style>