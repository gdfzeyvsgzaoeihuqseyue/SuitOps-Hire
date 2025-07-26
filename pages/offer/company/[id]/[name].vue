<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <button @click="router.go(-1)" class="text-primary hover:text-secondary flex items-center gap-2">
        <IconArrowLeft class="w-5 h-5" />
        Retour
      </button>

      <button @click="refreshCompanyJobs"
        class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors">
        <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
          'animate-spin': isLoading,
          'group-hover:rotate-180': !isLoading
        }" />
        Actualiser les offres du récruteur
      </button>
    </div>

    <!-- En-tête -->
    <header class="mb-8 bg-white rounded-lg shadow-md p-6" v-if="company">
      <div class="flex items-start gap-6">
        <!-- Logo -->
        <img :src="company.logo?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${company.name}`"
          :alt="company.name" class="w-24 h-24 rounded-full border object-cover" />

        <!-- Informations -->
        <div class="flex-1">
          <a :href="`https://localhost:3000/company/${company.id}/${company.name}`" target="_blank"
            class="text-3xl font-bold text-primary hover:text-secondary transition-colors"
            :title="`Consulter le profil de ${company.name}`">
            {{ company.name }}
          </a>

          <!-- Métriques -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <div class="bg-blue-50 p-3 rounded-lg">
              <p class="text-sm text-gray-600">Offres actives</p>
              <p class="text-2xl font-semibold text-primary">{{ filteredJobs.length }}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <p class="text-sm text-gray-600">Postes tot{{ totalPositions > 1 ? 'aux' : 'al' }}</p>
              <p class="text-2xl font-semibold text-green-600">{{ totalPositions }}</p>
            </div>
            <div class="bg-purple-50 p-3 rounded-lg">
              <p class="text-sm text-gray-600">Moyenne/postes</p>
              <p class="text-2xl font-semibold text-purple-600">{{ avgPositions }}</p>
            </div>
            <div class="bg-orange-50 p-3 rounded-lg">
              <p class="text-sm text-gray-600">Prochaine clôture</p>
              <p class="text-2xl font-semibold text-orange-600">{{ nextClosing }}</p>
            </div>
          </div>

          <!-- Informations supplémentaires -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <p v-if="company.address" class="flex items-center">
              <IconMapPin class="w-4 h-4 mr-1" /> {{ company.address }}
            </p>
            <p v-if="company.mainActivity" class="flex items-center">
              <IconBriefcase class="w-4 h-4 mr-1" /> {{ company.mainActivity }}
            </p>
            <p v-if="company.emailAddress" class="flex items-center">
              <IconMail class="w-4 h-4 mr-1" /> {{ company.emailAddress }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Contrôles de recherche/tri -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 p-4 border-b">
      <!-- Barre de recherche -->
      <div class="w-full md:w-2/3">
        <div class="relative">
          <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher dans les offres..."
            class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <!-- Filtres -->
      <div class="flex flex-col sm:flex-row items-start gap-4">
        <!-- Filtre par contrat -->
        <select v-model="contractFilter" class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary">
          <option value="">Tous les contrats</option>
          <option v-for="type in contractTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <!-- Sélecteur de tri -->
        <select v-model="sortOption" class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary">
          <option value="default">Tri par défaut</option>
          <option value="alpha-asc">A-Z</option>
          <option value="alpha-desc">Z-A</option>
          <option value="closing-desc">Clôture éloignée</option>
          <option value="closing-asc">Clôture proche</option>
          <option value="positions-desc">Plus de postes</option>
          <option value="positions-asc">Moins de postes</option>
        </select>
      </div>
    </div>


    <!-- États de chargement/erreur -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement des offres de l'entreprise...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
      <p class="text-red-700">{{ error }}</p>
      <button @click="refreshCompanyJobs" class="mt-2 text-red-600 hover:text-red-800 font-medium">
        Réessayer
      </button>
    </div>

    <!-- Contenu principal -->
    <div v-else>
      <!-- Message d'absence -->
      <div v-if="filteredJobs.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="text-6xl mb-4">📭</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ searchQuery ? 'Aucun résultat trouvé' : 'Aucune offre disponible' }}
          </h3>
          <p class="text-gray-500">
            {{ searchQuery
              ? `Aucune offre ne correspond à "${searchQuery}"`
              : 'Revenez plus tard pour consulter les offres de ce récruteur' }}
          </p>
        </div>
      </div>

      <!-- Liste des offres -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div v-for="job in paginatedJobs" :key="job.id"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <NuxtLink :to="`/offer/${job.id}/${job.slug}`" class="text-primary hover:text-secondary">
            <div>
              <div class="flex items-center justify-between mb-4 gap-4">
                <h2 class="text-xl font-semibold text-gray-900">{{ job.post }}</h2>
                <span class="px-2 py-1 rounded-full text-sm" :class="contractClass(job.contract)">
                  {{ job.contract }}
                </span>
              </div>

              <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                <p class="flex items-center">
                  <IconCalendar class="w-4 h-4 mr-1" /> Clôture le {{ formatDate(job.closingDate) }}
                </p>
                <p class="flex items-center">
                  <IconUsers class="w-4 h-4 mr-1" /> {{ job.placeNumber }} poste{{ job.placeNumber > 1 ? 's' : '' }}
                </p>
                <p class="flex items-center">
                  <IconLocation class="w-4 h-4 mr-1" /> {{ job.location }}
                </p>
              </div>
            </div>
          </NuxtLink>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useJobsStore } from '~/stores/jobs'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconArrowLeft, IconRefresh, IconMapPin, IconSearch, IconLocation, IconBriefcase, IconMail, IconCalendar, IconUsers } from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const jobsStore = useJobsStore()
