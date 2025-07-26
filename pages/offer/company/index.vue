<template>
  <div class="p-6 mt-6">
    <!-- En-tête -->
    <header class="mb-8 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Offres par entreprise</h1>
          <p class="text-gray-600">Liste des entreprises ayant un recutrement en cours</p>
        </div>

        <button @click="refreshCompanies"
          class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors">
          <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
            'animate-spin': isLoading,
            'group-hover:rotate-180': !isLoading
          }" />
          Actualiser les récruteurs
        </button>
      </div>

      <!-- Filtres -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <!-- Barre de recherche -->
        <div class="w-full md:w-2/3">
          <div class="relative">
            <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input v-model="jobsStore.searchQuery" type="text" placeholder="Rechercher une entreprise..."
              class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <!-- Filtres -->
        <div class="flex flex-col sm:flex-row items-start gap-4">
          <!-- Trier -->
          <div>
            <select v-model="sortOption" class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary">
              <option value="default">Tri par défaut</option>
              <option value="alpha-asc">A-Z</option>
              <option value="alpha-desc">Z-A</option>
              <option value="jobs-desc">Plus d'offres</option>
              <option value="jobs-asc">Moins d'offres</option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <!-- États -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Recherche des entreprises...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
      <p class="text-red-700">{{ error }}</p>
      <button @click="refreshCompanies" class="mt-2 text-red-600 hover:text-red-800 font-medium">
        Réessayer
      </button>
    </div>

    <!-- Message d'absence -->
    <div v-else-if="sortedCompanies.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-4">🏢</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ jobsStore.searchQuery ? 'Aucun résultat trouvé' : 'Aucune entreprise disponible' }}
        </h3>
        <p class="text-gray-500">
          {{ jobsStore.searchQuery
            ? `Aucune entreprise ne correspond à "${jobsStore.searchQuery}"`
            : 'Revenez plus tard pour consulter les offres par entreprise' }}
        </p>
      </div>
    </div>

    <!-- Liste des entreprises -->
    <div v-else class="space-y-6">
      <p class="text-gray-600 text-center my-6">
        {{ sortedCompanies.length }} récruteur{{ sortedCompanies.length > 1 ? 's' : '' }} trouvée{{
          sortedCompanies.length > 1 ? 's' : '' }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink v-for="company in paginatedCompanies" :key="company.id"
          :to="`/offer/company/${company.id}/${company.slug}`"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group">
          <div class="flex items-center gap-4">
            <img :src="company.logo?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${company.name}`"
              :alt="company.name" class="w-12 h-12 rounded-full border object-cover" />
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {{ company.name }}
              </h2>
              <p class="text-gray-600 mt-1">
                {{ company.jobCount }} offre{{ company.jobCount !== 1 ? 's' : '' }} disponible{{ company.jobCount !== 1
                  ? 's' : '' }}
              </p>
            </div>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useJobsStore } from '~/stores/jobs'
import { storeToRefs } from 'pinia'
import { IconRefresh, IconSearch } from '@tabler/icons-vue'

const jobsStore = useJobsStore()
const { isLoading, error, jobs } = storeToRefs(jobsStore)

// Extraction des entreprises
const companies = computed(() => {
  const companiesMap = new Map<number, any>()

  jobs.value.forEach(job => {
    const company = job.company as any
    if (company?.id) {
      const existing = companiesMap.get(company.id)
      companiesMap.set(company.id, {
        id: company.id,
        name: company.name,
        slug: company.slug || company.name.toLowerCase().replace(/\s+/g, '-'),
        logo: company.logo,
        jobCount: existing ? existing.jobCount + 1 : 1
      })
    }
  })

  return Array.from(companiesMap.values())
})

// Filtrage et tri
const filteredCompanies = computed(() => {
  if (!jobsStore.searchQuery) return companies.value
  return companies.value.filter(company =>
    company.name.toLowerCase().includes(jobsStore.searchQuery.toLowerCase())
  )
})

const sortOption = ref('default')
const sortedCompanies = computed(() => {
  const result = [...filteredCompanies.value]
  switch (sortOption.value) {
    case 'alpha-asc': return result.sort((a, b) => a.name.localeCompare(b.name))
    case 'alpha-desc': return result.sort((a, b) => b.name.localeCompare(a.name))
    case 'jobs-desc': return result.sort((a, b) => b.jobCount - a.jobCount)
    case 'jobs-asc': return result.sort((a, b) => a.jobCount - b.jobCount)
    default: return result
  }
})

// Pagination
const itemsPerPage = 6
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(sortedCompanies.value.length / itemsPerPage))
const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedCompanies.value.slice(start, start + itemsPerPage)
})
watch([() => jobsStore.searchQuery, sortOption], () => {
  currentPage.value = 1
})
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

// Rafraîchissement
const refreshCompanies = () => jobsStore.fetchJobs()
onMounted(refreshCompanies)

// SEO
useHead({
  title: "Offres par entreprise",
  meta: [{
    name: 'description',
    content: "Consultez les offres d'emploi disponibles par entreprise"
  }]
})
</script>