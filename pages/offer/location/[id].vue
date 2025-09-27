<template>
  <div class="p-4 sm:p-6 mt-6 min-h-screen">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <button @click="router.go(-1)"
        class="text-primary hover:text-secondary flex items-center gap-2 font-medium transition-colors duration-200">
        <IconArrowLeft class="w-5 h-5" />
        Retour aux localisations
      </button>

      <button @click="refreshLocationJobs"
        class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-200">
        <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
          'animate-spin': isLoading,
          'group-hover:rotate-180': !isLoading
        }" />
        Actualiser les offres pour cette localisation
      </button>
    </div>

    <header class="mb-8 bg-white rounded-lg shadow-md p-6 sm:p-8" v-if="locationData">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <!-- Logo -->
        <img :src="`https://placehold.co/100x100/E0F2FE/0284C7?text=${encodeURIComponent(locationData.name)}`"
          :alt="locationData.name" class="w-24 h-24 rounded-full border object-cover" />

        <div class="flex-1 text-center md:text-left mt-4 md:mt-0">
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
            Emplois à {{ locationData.name }}
          </h1>
          <p class="text-lg text-gray-600 mb-4">
            Découvrez toutes les opportunités d'emploi disponibles dans la région de {{ locationData.name }}.
          </p>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4">
            <div class="bg-blue-50 p-3 rounded-lg text-center">
              <p class="text-sm text-gray-600">Offres actives</p>
              <p class="text-2xl font-semibold text-primary">{{ filteredJobs.length }}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg text-center">
              <p class="text-sm text-gray-600">Postes totaux</p>
              <p class="text-2xl font-semibold text-green-600">{{ totalPositions }}</p>
            </div>
            <div class="bg-purple-50 p-3 rounded-lg text-center">
              <p class="text-sm text-gray-600">Moyenne par offre</p>
              <p class="text-2xl font-semibold text-purple-600">{{ avgPositions }}</p>
            </div>
            <div class="bg-orange-50 p-3 rounded-lg text-center">
              <p class="text-sm text-gray-600">Prochaine clôture</p>
              <p class="text-2xl font-semibold text-orange-600">{{ nextClosing }}</p>
            </div>
          </div>

          <div class="mt-4">
            <!-- Version mobile -->
            <div class="block md:hidden space-y-3">
              <div class="bg-gray-50 rounded-lg p-3 border-l-4 border-primary" v-if="topCompany.name">
                <div class="flex items-center">
                  <IconBuilding class="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs text-gray-600 uppercase tracking-wide font-medium">Entreprise populaire</p>
                    <p class="text-sm font-semibold text-gray-900 truncate">{{ topCompany.name }}</p>
                    <p class="text-xs text-gray-500">{{ topCompany.count }} offres</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-3 border-l-4 border-primary" v-if="topContract.type">
                <div class="flex items-center">
                  <IconUsers class="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs text-gray-600 uppercase tracking-wide font-medium">Contrat populaire</p>
                    <p class="text-sm font-semibold text-gray-900 truncate">{{ topContract.type }}</p>
                    <p class="text-xs text-gray-500">{{ topContract.count }} offres</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-3 border-l-4 border-primary">
                <div class="flex items-center">
                  <IconStar class="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs text-gray-600 uppercase tracking-wide font-medium">Nombre d'entreprises</p>
                    <p class="text-sm font-semibold text-gray-900">{{ uniqueCompaniesCount }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Version desktop -->
            <div class="hidden md:flex flex-wrap justify-start gap-x-6 gap-y-2 text-sm text-gray-700">
              <p class="flex items-center" v-if="topCompany.name">
                <IconBuilding class="w-4 h-4 mr-1 text-primary" /> Entreprise populaire :
                <span class="ml-1 font-medium">{{ topCompany.name }}</span> ({{ topCompany.count }} offres)
              </p>
              <p class="flex items-center" v-if="topContract.type">
                <IconUsers class="w-4 h-4 mr-1 text-primary" /> Contrat populaire :
                <span class="ml-1 font-medium">{{ topContract.type }}</span> ({{ topContract.count }} offres)
              </p>
              <p class="flex items-center">
                <IconStar class="w-4 h-4 mr-1 text-primary" /> Nombre d'entreprises :
                <span class="ml-1 font-medium">{{ uniqueCompaniesCount }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 p-4 border-b border-gray-200 bg-white rounded-lg shadow-sm">
      <div class="w-full md:w-2/3 lg:w-1/2">
        <div class="relative">
          <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher dans les offres de cette localisation..."
            class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" />
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
        <select v-model="contractFilter"
          class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
          <option value="">Tous les types de contrat</option>
          <option v-for="type in contractTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <select v-model="sortOption"
          class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
          <option value="default">Tri par défaut</option>
          <option value="alpha-asc">Titre du poste (A-Z)</option>
          <option value="alpha-desc">Titre du poste (Z-A)</option>
          <option value="closing-desc">Clôture la plus éloignée</option>
          <option value="closing-asc">Clôture la plus proche</option>
          <option value="positions-desc">Plus de postes disponibles</option>
          <option value="positions-asc">Moins de postes disponibles</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement des offres pour {{ locationData?.name || 'cette localisation' }}...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-center">
      <p class="text-red-700 font-medium mb-2">Une erreur est survenue lors du chargement des offres.</p>
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button @click="refreshLocationJobs"
        class="mt-4 text-red-600 hover:text-red-800 font-medium border border-red-600 rounded-md px-4 py-2 hover:bg-red-50 transition-colors">
        Réessayer
      </button>
    </div>

    <div v-else>
      <div v-if="filteredJobs.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="text-6xl mb-4">📭</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ searchQuery || contractFilter ? 'Aucun résultat trouvé' : 'Aucune offre disponible' }}
          </h3>
          <p class="text-gray-500">
            {{ searchQuery || contractFilter
              ? `Aucune offre ne correspond à vos critères de recherche pour ${locationData?.name || 'cette localisation'}.`
              : `Il n'y a actuellement aucune offre d'emploi active dans la région de ${locationData?.name || 'cette localisation'}. Revenez plus tard !` }}
          </p>
          <button v-if="searchQuery || contractFilter" @click="clearFilters"
            class="mt-4 text-primary hover:text-secondary font-medium underline">
            Effacer les filtres
          </button>
        </div>
      </div>

      <div v-else>
        <p class="text-gray-600 text-center my-6">
          {{ filteredJobs.length }} offre{{ filteredJobs.length > 1 ? 's' : '' }} active{{ filteredJobs.length > 1 ? 's'
          : '' }} à {{ locationData?.name }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="job in paginatedJobs" :key="job.id" :to="`/offer/${job.id}/${job.slug}`"
            class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4 gap-4">
                <h2 class="text-xl font-semibold text-gray-900 leading-tight flex-1">{{ job.post }}</h2>
                <span class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                  :class="getContractClass(job.contract)">
                  {{ job.contract }}
                </span>
              </div>

              <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 border-y border-gray-200 py-3 mb-4">
                <p class="flex items-center">
                  <IconCalendar class="w-4 h-4 mr-1 text-primary" /> Clôture : {{ formatDate(job.closingDate) }}
                </p>
                <p class="flex items-center">
                  <IconUsers class="w-4 h-4 mr-1 text-primary" /> {{ job.placeNumber }} poste{{ job.placeNumber !== 1 ?
                  's' : '' }}
                </p>
                <p class="flex items-center">
                  <IconBuilding class="w-4 h-4 mr-1 text-primary" />
                  <NuxtLink :to="`/offer/company/${job.company.id}/${job.company.name}`" class="hover:underline ml-0.5">
                    {{ job.company.name }}
                  </NuxtLink>
                </p>
              </div>
              <p class="text-gray-600 text-sm line-clamp-3" v-html="job.summary"></p>
            </div>

            <NuxtLink :to="`/offer/${job.id}/${job.slug}`" class="flex justify-end mt-4">
              <span class="text-primary hover:text-secondary flex items-center gap-1 text-sm font-medium">
                Voir l'offre
                <IconArrowRight class="w-4 h-4" />
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
          &larr; Précédent
        </button>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
          Suivant &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useJobsStore } from '~/stores/jobs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IconArrowLeft, IconRefresh, IconSearch, IconCalendar, IconUsers, IconBuilding, IconStar, IconArrowRight } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const jobsStore = useJobsStore();
const { jobs, isLoading, error } = storeToRefs(jobsStore);

const searchQuery = ref('');
const sortOption = ref('default');
const contractFilter = ref('');

// --- Initial Data Fetch ---
const refreshLocationJobs = () => jobsStore.fetchJobs();
onMounted(refreshLocationJobs);

// --- Location-specific Jobs ---
const locationJobs = computed(() =>
  jobs.value.filter(job => {
    // Standardize location string for comparison (e.g., "Porto-Novo, Bénin" -> "porto-novo")
    const jobLocation = job.location ? job.location.trim().split(',')[0].toLowerCase() : '';
    const routeLocation = decodeURIComponent(route.params.id as string).toLowerCase();
    return jobLocation === routeLocation && job.status === 'opened';
  })
);

// --- Location Data for Header ---
const locationData = computed(() => ({
  name: decodeURIComponent(route.params.id as string)
}));

// --- Metrics and Top Information ---
const topCompany = computed(() => {
  const companyCounts: Record<number, { id: number; name: string; count: number }> = {};

  locationJobs.value.forEach(job => {
    const companyId = job.company.id;
    if (!companyCounts[companyId]) {
      companyCounts[companyId] = { id: companyId, name: job.company.name, count: 0 };
    }
    companyCounts[companyId].count++;
  });

  const sortedCompanies = Object.values(companyCounts).sort((a, b) => b.count - a.count);
  return sortedCompanies[0] || { id: 0, name: 'Aucune', count: 0 };
});

const topContract = computed(() => {
  const contractCounts: Record<string, number> = {};
  locationJobs.value.forEach(job => {
    const type = job.contract;
    contractCounts[type] = (contractCounts[type] || 0) + 1;
  });

  const [maxType, maxCount] = Object.entries(contractCounts)
    .reduce((acc, [type, count]) => count > acc[1] ? [type, count] : acc, ['', 0]);

  return { type: maxType, count: maxCount };
});

const uniqueCompaniesCount = computed(() => {
  return new Set(locationJobs.value.map(job => job.company.id)).size;
});

// --- Dynamic Contract Types for Filter ---
const contractTypes = computed(() => {
  const types = new Set<string>();
  locationJobs.value.forEach(job => {
    if (job.contract) types.add(job.contract);
  });
  return Array.from(types).sort();
});

// --- Filtering Jobs ---
const filteredJobs = computed(() =>
  locationJobs.value.filter(job => {
    const search = searchQuery.value.toLowerCase();
    // Search by post title, profile, company name, or summary
    const matchesSearch = job.post.toLowerCase().includes(search) ||
      job.profile.toLowerCase().includes(search) ||
      job.company.name.toLowerCase().includes(search) ||
      job.summary.toLowerCase().includes(search);

    // Filter by contract type
    const matchesContract = !contractFilter.value || job.contract === contractFilter.value;

    return matchesSearch && matchesContract;
  })
);

// --- Sorting Jobs ---
const sortedJobs = computed(() => {
  const sorted = [...filteredJobs.value];
  switch (sortOption.value) {
    case 'alpha-asc':
      return sorted.sort((a, b) => a.post.localeCompare(b.post));
    case 'alpha-desc':
      return sorted.sort((a, b) => b.post.localeCompare(a.post));
    case 'positions-desc':
      return sorted.sort((a, b) => b.placeNumber - a.placeNumber);
    case 'positions-asc':
      return sorted.sort((a, b) => a.placeNumber - b.placeNumber);
    case 'closing-desc':
      return sorted.sort((a, b) => new Date(b.closingDate).getTime() - new Date(a.closingDate).getTime());
    case 'closing-asc':
      return sorted.sort((a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime());
    default:
      return sorted;
  }
});

// --- Metrics for Location Header ---
const totalPositions = computed(() =>
  locationJobs.value.reduce((acc, job) => acc + job.placeNumber, 0)
);

const avgPositions = computed(() =>
  locationJobs.value.length ? Math.round(totalPositions.value / locationJobs.value.length) : 0
);

const nextClosing = computed(() => {
  const now = Date.now();
  const futureDates = locationJobs.value
    .map(j => new Date(j.closingDate).getTime())
    .filter(timestamp => timestamp > now);

  return futureDates.length > 0
    ? format(Math.min(...futureDates), 'dd MMMM yyyy', { locale: fr })
    : 'Aucune';
});

// --- Pagination Logic ---
const itemsPerPage = 9; // Increased for a denser, more aesthetic grid
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(sortedJobs.value.length / itemsPerPage));
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedJobs.value.slice(start, start + itemsPerPage);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top after page change
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top after page change
  }
}

// Reset pagination when filters or search change
watch([searchQuery, contractFilter, sortOption], () => {
  currentPage.value = 1;
});

// --- Helper Functions ---
const formatDate = (timestamp: number) =>
  format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr });

const getContractClass = (contract: string) => {
  switch (contract.toLowerCase()) {
    case 'cdi': return 'bg-green-100 text-green-800';
    case 'cdd': return 'bg-blue-100 text-blue-800';
    case 'stage': return 'bg-orange-100 text-orange-800';
    case 'alternance': return 'bg-purple-100 text-purple-800';
    case 'freelance': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Function to clear all filters
const clearFilters = () => {
  searchQuery.value = '';
  contractFilter.value = '';
  sortOption.value = 'default';
};

// --- SEO Configuration ---
useSeoMeta({
  title: `Offres d'emploi à ${locationData.value.name}`,
  ogTitle: `Découvrez les offres d'emploi à ${locationData.value.name}`,
  description: `Explorez toutes les opportunités de carrière et les offres d'emploi actives à ${locationData.value.name} au Bénin. Trouvez votre prochain poste idéal avec SuitOps Hire.`,
});
</script>

<style scoped>
/* Animation for the refresh icon */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