const { jobs, isLoading, error } = storeToRefs(jobsStore)

const searchQuery = ref('')
const sortOption = ref('default')

const refreshCompanyJobs = () => jobsStore.fetchJobs()
onMounted(refreshCompanyJobs)

const companyJobs = computed(() =>
  jobs.value.filter(job =>
    job.company?.id === Number(route.params.id) &&
    job.status === 'opened'
  )
)

const company = computed(() => {
  return companyJobs.value[0]?.company || null
})


const contractFilter = ref('')
const contractTypes = computed(() => {
  const types = new Set<string>()
  companyJobs.value.forEach(job => {
    if (job.contract) types.add(job.contract)
  })
  return Array.from(types)
})

const filteredJobs = computed(() =>
  companyJobs.value.filter(job => {
    const search = searchQuery.value.toLowerCase()
    return (
      job.post.toLowerCase().includes(search) ||
      job.profile.toLowerCase().includes(search)
    ) && (
        !contractFilter.value || job.contract === contractFilter.value
      )
  })
)

const sortedJobs = computed(() => {
  const sorted = [...filteredJobs.value]
  switch (sortOption.value) {
    case 'alpha-asc':
      return sorted.sort((a, b) => a.post.localeCompare(b.post))
    case 'alpha-desc':
      return sorted.sort((a, b) => b.post.localeCompare(a.post))
    case 'positions-desc':
      return sorted.sort((a, b) => b.placeNumber - a.placeNumber)
    case 'positions-asc':
      return sorted.sort((a, b) => a.placeNumber - b.placeNumber)
    case 'closing-desc':
      return sorted.sort((a, b) => b.closingDate - a.closingDate)
    case 'closing-asc':
      return sorted.sort((a, b) => a.closingDate - b.closingDate)
    default:
      return sorted
  }
})


const totalPositions = computed(() =>
  companyJobs.value.reduce((acc, job) => acc + job.placeNumber, 0)
)

const avgPositions = computed(() =>
  companyJobs.value.length ? Math.round(totalPositions.value / companyJobs.value.length) : 0
)

const nextClosing = computed(() => {
  const dates = companyJobs.value.map(j => j.closingDate).filter(d => d > Date.now())
  return dates.length > 0
    ? format(Math.min(...dates), 'dd/MM/yyyy', { locale: fr })
    : 'Aucune'
})

// Pagination
const itemsPerPage = 6
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(sortedJobs.value.length / itemsPerPage))
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return sortedJobs.value.slice(start, start + itemsPerPage)
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

// Réinitialiser la pagination quand les filtres changent
watch([searchQuery, contractFilter, sortOption], () => {
  currentPage.value = 1
})

const formatDate = (timestamp: number) =>
  format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr })

const contractClass = (contract: string) => {
  const classes: Record<string, string> = {
    'CDI': 'bg-green-100 text-green-800',
    'CDD': 'bg-blue-100 text-blue-800',
    'STAGE': 'bg-orange-100 text-orange-800',
    'FREELANCE': 'bg-purple-100 text-purple-800'
  }
  return classes[contract] || 'bg-gray-100 text-gray-800'
}

useHead(() => ({
  title: `Offres de ${company.value?.name || 'Entreprise'}`,
  meta: [
    {
      name: 'description',
      content: `Découvrez toutes les offres d'emploi disponibles chez ${company.value?.name || 'cette entreprise'}`
    }
  ]
}))
</script>
