<template>
  <main class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header :class="[
      'fixed top-0 z-50 bg-white shadow h-16 flex items-center px-4 transition-all duration-300 px-8',
      isCollapsed ? 'ml-20 w-[calc(100%-5rem)]' : 'ml-64 w-[calc(100%-16rem)]'
    ]">
      <!-- Logo -->
      <div :class="isCollapsed ? 'max-w-full  mr-4' : 'max-w-0'">
        <NuxtLink to="/" class="flex items-center gap-2 hover:scale-105 overflow-hidden transition-all duration-300">
          <!-- Desktop Logo -->
          <div class="hidden lg:block">
            <img src="/img/logoDeskCol.png" alt="Logo Desktop" class="h-8 w-auto dark:hidden" />
            <img src="/img/logoDeskWhite.png" alt="Logo Desktop Dark" class="h-8 w-auto hidden dark:block" />
          </div>
          <!-- Mobile Logo -->
          <div class="lg:hidden flex-shrink-0 mr-3">
            <img src="/img/logoMobCol.png" alt="Logo Desktop" class="h-8 w-auto dark:hidden" />
            <img src="/img/logoMobWhite.png" alt="Logo Desktop Dark" class="h-8 w-auto hidden dark:block" />
          </div>
        </NuxtLink>
      </div>

      <!-- Barre de recherche -->
      <div class="hidden md:block w-2/3">
        <div class="relative">
          <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input v-model="globalSearchQuery" type="text" placeholder="Rechercher sur tout le site..."
            class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
      </div>

      <!-- Boutons de notifications et profil -->
      <section class="flex items-center gap-4 ml-auto space-x-2">
        <div class="flex items-center gap-4">
          <button @click="$router.push('/dashboard/notification')" type="button"
            class="relative rounded-full text-gray-400 hover:text-gray-500">
            <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            <IconBell class="h-6 w-6" />
          </button>
        </div>

        <!-- Menu Profil -->
        <div class="relative">
          <button @click="toggleProfileMenu" class="flex rounded-full focus:outline-none">
            <img class="h-8 w-8 rounded-full" :src="userAvatar" :alt="userInitials" />
          </button>
          <div v-if="showProfileMenu"
            class="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200">
            <div class="border-b">
              <NuxtLink to="/dashboard/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeProfileMenu">
                Mon profil
              </NuxtLink>
              <NuxtLink to="/dashboard/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeProfileMenu">
                Paramètres
              </NuxtLink>
            </div>
            <button @click="handleLogout"
              class="w-full text-left block px-4 py-2 text-sm text-critique hover:bg-critique/10">
              Déconnexion
            </button>
          </div>
        </div>
      </section>
    </header>

    <!-- Sidebar -->
    <aside :class="[
      'fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 flex flex-col h-full z-40',
      isCollapsed ? 'w-20' : 'w-64'
    ]">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between border-b px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2 hover:scale-105 overflow-hidden transition-all duration-300"
          :class="isCollapsed ? 'max-w-0' : 'max-w-full'">
          <!-- Desktop Logo -->
          <div class="hidden lg:block">
            <img src="/img/logoDeskCol.png" alt="Logo Desktop" class="h-8 w-auto dark:hidden" />
            <img src="/img/logoDeskWhite.png" alt="Logo Desktop Dark" class="h-8 w-auto hidden dark:block" />
          </div>
          <!-- Mobile Logo -->
          <div class="lg:hidden flex-shrink-0 mr-3">
            <img src="/img/logoMobCol.png" alt="Logo Desktop" class="h-8 w-auto dark:hidden" />
            <img src="/img/logoMobWhite.png" alt="Logo Desktop Dark" class="h-8 w-auto hidden dark:block" />
          </div>
        </NuxtLink>
        <button @click="toggleSidebar" class="p-2 hover:bg-gray-100 rounded-full focus:outline-none">
          <component :is="isCollapsed ? IconMenu2 : IconMenuDeep" class="h-6 w-6 text-gray-600"
            :title="isCollapsed ? 'Dérouler' : 'Réduire'" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-5 px-2 space-y-1 flex-1">
        <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" :title="item.label"
          class="group flex items-center p-2 text-base font-medium rounded-md transition-colors" :class="route.path === item.path
            ? 'bg-bgClr text-primary'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
          <component :is="item.icon" class="h-6 w-6" :class="isCollapsed ? 'mx-auto' : 'mr-3'" />
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer Sidebar -->
      <div v-if="!isCollapsed" class="border-t p-4 bg-bgClr space-y-4">
        <!-- Liens utiles -->
        <div class="text-sm mb-3 grid grid-cols-1 md:grid-cols-2 gap-2 border-b border-primary pb-4">
          <div v-for="link in footerLinks" :key="link.name">
            <a v-if="link.external" :href="link.path" class="hover:text-primary" target="_blank"
              rel="noopener noreferrer">
              {{ link.label }}
            </a>
            <NuxtLink v-else :to="link.path" class="hover:text-primary">
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Réseaux sociaux -->
        <div class="flex justify-center space-x-4">
          <span v-if="socialLoading" class="text-gray-400 text-sm">Chargement des liens sociaux...</span>
          <span v-else-if="socialError" class="text-red-400 text-sm">Erreur lors du chargement.</span>
          <div v-else class="flex items-center gap-4">
            <a v-for="item in socialLinks" :key="item.name" :href="item.href"
              class="text-sm leading-6 hover:text-primary" target="_blank" rel="noopener">
              <span class="sr-only">{{ item.name }}</span>
              <component :is="item.icon" class="h-5 w-5" aria-hidden="true" v-if="item.icon" />
            </a>
          </div>
        </div>

        <!-- Auteur -->
        <div class="py-4 border-y border-primary">
          <p class="font-mono">
            par <span
              class="mx-2 bg-transparent text-xs font-bold p-1 rounded-lg inline-block border border-gray-50/30 hover:bg-blue-100 hover:text-blue-600 transition-all">
              <NuxtLink to="https://progestionsoft.org" target="_blank">PRO GESTION SOFT SARL</NuxtLink>
            </span>
          </p>
        </div>

        <!-- Copyright -->
        <div class="text-center mt-2">
          <p>&copy; {{ new Date().getFullYear() }} PGS Hire. Tous droits réservés.</p>
        </div>
      </div>
    </aside>

    <!-- Contenu principal -->
    <div :class="[isCollapsed ? 'ml-20' : 'ml-64']" class="pt-16 p-8">
      <slot />
    </div>

    <!-- Modal de résultats de recherche -->
    <div v-if="isSearchModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg w-11/12 md:w-1/2 shadow-lg">
        <div class="flex items-center justify-between border-b px-4 py-2">
          <h3 class="text-lg font-medium">Résultats de recherche</h3>
          <button @click="clearSearch" class="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div class="p-4 max-h-96 overflow-y-auto">
          <ul v-if="filteredSearchResults.length">
            <li v-for="result in filteredSearchResults" :key="result.id"
              class="border-b py-2 hover:bg-gray-50 cursor-pointer" @click="selectSearchResult(result)">
              <p class="font-semibold">{{ result.title }}</p>
              <p class="text-sm text-gray-600">{{ result.description }}</p>
            </li>
          </ul>
          <div v-else class="text-center text-gray-500">
            Aucun résultat trouvé.
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
  return userAny?.value?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${userInitials.value}`
})

// État sidebar
const isCollapsed = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
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
</script>
