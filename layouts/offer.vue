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
        <NuxtLink to="/"
          class="flex items-center justify-center hover:scale-105 hover:opacity-80 transition-transform duration-300">
          <img :src="sharedFiles.paths.logo.mc" alt="Logo" class="h-8 w-auto dark:hidden" />
          <img :src="sharedFiles.paths.logo.mw" alt="Logo" class="h-8 w-auto hidden dark:block" />
        </NuxtLink>
      </div>

      <h1 class="text-base lg:text-lg font-semibold text-gray-700 truncate flex-1">
        {{ pageTitle }}
      </h1>

      <section class="flex items-center gap-2 lg:gap-4 ml-auto">
        <template v-if="isAuthenticated">
          <button @click="$router.push('/dashboard/notification')" type="button"
            class="relative rounded-full text-gray-600 hover:text-primary p-2 transition-colors duration-200">
            <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            <IconBell class="h-5 w-5" />
          </button>

          <div class="relative">
            <button @click="toggleProfileMenu"
              class="flex rounded-full focus:outline-none ring-2 ring-transparent hover:ring-primary ring-offset-2 transition-all duration-200">
              <img class="h-8 w-8 rounded-full" :src="userAvatar" :alt="userInitials" />
            </button>

            <div v-if="showProfileMenu"
              class="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200 z-50 origin-top-right animate-fade-in-down">
              <div class="border-b border-gray-100">
                <NuxtLink to="/dashboard/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  @click="closeProfileMenu">
                  Mon profil
                </NuxtLink>
                <NuxtLink to="/dashboard/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  @click="closeProfileMenu">
                  Paramètres
                </NuxtLink>
              </div>

              <div class="border-b border-gray-100">
                <NuxtLink to="/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  @click="closeProfileMenu">
                  Tableau de bord
                </NuxtLink>
                <NuxtLink to="/dashboard/applications"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  @click="closeProfileMenu">
                  Mes candidatures
                </NuxtLink>
              </div>

              <button @click="logout"
                class="w-full text-left block px-4 py-2 text-sm text-critique hover:bg-critique/10 transition-colors duration-200">
                Déconnexion
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <NuxtLink to="/auth/login"
            class="rounded-md bg-primary px-2 py-1.5 lg:px-3.5 lg:py-2.5 text-xs lg:text-sm font-semibold text-white shadow-sm hover:bg-secondary transition-all duration-200">
            Connexion
          </NuxtLink>
        </template>
      </section>
    </header>

    <div v-if="isMobileSidebarOpen" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="closeMobileSidebar">
    </div>

    <aside class="fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 flex flex-col z-50" :class="[
      isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
      isCollapsed ? 'lg:w-20' : 'lg:w-64',
      'w-64'
    ]">

      <div class="flex items-center justify-between border-b px-4 py-3 h-16">
        <NuxtLink to="/"
          class="flex items-center justify-center hover:scale-105 hover:opacity-80 transition-transform duration-300"
          :class="isCollapsed ? 'lg:max-w-0 lg:overflow-hidden opacity-0' : 'lg:max-w-full opacity-100'">
          <img :src="sharedFiles.paths.logo.dc" alt="Logo" class="h-8 w-auto dark:hidden" />
          <img :src="sharedFiles.paths.logo.dw" alt="Logo" class="h-8 w-auto hidden dark:block" />
        </NuxtLink>

        <button @click="toggleSidebar" class="hidden lg:block p-2 hover:bg-gray-100 rounded-full focus:outline-none">
          <component :is="isCollapsed ? IconMenu2 : IconMenuDeep" class="h-6 w-6 text-gray-600" />
        </button>

        <button @click="closeMobileSidebar" class="lg:hidden p-2 hover:bg-gray-100 rounded-full focus:outline-none">
          <IconMenuDeep class="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <nav class="mt-5 px-2 space-y-1 flex-1 overflow-y-auto pb-4">
        <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" :title="item.label"
          class="group flex items-center p-2 text-sm rounded-lg transition-colors duration-200" :class="route.path === item.path
            ? 'bg-primary/10 text-primary font-medium' // Adjusted active state color
            : 'text-gray-700 hover:bg-gray-50'" @click="closeMobileSidebar">
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0"
            :class="isCollapsed && !isMobileSidebarOpen ? 'lg:mx-auto' : 'mr-3'" />
          <span v-show="!isCollapsed || isMobileSidebarOpen" class="text-sm text-gray-700 truncate">
            {{ item.label }}
          </span>
          <span v-if="item.count !== undefined" v-show="!isCollapsed || isMobileSidebarOpen"
            class="ml-auto text-xs text-gray-500 flex-shrink-0">
            ({{ item.count.value }})
          </span>
        </NuxtLink>
      </nav>

      <div v-show="!isCollapsed || isMobileSidebarOpen"
        class="border-t border-gray-700 p-4 bg-gray-800 text-gray-400 space-y-4">
        <div class="text-sm mb-3 grid grid-cols-1 gap-2 border-b border-gray-700 pb-4">
          <div v-for="link in footerLinks" :key="link.name">
            <a v-if="link.external" :href="link.path" class="hover:text-white text-xs transition-colors duration-200"
              target="_blank" rel="noopener noreferrer">
              {{ link.label }}
            </a>
            <NuxtLink v-else :to="link.path" class="hover:text-white text-xs transition-colors duration-200">
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Liens sociaux -->
        <ul role="list" class="flex justify-center sm:justify-start space-x-4">
          <SocialLink />
        </ul>

        <div class="py-3 border-y border-gray-700">
          <p class="font-mono text-xs text-center">
            par <span
              class="mx-1 bg-transparent text-xs font-bold p-1 rounded-lg inline-block border border-gray-50/30 hover:bg-blue-100 hover:text-blue-600 transition-all">
              <a :href="footerData?.brandUrl" target="_blank">{{ footerData?.brand }}</a>
            </span>
          </p>
        </div>

        <div class="text-center">
          <p class="text-xs">&copy; {{ new Date().getFullYear() }} SuitOps Hire. Tous droits réservés.</p>
        </div>
      </div>
    </aside>

    <!-- Notification -->
    <SiteNotificationManager />

    <div class="pt-16 p-4 lg:p-8 transition-all duration-300" :class="[
      isCollapsed ? 'lg:ml-20' : 'lg:ml-64',
      'ml-0'
    ]">
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useJobsStore } from '~/stores/jobs'
import { storeToRefs } from 'pinia'
import { IconBell, IconLayoutDashboard, IconMapPin, IconBuilding, IconThumbUp, IconSettings, IconMenu2, IconMenuDeep } from '@tabler/icons-vue'
import { useSharedFiles } from '~/stores/sharedFiles';

