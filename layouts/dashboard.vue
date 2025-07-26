<template>
  <main class="min-h-screen bg-gray-100 flex flex-col">
    <header :class="[
      'fixed top-0 right-0 bg-white shadow z-50 flex items-center px-4 transition-all duration-300 h-16',
      // Sur les écrans larges (lg), la largeur du header dépend de l'état de la sidebar
      isCollapsed ? 'lg:ml-20 lg:w-[calc(100%-5rem)]' : 'lg:ml-64 lg:w-[calc(100%-16rem)]',
      // Sur les petits écrans (mobile/tablet), le header prend toute la largeur
      'w-full'
    ]">
      <button @click="toggleMobileSidebar" class="lg:hidden p-2 hover:bg-gray-100 rounded-full focus:outline-none mr-3">
        <IconMenu2 class="h-6 w-6 text-gray-600" />
      </button>

      <div class="lg:hidden flex-shrink-0 mr-3">
        <NuxtLink to="/" class="flex items-center justify-center hover:scale-105 hover:opacity-80 transition-transform duration-300">
          <img src="/img/logoMobCol.png" alt="Logo Mobile" class="h-8 w-auto dark:hidden" />
          <img src="/img/logoMobWhite.png" alt="Logo Mobile Dark" class="h-8 w-auto hidden dark:block" />
        </NuxtLink>
      </div>

      <div class="hidden md:block w-2/3 max-w-lg"> <div class="relative">
          <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input v-model="globalSearchQuery" type="text" placeholder="Rechercher sur tout le site..."
            class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" />
        </div>
      </div>

      <section class="flex items-center gap-2 lg:gap-4 ml-auto"> <div class="flex items-center gap-4">
          <button @click="$router.push('/dashboard/notification')" type="button"
            class="relative rounded-full text-gray-600 hover:text-primary p-2 transition-colors duration-200">
            <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            <IconBell class="h-5 w-5" />
          </button>
        </div>

        <div class="relative">
          <button @click="toggleProfileMenu" class="flex rounded-full focus:outline-none ring-2 ring-transparent hover:ring-primary ring-offset-2 transition-all duration-200">
            <img class="h-8 w-8 rounded-full" :src="userAvatar" :alt="userInitials" />
          </button>
          <div v-if="showProfileMenu"
            class="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200 z-50 origin-top-right animate-fade-in-down">
            <div class="border-b border-gray-100">
              <NuxtLink to="/dashboard/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                @click="closeProfileMenu">
                Mon profil
              </NuxtLink>
              <NuxtLink to="/dashboard/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                @click="closeProfileMenu">
                Paramètres
              </NuxtLink>
            </div>
            <button @click="handleLogout"
              class="w-full text-left block px-4 py-2 text-sm text-critique hover:bg-critique/10 transition-colors duration-200">
              Déconnexion
            </button>
          </div>
        </div>
      </section>
    </header>

    <div v-if="isMobileSidebarOpen" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="closeMobileSidebar">
    </div>

    <aside class="fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 flex flex-col z-50" :class="[
      // Mobile behavior: slides in from left or is hidden off-screen
      isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      // Desktop behavior: width depends on isCollapsed state
      'lg:translate-x-0', // Always visible on desktop
      isCollapsed ? 'lg:w-20' : 'lg:w-64',
      // Default width for mobile (when open)
      'w-64'
    ]">
      <div class="flex items-center justify-between border-b px-4 py-3 h-16">
        <NuxtLink to="/" class="flex items-center justify-center hover:scale-105 hover:opacity-80 transition-transform duration-300"
          :class="isCollapsed ? 'lg:max-w-0 lg:overflow-hidden opacity-0' : 'lg:max-w-full opacity-100'">
          <img src="/img/logoDeskCol.png" alt="Logo Desktop" class="h-8 w-auto dark:hidden" />
          <img src="/img/logoDeskWhite.png" alt="Logo Desktop Dark" class="h-8 w-auto hidden dark:block" />
        </NuxtLink>
        <button @click="toggleSidebar" class="p-2 hover:bg-gray-100 rounded-full focus:outline-none hidden lg:block">
          <component :is="isCollapsed ? IconMenu2 : IconMenuDeep" class="h-6 w-6 text-gray-600"
            :title="isCollapsed ? 'Dérouler' : 'Réduire'" />
        </button>
        <button @click="closeMobileSidebar" class="lg:hidden p-2 hover:bg-gray-100 rounded-full focus:outline-none">
          <IconMenuDeep class="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <nav class="mt-5 px-2 space-y-1 flex-1 overflow-y-auto pb-4">
        <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" :title="item.label"
          class="group flex items-center p-2 text-base font-medium rounded-md transition-colors duration-200" :class="route.path === item.path
              ? 'bg-primary/10 text-primary' // Adjusted active state color
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
          <component :is="item.icon" class="h-6 w-6 flex-shrink-0"
            :class="isCollapsed && !isMobileSidebarOpen ? 'lg:mx-auto' : 'mr-3'" />
          <span v-show="!isCollapsed || isMobileSidebarOpen">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div v-show="!isCollapsed || isMobileSidebarOpen" class="border-t border-gray-700 p-4 bg-gray-800 text-gray-400 space-y-4">
        <div class="text-sm mb-3 grid grid-cols-1 gap-2 border-b border-gray-700 pb-4">
          <div v-for="link in footerLinks" :key="link.name">
            <a v-if="link.external" :href="link.path" class="hover:text-white text-xs transition-colors duration-200" target="_blank"
              rel="noopener noreferrer">
              {{ link.label }}
            </a>
            <NuxtLink v-else :to="link.path" class="hover:text-white text-xs transition-colors duration-200">
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex justify-center">
          <span v-if="socialLoading" class="text-gray-400 text-xs">Chargement des liens sociaux...</span>
          <span v-else-if="socialError" class="text-red-400 text-xs">Erreur lors du chargement.</span>
          <div v-else class="flex items-center gap-3">
            <a v-for="item in socialLinks" :key="item.name" :href="item.href"
              class="text-sm leading-6 hover:text-white transition-colors duration-200" target="_blank" rel="noopener">
              <span class="sr-only">{{ item.name }}</span>
              <component :is="item.icon" class="h-4 w-4" aria-hidden="true" v-if="item.icon" />
            </a>
          </div>
        </div>

        <div class="py-3 border-y border-gray-700">
          <p class="font-mono text-xs text-center">
            par <span
              class="mx-1 bg-transparent text-xs font-bold p-1 rounded-lg inline-block border border-gray-50/30 hover:bg-blue-100 hover:text-blue-600 transition-all">
              <NuxtLink to="https://progestionsoft.org" target="_blank">SuitOps</NuxtLink>
            </span>
          </p>
        </div>

        <div class="text-center">
          <p class="text-xs">&copy; {{ new Date().getFullYear() }} SuitOps Hire. Tous droits réservés.</p>
        </div>
      </div>
    </aside>

    <div class="pt-16 p-4 lg:p-8 transition-all duration-300" :class="[
      // Desktop only - margin shifts content based on sidebar collapse state
      isCollapsed ? 'lg:ml-20' : 'lg:ml-64',
      // No margin on mobile when sidebar is closed/open as it's an overlay
      'ml-0'
    ]">
      <slot />
    </div>

    <div v-if="isSearchModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div class="bg-white rounded-lg w-11/12 md:w-1/2 shadow-lg max-h-[80vh] flex flex-col animate-scale-in">
        <div class="flex items-center justify-between border-b px-4 py-3">
          <h3 class="text-lg font-medium">Résultats de recherche</h3>
          <button @click="clearSearch" class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none">&times;</button>
        </div>
        <div class="p-4 flex-1 overflow-y-auto">
          <ul v-if="filteredSearchResults.length">
            <li v-for="result in filteredSearchResults" :key="result.id"
              class="border-b border-gray-100 last:border-b-0 py-3 px-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200" @click="selectSearchResult(result)">
              <p class="font-semibold text-gray-800">{{ result.title }}</p>
              <p class="text-sm text-gray-600">{{ result.description }}</p>
            </li>
          </ul>
          <div v-else class="text-center text-gray-500 py-4">
            Aucun résultat trouvé pour "{{ globalSearchQuery }}".
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconBell, IconLayoutDashboard, IconBriefcase, IconFiles, IconMenu2, IconMenuDeep, IconSearch } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName?.charAt(0) || ''}${user.value.lastName?.charAt(0) || ''}`
})

const userAvatar = computed(() => {
  const userAny: any = user.value;
  return userAny?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${userInitials.value}`
})

