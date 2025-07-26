<template>
  <div class="p-6 mt-6">
    <!-- Header -->
    <header class="mb-8 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Suggestions pour vous</h1>
          <p class="text-gray-600">Meilleures offres actuellement</p>
        </div>

        <button @click="refreshSuggestions"
          class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors">
          <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
            'animate-spin': isLoading,
            'group-hover:rotate-180': !isLoading
          }" />
          Actualiser les suggestions
        </button>
      </div>

      <!-- Filtres -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <!-- Barre de recherche -->
        <div class="w-full md:w-2/3">
          <div class="relative">
            <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input v-model="jobsStore.searchQuery" type="text" placeholder="Rechercher par poste, entreprise ou lieu"
              class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <!-- Filtres -->
        <div class="flex flex-col sm:flex-row items-start gap-4">
          <!-- Filtre par badge -->
          <select v-model="selectedBadge" class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary">
            <option value="">Tous les badges</option>
            <option v-for="badge in availableBadges" :key="badge" :value="badge">
              {{ badge }}
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
        <p class="mt-4 text-gray-600">Préparation des suggestions...</p>
      </div>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
      <p class="text-red-700">{{ error }}</p>
      <button @click="refreshSuggestions" class="mt-2 text-red-600 hover:text-red-800 font-medium">
        Réessayer
      </button>
    </div>

    <!-- Message d'absence -->
    <div v-else-if="suggestions.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ jobsStore.searchQuery ? 'Aucun résultat trouvé' : 'Aucune suggestion disponible' }}
        </h3>
        <p class="text-gray-500">
          {{ jobsStore.searchQuery
            ? `Aucune offre ne correspond à "${jobsStore.searchQuery}"`
            : 'Revenez plus tard pour consulter les suggestions' }}
        </p>
      </div>
    </div>

    <!-- Liste des suggestions -->
    <div v-else>
      <p class="text-gray-600 text-center my-6">
        {{ suggestions.length }} suggestion{{ suggestions.length > 1 ? 's' : '' }} pour vous
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div v-for="job in suggestions" :key="job.id"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative">
          <!-- Badges de recommandation -->
          <div class="absolute top-4 right-4 flex flex-col gap-2">
            <span v-if="isClosingSoon(job)" class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
              ⏳ Clôture proche
            </span>
            <span v-if="hasMultiplePositions(job)"
              class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              🚀 Multiple postes
            </span>
            <span v-if="(job.company as any).storage >= 1000000"
              class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              🌍 Grande entreprise
            </span>
            <span v-if="job.contract === 'CDI'"
              class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              📃 Emploi stable
            </span>
            <span v-if="job.quizzes?.length > 0"
              class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
              📝 Quiz
            </span>
            <span v-if="isUrgent(job)" class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
              ⚡ Urgent
            </span>
          </div>

          <!-- En-tête de l'offre -->
          <div class="flex items-start gap-4 mb-4">
            <img :src="job.company.logo?.url || defaultLogo(job.company.name)" :alt="job.company.name"
              class="w-12 h-12 rounded-full border object-cover" />
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ job.post }}</h2>
              <NuxtLink :to="`/offer/company/${job.company.id}/${(job.company as any).name}`"
                class="text-primary hover:text-secondary text-sm">
                {{ job.company.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Métadonnées -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-2 py-1 rounded-full text-sm" :class="contractClass(job.contract)">
              {{ job.contract }}
            </span>
            <span class="flex items-center text-sm text-gray-600">
              <IconLocation class="w-4 h-4 mr-1" /> {{ job.location }}
            </span>
            <span class="flex items-center text-sm text-gray-600">
              <IconUsers class="w-4 h-4 mr-1" /> {{ job.placeNumber }} poste(s)
            </span>
            <span class="flex items-center text-sm text-gray-600">
              <IconCalendar class="w-4 h-4 mr-1" /> {{ formatDate(job.closingDate) }}
            </span>
          </div>

          <!-- Extrait -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-3" v-html="job.summary"></p>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <NuxtLink :to="`/offer/${job.id}/${job.slug}`"
              class="text-primary hover:text-secondary flex items-center gap-1 text-sm">
              Voir l'offre
              <IconArrowRight class="w-4 h-4" />
            </NuxtLink>
            <span class="text-xs text-gray-500">
              Publié {{ formatDate(job.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useJobsStore } from '~/stores/jobs'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconRefresh, IconSearch, IconLocation, IconUsers, IconCalendar, IconArrowRight } from '@tabler/icons-vue'

const jobsStore = useJobsStore()
const { jobs, isLoading, error, searchQuery } = storeToRefs(jobsStore)

// Réactifs
const sortOption = ref('default')
const selectedBadge = ref('')

// Liste dynamique des badges existants
const availableBadges = computed(() => {
  const allBadges = jobs.value.flatMap(job => getJobBadges(job))
  return [...new Set(allBadges)]
})

// Suggestions
const suggestions = computed(() => {
  let filtered = jobs.value.filter(job =>
    job.status === 'opened' &&
    new Date(job.closingDate) > new Date()
  )

  // Recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(job =>
      job.post.toLowerCase().includes(query) ||
      job.company.name.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    )
  }

  // Filtrage par badge
  if (selectedBadge.value) {
    filtered = filtered.filter(job =>
      getJobBadges(job).includes(selectedBadge.value)
    )
  }

  // Score
  const scored = filtered.map(job => ({
    ...job,
    score: calculateRecommendationScore(job)
  }))

  // Tri
  scored.sort((a, b) => {
    switch (sortOption.value) {
      case 'alpha-asc': return a.post.localeCompare(b.post)
      case 'alpha-desc': return b.post.localeCompare(a.post)
      case 'closingDateAsc': return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
      case 'closingDateDesc': return new Date(b.closingDate).getTime() - new Date(a.closingDate).getTime()
      case 'placeNumberAsc': return a.placeNumber - b.placeNumber
      case 'placeNumberDesc': return b.placeNumber - a.placeNumber
      default: return b.score - a.score
    }
  })

  return scored.slice(0, 6)
})

// Recommandation & badges
const calculateRecommendationScore = (job: any) => {
  let score = 0
  if (isClosingSoon(job)) score += 5
  if (job.contract === 'CDI') score += 4
  if (job.placeNumber > 1) score += 3
  if (job.company.storage >= 1000000) score += 2
  if (job.quizzes?.length > 0) score += 1
  return score
}

const getJobBadges = (job: any) => {
  const badges = []
  if (isClosingSoon(job)) badges.push('Clôture proche')
  if (hasMultiplePositions(job)) badges.push('Multiple postes')
  if (job.company.storage >= 1000000) badges.push('Grande entreprise')
  if (job.contract === 'CDI') badges.push('Emploi stable')
  if (job.quizzes?.length > 0) badges.push('Quiz')
  if (isUrgent(job)) badges.push('Urgent')
  return badges
}

// Helpers
const isClosingSoon = (job: any) => new Date(job.closingDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
const isUrgent = (job: any) => new Date(job.closingDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
const hasMultiplePositions = (job: any) => job.placeNumber > 1

const formatDate = (timestamp: number) => format(new Date(timestamp), 'dd/MM/yyyy', { locale: fr })
const contractClass = (contract: string) => ({
  'CDI': 'bg-green-100 text-green-800',
  'CDD': 'bg-blue-100 text-blue-800',
  'STAGE': 'bg-orange-100 text-orange-800'
}[contract] || 'bg-gray-100 text-gray-800')

const defaultLogo = (name: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
const refreshSuggestions = () => jobsStore.fetchJobs()

// Chargement initial
onMounted(refreshSuggestions)


useHead({
  title: "Suggestions d'offres",
  meta: [{ name: 'description', content: "Offres recommandées." }]
})
</script>