const sharedFiles = useSharedFiles();
const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const jobsStore = useJobsStore()
const { jobs } = storeToRefs(jobsStore)

// Récupérer les données du footer depuis le store
type FooterData = { brand: string; brandUrl: string }
const { data: footerData, pending, error } = await useAsyncData<FooterData>(
  'footerData',
  () => sharedFiles.getFooterData()
)

const userInitials = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName?.charAt(0) || ''}${user.value.lastName?.charAt(0) || ''}`
})

const userAvatar = computed(() => {
  const userAny: any = user.value;
  return userAny?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${userInitials.value}`
})

// Majuscule seulement la première lettre de chaque mot
const capitalizeWords = (str: string): string => {
  return str.split(' ').map(word => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
    return word
  }).join(' ')
}

// Titre dynamique
const pageTitle = computed(() => {
  const matchedItem = navItems.find(item => item.path === route.path)
  if (matchedItem) return matchedItem.label

  const parts = route.path.split('/').filter(part => part !== '')
  if (parts.length === 0) return 'Page inconnue'

  const decoded = decodeURIComponent(parts[parts.length - 1]).replace(/-/g, ' ')
  return capitalizeWords(decoded)
})

// État sidebar desktop
const isCollapsed = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// État sidebar mobile
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
const logout = () => {
  authStore.logout()
  router.push('/')
}

// --- Fonctions de Normalisation pour les Compteurs ---
const normalizeLocation = (location: string) => {
  let cleaned = location.trim().split(',')[0].trim();
  return cleaned.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Calcul des compteurs pour chaque catégorie de navigation
const getAllOffersCount = computed(() => jobs.value.length)

const getCompanyOffersCount = computed(() => {
  const uniqueCompanyIds = new Set<number>();
  jobs.value.forEach(job => {
    const company = job.company as any;
    if (company?.id) {
      uniqueCompanyIds.add(company.id);
    }
  });
  return uniqueCompanyIds.size;
});

// MODIFICATION ICI : Utilisation de la normalisation pour le compteur de lieux
const getLocationOffersCount = computed(() => {
  const uniqueLocations = new Set<string>();
  jobs.value.forEach(job => {
    if (job.location) {
      const normalized = normalizeLocation(job.location);
      if (normalized) {
        uniqueLocations.add(normalized);
      }
    }
  });
  return uniqueLocations.size;
});

// Liens de navigation avec les compteurs
const navItems = [
  { path: '/offer', label: 'Toutes les offres', icon: IconLayoutDashboard, count: getAllOffersCount },
  { path: '/offer/company', label: 'Entreprises', icon: IconBuilding, count: getCompanyOffersCount },
  { path: '/offer/location', label: 'Lieux', icon: IconMapPin, count: getLocationOffersCount }, // Mis à jour
  { path: '/offer/suggestions', label: 'Recommandations', icon: IconThumbUp },
  { path: '/offer/preference', label: 'Préférences', icon: IconSettings },
]

const footerLinks = [
  { name: 'rgpd', label: 'RGPD', path: '/rgpd', external: false },
  { name: 'cgu', label: 'CGU', path: '/cgu', external: false },
  { name: 'blog', label: 'Blog', path: '/blog', external: false },
  { name: 'doc', label: 'Documentation', path: 'https://pgsdocs.netlify.app/docs/category/pour-les-candidats', external: true }
]

const globalSearchQuery = ref('')
const isSearchModalOpen = ref(false)
watch(globalSearchQuery, (newQuery) => {
  isSearchModalOpen.value = newQuery.trim().length > 0
})

// Fermer les menus quand on change de route
watch(route, () => {
  closeMobileSidebar()
  closeProfileMenu()
})

// Assurez-vous que les jobs sont chargés au montage du layout si nécessaire pour les compteurs
onMounted(() => {
  if (!jobs.value || jobs.value.length === 0) {
    jobsStore.fetchJobs()
  }
})
</script>

<style scoped>
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
</style>
