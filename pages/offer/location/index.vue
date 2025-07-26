<template>
  <div class="p-6 mt-6">
    <!-- Header -->
    <header class="mb-8 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Offres par localisation</h1>
          <p class="text-gray-600">Explorez les offres en fonction des localisations disponibles</p>
        </div>

        <button @click="refreshLocation"
          class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors">
          <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
            'animate-spin': isLoading,
            'group-hover:rotate-180': !isLoading
          }" />
          Actualiser les lieux
        </button>
      </div>

      <!-- Filtres -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <!-- Barre de recherche -->
        <div class="w-full md:w-2/3">
          <div class="relative">
            <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input v-model="jobsStore.searchQuery" type="text" placeholder="Rechercher un lieu..."
              class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <!-- Filtres -->
        <div class="flex flex-col sm:flex-row items-start gap-4">
          <!-- Trier -->
          <div>
            <select v-model="sortOption" class="rounded-md border-gray-300 focus:ring-2 focus:ring-secondary">
              <option value="default">Tri par défaut</option>
              <option value="alpha-asc">A-Z</option>
              <option value="alpha-desc">Z-A</option>
              <option value="most-posts">Plus d'offres</option>
              <option value="least-posts">Moins d'offres</option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <!-- État de chargement -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Recherche des lieux...</p>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
      <p class="text-red-700">{{ error }}</p>
      <button @click="refreshLocation" class="mt-2 text-red-600 hover:text-red-800 font-medium">
        Réessayer
      </button>
    </div>

    <!-- Message d'absence -->
    <div v-else-if="sortedLocations.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-4">🌍</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ jobsStore.searchQuery ? 'Aucun résultat trouvé' : 'Aucun lieu disponible' }}
        </h3>
        <p class="text-gray-500">
          {{ jobsStore.searchQuery
            ? `Aucun lieu ne correspond à "${jobsStore.searchQuery}"`
            : 'Revenez plus tard pour consulter les offres par lieu' }}
        </p>
      </div>
    </div>

    <!-- Liste des localisations -->
    <div v-else class="space-y-6">
      <p class="text-gray-600 text-center my-6">
        {{ sortedLocations.length }} lieu{{ sortedLocations.length > 1 ? 'x' : '' }} disponible{{
          sortedLocations.length > 1 ? 's' : '' }}
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink v-for="location in paginatedLocations" :key="location"
          :to="`/offer/location/${encodeURIComponent(location)}`"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ location }}</h2>
              <p class="text-gray-600 mt-1">
                {{ jobCounts[location] }} offre{{ jobCounts[location] !== 1 ? 's' : '' }} disponible{{
                  jobCounts[location] !== 1 ? 's' : '' }}
              </p>
            </div>
            <IconLocation class="w-6 h-6 text-primary" />
          </div>
        </NuxtLink>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useJobsStore } from '~/stores/jobs'
import { storeToRefs } from 'pinia'
import { IconRefresh, IconSearch, IconLocation } from '@tabler/icons-vue'

const jobsStore = useJobsStore()
const { isLoading, error, jobs } = storeToRefs(jobsStore)

// Normalisation des localisations
const normalizeLocation = (location: string) => {
  let cleaned = location.trim().replace(/\s+/g, ' ')
  cleaned = cleaned.split(',')[0].trim()
  return cleaned
}

// Extraction des localisations
const locations = computed(() => {
  const locationsMap = new Map<string, number>()

  jobs.value.forEach(job => {
    if (job.location) {
      const normalized = normalizeLocation(job.location)
      locationsMap.set(normalized, (locationsMap.get(normalized) || 0) + 1
      )
    }
  })

  return Array.from(locationsMap.keys())
})

const jobCounts = computed(() => {
  const counts: { [key: string]: number } = {}
  jobs.value.forEach(job => {
    if (job.location) {
      const normalized = normalizeLocation(job.location)
      counts[normalized] = (counts[normalized] || 0) + 1
    }
  })
  return counts
})

// Filtrage et tri
const filteredLocations = computed(() => {
  const search = jobsStore.searchQuery.toLowerCase()
  return locations.value.filter(location =>
    normalizeLocation(location).toLowerCase().includes(search)
  )
})

const sortOption = ref<string>('default')
const sortedLocations = computed(() => {
  const result = [...filteredLocations.value]

  switch (sortOption.value) {
    case 'alpha-asc': return result.sort((a, b) => a.localeCompare(b))
    case 'alpha-desc': return result.sort((a, b) => b.localeCompare(a))
    case 'most-posts': return result.sort((a, b) => jobCounts.value[b] - jobCounts.value[a])
    case 'least-posts': return result.sort((a, b) => jobCounts.value[a] - jobCounts.value[b])
    default: return result
  }
})

// Pagination
const itemsPerPage = 6
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(sortedLocations.value.length / itemsPerPage))
const paginatedLocations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedLocations.value.slice(start, start + itemsPerPage)
})

// Navigation pagination
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

// Reset page on filter/search change
watch([() => jobsStore.searchQuery, sortOption], () => {
  currentPage.value = 1
})

// Chargement initial
const refreshLocation = () => jobsStore.fetchJobs()
onMounted(refreshLocation)

// SEO
useHead({
  title: "Offres par localisation",
  meta: [{
    name: 'description',
    content: "Consultez les offres d'emploi disponibles par localisation"
  }]
})
</script>