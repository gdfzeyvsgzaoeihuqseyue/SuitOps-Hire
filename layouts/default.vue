<template>
  <div>
    <header class="fixed top-0 inset-x-0 bg-white shadow-md z-50">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 hover:scale-105 overflow-hidden transition-all duration-300">
          <div class="hidden lg:block">
            <img :src="sharedFiles.paths.logo.dc" alt="Logo" class="h-8 w-auto sm:h-10 lg:h-12 dark:hidden" />
            <img :src="sharedFiles.paths.logo.dw" alt="Logo" class="h-8 w-auto sm:h-10 lg:h-12 hidden dark:block" />
          </div>
          <div class="lg:hidden flex-shrink-0 mr-3">
            <img :src="sharedFiles.paths.logo.mc" alt="Logo" class="h-8 w-auto sm:h-10 dark:hidden" />
            <img :src="sharedFiles.paths.logo.mw" alt="Logo" class="h-8 w-auto sm:h-10 hidden dark:block" />
          </div>
        </NuxtLink>

        <div class="hidden lg:flex items-center space-x-4 gap-8">
          <NuxtLink to="/offer" class="text-gray-700 hover:text-primary transition-colors duration-200">Offres
          </NuxtLink>
          <NuxtLink to="/blog" class="text-gray-700 hover:text-primary transition-colors duration-200">Articles
          </NuxtLink>

          <div v-if="isAuthenticated">
            <div class="relative">
              <button @click="toggleProfileMenu" class="flex items-center gap-2 focus:outline-none">
                <img class="h-8 w-8 rounded-full ring-2 ring-primary ring-offset-2" :src="userAvatar"
                  :alt="userInitials" />
              </button>
              <div v-if="showProfileMenu"
                class="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200 origin-top-right animate-fade-in-down">
                <NuxtLink to="/dashboard/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Mon profil
                </NuxtLink>
                <button @click="logout"
                  class="w-full text-left block px-4 py-2 text-sm text-critique hover:bg-critique/10 transition-colors duration-200">
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            <NuxtLink to="/dashboard"
              class="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200">
              Espace candidat
            </NuxtLink>
          </div>
        </div>

        <div class="lg:hidden flex items-center">
          <button @click="toggleMobileMenu"
            class="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
            <span class="sr-only">Ouvrir le menu principal</span>
            <IconMenuDeep v-if="!showMobileMenu" class="h-6 w-6" />
            <IconXboxX v-else class="h-6 w-6" />
          </button>
        </div>
      </nav>

      <transition name="slide-in-left">
        <div v-if="showMobileMenu" @click.self="closeMobileMenu"
          class="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-start">
          <div
            class="bg-white w-3/4 sm:w-1/2 h-full shadow-lg flex flex-col items-center py-8 px-4 relative animate-slide-right">
            <div class="absolute top-4 left-4"> <button @click="closeMobileMenu"
                class="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                <span class="sr-only">Fermer le menu</span>
                <IconX class="w-6 h-6" />
              </button>
            </div>
            <NuxtLink to="/offer"
              class="text-gray-800 hover:text-primary text-xl font-semibold mb-4 w-full text-center py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
              @click="closeMobileMenu">Offres</NuxtLink>
            <NuxtLink to="/blog"
              class="text-gray-800 hover:text-primary text-xl font-semibold mb-6 w-full text-center py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
              @click="closeMobileMenu">Articles</NuxtLink>

            <div v-if="isAuthenticated" class="flex flex-col items-center space-y-4 w-full">
              <button @click="toggleProfileMenu" class="flex items-center gap-2 focus:outline-none">
                <img class="h-12 w-12 rounded-full ring-2 ring-primary ring-offset-2" :src="userAvatar"
                  :alt="userInitials" />
                <span class="text-lg font-medium text-gray-800">{{ user?.firstName || 'Utilisateur' }}</span>
              </button>
              <div v-if="showProfileMenu"
                class="w-full rounded-md bg-white shadow-inner border border-gray-100 text-center mt-2 p-2 animate-fade-in-down">
                <NuxtLink to="/dashboard/profile"
                  class="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  @click="closeMobileMenu">
                  Mon profil
                </NuxtLink>
                <button @click="logoutAndCloseMenu"
                  class="w-full text-left block px-4 py-2 text-base text-critique hover:bg-critique/10 transition-colors duration-200">
                  Déconnexion
                </button>
              </div>
            </div>
            <div v-else class="mt-4 w-full">
              <NuxtLink to="/dashboard" @click="closeMobileMenu"
                class="block w-full text-center rounded-md bg-primary px-4 py-3 text-lg font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200">
                Espace candidat
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </header>

    <!-- Notification -->
    <SiteNotificationManager />

    <main class="pt-20">
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <AppFooter />
    <GlobalFeedbackButton />
  </div>
</template>

<script setup lang="ts">
import { IconXboxX, IconMenuDeep, IconX } from '@tabler/icons-vue';
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useSharedFiles } from '~/stores/sharedFiles';

const sharedFiles = useSharedFiles();
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const showProfileMenu = ref(false)
const showMobileMenu = ref(false)

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

// Fonctions pour la gestion du menu mobile
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  // Ferme le menu de profil si le menu mobile est ouvert
  if (showMobileMenu.value) {
    showProfileMenu.value = false;
  }
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
  showProfileMenu.value = false // Ferme également le menu de profil si ouvert
}

const logoutAndCloseMenu = () => {
  logout();
  closeMobileMenu();
}
</script>

<style scoped>
/* Animations pour le menu mobile */
/* Changement de `slide-in` à `slide-in-left` pour la transition Vue */
.slide-in-left-enter-active,
.slide-in-left-leave-active {
  transition: opacity 0.3s ease;
}

.slide-in-left-enter-from,
.slide-in-left-leave-to {
  opacity: 0;
}

/* Changement de `slideLeft` à `slideRight` pour l'animation Tailwind */
.animate-slide-right {
  animation: slideRight 0.3s ease-out;
}

/* Définition de l'animation pour le panneau venant de la gauche */
@keyframes slideRight {
  from {
    transform: translateX(-100%);
    /* Commence à -100% (hors de l'écran à gauche) */
  }

  to {
    transform: translateX(0);
    /* Termine à 0 (position normale) */
  }
}

/* Animation pour le menu déroulant du profil */
.animate-fade-in-down {
  animation: fadeInDown 0.2s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Styles pour le pied de page (inchangés ou légèrement améliorés) */
.footerLink {
  @apply text-gray-600 hover:text-gray-900 transition-colors duration-200;
}

.footerTitle {
  @apply font-bold text-gray-800 leading-6 uppercase;
}
</style>