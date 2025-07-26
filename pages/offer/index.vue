<template>
  <div class="flex relative mt-6">
    <!-- Contenu principal -->
    <main class="flex-1 p-6">
      <!-- Header -->
      <header class="mb-8 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Offres d'emploi</h1>
            <p class="text-gray-600">Toutes les offres ouvertes disponibles</p>
          </div>

          <button @click="refreshJobs"
            class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors">
            <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
              'animate-spin': isLoading,
              'group-hover:rotate-180': !isLoading
            }" />
            Actualiser les offres
          </button>
        </div>

        <!-- Filtres -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <!-- Barre de recherche -->
          <div class="w-full md:w-2/3">
            <div class="relative">
              <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input v-model="jobsStore.searchQuery" type="text"
                placeholder="Rechercher par poste, entreprise, lieu ou profile..."
                class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <!-- Filtres -->
          <div class="flex flex-col sm:flex-row items-start gap-4">
            <!-- Filtre par contrat -->
            <select v-model="selectedContract" class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary">
              <option value="">Tous les types de contrat</option>
              <option v-for="type in contractTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <!-- Trier -->
            <select v-model="sortOption" class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary">
              <option value="default">Tri par défaut</option>
              <option value="alpha-asc">A-Z</option>
              <option value="alpha-desc">Z-A</option>
              <option value="closingDateDesc">Clôture éloignée</option>
              <option value="closingDateAsc">Clôture prôche</option>
              <option value="placeNumberDesc">Plus de postes</option>
              <option value="placeNumberAsc">Moins de postes</option>
            </select>
          </div>
        </div>
      </header>

      <!-- État de chargement -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Recherche des offres...</p>
        </div>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
        <p class="text-red-700">{{ error }}</p>
        <button @click="refreshJobs" class="mt-2 text-red-600 hover:text-red-800 font-medium">
          Réessayer
        </button>
      </div>

      <!-- Message d'absence -->
      <div v-else-if="processedJobs.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="text-6xl mb-4">😕</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ jobsStore.searchQuery ? 'Aucun résultat trouvé' : 'Aucune offre disponible' }}
          </h3>
          <p class="text-gray-500">
            {{ jobsStore.searchQuery
              ? `Aucune offre ne correspond à "${jobsStore.searchQuery}"`
              : 'Revenez plus tard pour consulter nos nouvelles offres' }}
          </p>
        </div>
      </div>

      <!-- Liste des emplois -->
      <div v-else>
        <p class="text-gray-600 text-center my-6">
          {{ processedJobs.length }} offre{{ processedJobs.length > 1 ? 's' : '' }} active{{ processedJobs.length > 1 ?
            's' : '' }}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="job in paginatedJobs" :key="job.id"
            class="bg-white rounded-lg shadow p-6 relative transition-all duration-300"
            :class="{ 'blur-sm': isSidebarOpen && selectedJob?.id !== job.id }">
            <div class="mb-2">
              <span class="absolute top-1 right-[10%] -translate-y-1/2 px-3 py-1 text-xs font-medium rounded-full z-10"
                :class="getContractClass(job.contract)">
                {{ job.contract }}
              </span>
            </div>

            <!-- Badge modifiée -->
            <div class="mb-4">
              <div class="flex items-center justify-between">
                <div v-if="job.createdAt !== job.closingDate"
                  class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"
                  title="Cette offre a été modifiée récemment">
                  ✎ Modifiée
                </div>
              </div>

              <button @click="toggleSidebar(job)" class="absolute top-4 right-4 p-1 rounded-full transition-colors"
                :class="isSidebarOpen && selectedJob?.id === job.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'">
                <IconInfoCircle class="h-6 w-6" />
              </button>
            </div>

            <!-- Logo, Nom d'entreprise et Poste -->
            <div class="flex items-center space-x-3 mb-4">
              <img :src="job.company.logo?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${job.company.name}`"
                alt="Logo Entreprise" class="w-14 h-14 object-cover rounded-full border" @error="handleImageError" />

              <div class="pl-4">
                <div class="mb-2">
                  <a :href="`https://localhost:3000/company/${job.company.id}/${job.company.name}`" target="_blank"
                    class="text-base font-medium text-gray-500 hover:text-primary transition-colors"
                    :title="`Consulter le profil de ${job.company.name}`">
                    {{ job.company.name }}
                  </a>
                  <p class="text-xl font-semibold text-gray-900">{{ job.post }}</p>
                  <p class="text-gray-700 text-sm line-clamp-1" :title="job.profile">{{ job.profile }}</p>
                </div>

                <!-- Infos complémentaires -->
                <div class="mb-2 text-gray-600 text-sm space-x-2 grid grid-cols-1 md:grid-cols-3 mx-auto border-y py-2">
                  <div class="flex items-center">
                    <IconUsers class="w-4 h-4 mr-1" /> {{ job.placeNumber }} poste{{ job.placeNumber > 1 ? 's' : '' }}
                  </div>
                  <div class="flex items-center">
                    <IconLocation class="w-4 h-4 mr-1" /> {{ job.location }}
                  </div>
                  <div class="flex items-center">
                    <IconCalendarX class="w-4 h-4 mr-1" /> {{ formatDate(job.closingDate) }}
                  </div>
                </div>

                <p class="text-gray-600 text-sm mt-2 line-clamp-2" v-html="job.summary" :title="job.summary"></p>
              </div>
            </div>

            <!-- Bouton -->
            <div class="flex items-center justify-end">
              <NuxtLink :to="`/offer/${job.id}/${job.slug}`"
                class="text-primary hover:text-secondary font-medium text-sm">
                Voir l'offre →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          &larr; Précédent
        </button>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Suivant &rarr;
        </button>
      </div>
    </main>

    <!-- Sidebar Détails -->
    <transition name="slide">
      <aside v-if="isSidebarOpen" class="fixed top-0 right-0 w-80 h-full bg-gray-50 border-l overflow-y-auto z-50">
        <div v-if="selectedJob" class="h-full flex flex-col">
          <!-- En-tête -->
          <header class="sticky top-0 bg-gray-50 z-10 border-b p-4">
            <!-- Logo, nom et bouton fermer -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img
                  :src="selectedJob.company.logo?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedJob.company.name}`"
                  alt="Logo Entreprise" class="w-10 h-10 object-cover rounded-full border" @error="handleImageError" />
                <a :href="`https://localhost:3000/company/${selectedJob.company.id}/${selectedJob.company.name}`"
                  target="_blank" class="text-xl font-medium text-gray-800 hover:text-primary transition-colors">
                  {{ selectedJob.company.name }}
                </a>
              </div>
              <button @click="closeSidebar" class="text-gray-500 hover:text-gray-700">
                <IconX
                  class="w-6 h-6 transform transition duration-300 ease-in-out hover:rotate-90 hover:text-critique" />
              </button>
            </div>
            <!-- Titre du poste et bouton Postuler -->
            <div class="mt-3 flex items-center justify-between">
              <h2 class="text-xl font-bold text-primary">
                {{ selectedJob.post }}
              </h2>
              <button class="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded">
                Postuler
              </button>
            </div>
          </header>

          <!-- Contenu -->
          <main class="p-4 flex-1 space-y-4 overflow-y-auto">
            <div>
              <p class="text-gray-800">Profil recherché :</p>
              <div class="text-sm text-gray-500" v-html="selectedJob.profile"></div>
            </div>
            <div v-if="selectedJob.skills && selectedJob.skills.trim() !== '<p> </p>'">
              <p class="text-gray-800">Compétences :</p>
              <div class="text-sm text-gray-500" v-html="selectedJob.skills"></div>
            </div>
            <div v-if="selectedJob.aptitudes && selectedJob.aptitudes.trim() !== '<p> </p>'">
              <p class="text-gray-800">Aptitudes :</p>
              <div class="text-sm text-gray-500" v-html="selectedJob.aptitudes"></div>
            </div>
            <div v-if="selectedJob.tasks && selectedJob.tasks.trim() !== '<p> </p>'">
              <p class="text-gray-800">Tâches :</p>
              <div class="text-sm text-gray-500" v-html="selectedJob.tasks"></div>
            </div>
            <div v-if="selectedJob.requiredDocument && selectedJob.requiredDocument.trim() !== '<p> </p>'">
              <p class="text-gray-800">Documents requis :</p>
              <div class="text-sm text-gray-500" v-html="selectedJob.requiredDocument"></div>
            </div>
          </main>

          <!-- Footer -->
          <footer class="sticky bottom-0 bg-gray-50 z-10 p-4 border-t">
            <NuxtLink :to="`/offer/${selectedJob.id}/${selectedJob.slug}`"
              class="block text-center bg-primary hover:bg-secondary text-white font-medium py-2 rounded">
              Voir plus
            </NuxtLink>
          </footer>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useJobsStore } from '~/stores/jobs'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { storeToRefs } from 'pinia'