// État sidebar desktop
const isCollapsed = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// État sidebar mobile (ajouté)
const isMobileSidebarOpen = ref(false)
const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}
const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

// État profil
const showProfileMenu = ref(false)
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}
const closeProfileMenu = () => {
  showProfileMenu.value = false
}
const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}

// Liens de navigation, liens footer et réseaux sociaux
const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: IconLayoutDashboard },
  { path: '/dashboard/applications', label: 'Candidatures', icon: IconBriefcase },
  { path: '/dashboard/documents', label: 'Documents', icon: IconFiles }
]

const { filteredLinks: socialLinks, error: socialError, isLoading: socialLoading } =
  await useSocialLinks(['Facebook', 'LinkedIn', 'Youtube'])

const footerLinks = [
  { name: 'rgpd', label: 'RGPD', path: '/rgpd', external: false },
  { name: 'cgu', label: 'CGU', path: '/cgu', external: false },
  { name: 'blog', label: 'Blog', path: '/blog', external: false },
  { name: 'doc', label: 'Documentation', path: 'https://pgsdocs.netlify.app/docs/category/pour-les-candidats', external: true }
]

// Recherche globale
const globalSearchQuery = ref('')
const isSearchModalOpen = ref(false)
watch(globalSearchQuery, (newQuery) => {
  isSearchModalOpen.value = newQuery.trim().length > 0
})

// Base de données statique pour la recherche
const siteData = ref([
  { id: 1, title: 'Accueil', description: 'Page d\'accueil du site', url: '/' },
  { id: 2, title: 'Offres', description: 'Toutes les offres d\'emploi disponibles', url: '/offer' },
  { id: 3, title: 'Tableau de bord', description: 'Accès à votre espace candidat', url: '/dashboard' },
  { id: 4, title: 'Profil', description: 'Gérer votre profil utilisateur', url: '/dashboard/profile' },
  { id: 5, title: 'Documents', description: 'Consulter et gérer vos documents', url: '/dashboard/documents' }
])
const filteredSearchResults = computed(() => {
  const query = globalSearchQuery.value.trim().toLowerCase()
  if (!query) return []
  return siteData.value.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  )
})
const selectSearchResult = (result: { url: string }) => {
  router.push(result.url)
  clearSearch()
}
const clearSearch = () => {
  globalSearchQuery.value = ''
  isSearchModalOpen.value = false
}

// Fermer les menus quand on change de route
watch(route, () => {
  closeMobileSidebar() // Ajouté pour fermer la sidebar mobile lors de la navigation
  closeProfileMenu()
  clearSearch() // Ajouté pour fermer la modal de recherche
})
</script>

<style scoped>
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

/* Animations pour la modal de recherche */
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
