<template>
  <div>
    <!-- Header -->
    <header class="fixed top-0 inset-x-0 bg-white shadow z-50">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <NuxtLink to="/" class="flex items-center gap-2 hover:scale-105 overflow-hidden transition-all duration-300">
            <!-- Desktop Logo -->
            <div class="hidden lg:block">
              <img src="/img/logoDeskCol.png" alt="Logo Desktop" class="h-8 w-auto sm:h-10 lg:h-12 dark:hidden" />
              <img src="/img/logoDeskWhite.png" alt="Logo Desktop Dark" class="h-8 w-auto sm:h-10 lg:h-12 hidden dark:block" />
            </div>
            <!-- Mobile Logo -->
            <div class="lg:hidden flex-shrink-0 mr-3">
              <img src="/img/logoMobCol.png" alt="Logo Desktop" class="h-8 w-auto sm:h-10 lg:h-12 dark:hidden" />
              <img src="/img/logoMobWhite.png" alt="Logo Desktop Dark" class="h-8 w-auto sm:h-10 lg:h-12 hidden dark:block" />
            </div>
          </NuxtLink>

          <div class="flex items-center space-x-4 gap-8">
            <NuxtLink to="/offer" class="text-gray-700 hover:text-primary">Offres</NuxtLink>
            <NuxtLink to="/blog" class="text-gray-700 hover:text-primary">Articles</NuxtLink>

            <div v-if="isAuthenticated">
              <div class="relative">
                <button @click="toggleProfileMenu" class="flex items-center gap-2">
                  <img class="h-8 w-8 rounded-full" :src="userAvatar" :alt="userInitials" />
                </button>
                <div v-if="showProfileMenu"
                  class="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200">
                  <NuxtLink to="/dashboard/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mon profil
                  </NuxtLink>
                  <button @click="logout"
                    class="w-full text-left block px-4 py-2 text-sm text-critique hover:bg-critique/10">
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
            <div v-else>
              <NuxtLink to="/dashboard"
                class="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Espace candidat
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main -->
    <main class="pt-20">
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-neutral-200">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="lg:col-span-2">
            <h3 class="footerTitle">PGS Hire</h3>
            <p class="mt-4">La simplicité au service de votre carrière.</p>

            <div class="mt-4 space-x-4 flex">
              <span v-if="socialLoading" class="text-sm">Chargement des liens sociaux...</span>
              <span v-else-if="socialError" class="text-critique text-sm">Erreur lors du chargement.</span>
              <div v-else class="flex items-center gap-4">
                <a v-for="item in socialLinks" :key="item.name" :href="item.href"
                  class="text-sm leading-6 hover:text-gray-900" target="_blank" rel="noopener">
                  <span class="sr-only">{{ item.name }}</span>
                  <component :is="item.icon" class="h-6 w-6" aria-hidden="true" v-if="item.icon" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 class="footerTitle">Navigation</h3>
            <ul role="list" class="mt-6 space-y-4">
              <li>
                <NuxtLink to="/blog" class="footerLink">Blog</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/#" class="footerLink">Réccruter</NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="footerTitle">Documentations</h3>
            <ul role="list" class="mt-6 space-y-4">
              <li>
                <NuxtLink to="/#" class="footerLink">Candidats</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/#" class="footerLink">Récruteur</NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex items-center border-t border-gray-700 mt-8 pt-8 justify-around text-center text-gray-400">
          <div>
            <p>&copy; {{ new Date().getFullYear() }} PGS Hire. Tous droits réservés.</p>
          </div>

          <div>
            <p class="font-mono">
              par <span
                class="mx-2 bg-transparent text-xs font-bold p-1 rounded-lg inline-block border border-gray-50/30 hover:bg-blue-100 hover:text-blue-600 transition-all">
                <NuxtLink to="https://progestionsoft.org" target="_blank">PRO GESTION SOFT SARL</NuxtLink>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const { filteredLinks: socialLinks, error: socialError, isLoading: socialLoading } =
  await useSocialLinks(['Facebook', 'LinkedIn', 'Youtube'])

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const showProfileMenu = ref(false)

const userInitials = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName?.charAt(0) || ''}${user.value.lastName?.charAt(0) || ''}`
})

const userAvatar = computed(() => {
  const userAny: any = user.value;
  return userAny?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${userInitials.value}`
})

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const logout = () => {
  authStore.logout()
  showProfileMenu.value = false
}
</script>

<style scoped>
.footerLink {
  @apply leading-6 hover:text-gray-600
}

.footerTitle {
  @apply font-semibold leading-6 uppercase
}
</style>