import { IconRefresh, IconSearch, IconInfoCircle, IconLocation, IconUsers, IconCalendarX, IconX } from '@tabler/icons-vue'

// Filtre de type de contrat
const jobsStore = useJobsStore()
const { isLoading, error, filteredJobs: storeFilteredJobs, jobs } = storeToRefs(jobsStore)

const contractTypes = computed(() => {
  const typesSet = new Set<string>()
  jobs.value.forEach(job => {
    if (job.contract) {
      typesSet.add(job.contract)
    }
  })
  return Array.from(typesSet)
})

// Filtre et tri
const selectedContract = ref<string>('')
const sortOption = ref<string>('default')

// Computed property processedJobs
const processedJobs = computed(() => {
  let result = storeFilteredJobs.value

  // Filtrage par contrat
  if (selectedContract.value) {
    result = result.filter(job => job.contract === selectedContract.value)
  }

  // Tri
  switch (sortOption.value) {
    case 'alpha-asc':
      result = [...result].sort((a, b) => a.post.localeCompare(b.post))
      break
    case 'alpha-desc':
      result = [...result].sort((a, b) => b.post.localeCompare(a.post))
      break
    case 'closingDateDesc':
      result = [...result].sort((a, b) =>
        new Date(b.closingDate).getTime() - new Date(a.closingDate).getTime()
      )
      break
    case 'closingDateAsc':
      result = [...result].sort((a, b) =>
        new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
      )
      break
    case 'placeNumberDesc':
      result = [...result].sort((a, b) => b.placeNumber - a.placeNumber)
      break
    case 'placeNumberAsc':
      result = [...result].sort((a, b) => a.placeNumber - b.placeNumber)
      break
    case 'default':
    default:
      break
  }

  return result
})

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(processedJobs.value.length / itemsPerPage))
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return processedJobs.value.slice(start, start + itemsPerPage)
})
watch(processedJobs, () => {
  currentPage.value = 1
})
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

// Date
const formatDate = (timestamp: number) =>
  format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr })

// Sidebar et sélection d'une offre
const isSidebarOpen = ref(false)
const selectedJob = ref<any | null>(null)
function toggleSidebar(job: any) {
  if (isSidebarOpen.value && selectedJob.value && selectedJob.value.id === job.id) {
    closeSidebar()
  } else {
    selectedJob.value = job
    isSidebarOpen.value = true
  }
}
function closeSidebar() {
  isSidebarOpen.value = false
}

// Logo par défaut en cas d'erreur de chargement
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  const name = target.alt || 'Logo Entreprise'
  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
}

// Chargement initial
const refreshJobs = () => jobsStore.fetchJobs()
onMounted(refreshJobs)

// SEO
useHead({
  title: "Offres d'emploi",
  meta: [
    {
      name: 'description',
      content: "Consultez toutes nos offres d'emploi et de stage disponibles"
    }
  ]
})

// Classe des badges de contrat
const getContractClass = (contract: string) => {
  switch (contract) {
    case 'CDI': return 'bg-green-100 text-green-800'
    case 'CDD': return 'bg-purple-100 text-purple-800'
    case 'STAGE': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
