<template>
  <div class="p-4 sm:p-6 mt-6 min-h-screen">
    <!-- Boutons de navigation et d'actualisation -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <button @click="router.go(-1)" class="text-primary hover:text-secondary flex items-center gap-2 font-medium transition-colors duration-200">
        <IconArrowLeft class="w-5 h-5" />
        Retour aux entreprises
      </button>

      <button @click="refreshCompanyJobs"
        class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-200">
        <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
          'animate-spin': isLoading,
          'group-hover:rotate-180': !isLoading
        }" />
        Actualiser les offres de l'entreprise
      </button>
    </div>

    <!-- En-tête de l'entreprise -->
    <header class="mb-8 bg-white rounded-lg shadow-md p-6 sm:p-8" v-if="company">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <!-- Logo de l'entreprise -->
        <img :src="company.logo?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${company.name}`"
          :alt="`Logo de ${company.name}`" class="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-gray-100 object-cover flex-shrink-0 shadow-sm" />

        <!-- Informations de l'entreprise -->
        <div class="flex-1 text-center md:text-left mt-4 md:mt-0">
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">
            <a :href="`https://localhost:3000/company/${company.id}/${company.name}`" target="_blank"
              class="text-primary hover:text-secondary transition-colors"
              :title="`Consulter le profil complet de ${company.name}`">
              {{ company.name }}
            </a>
          </h1>
          <p class="text-lg text-gray-600 mb-4">
            Découvrez les opportunités de carrière chez {{ company.name }}.
          </p>

          <!-- Métriques clés de l'entreprise -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4">
            <div class="bg-blue-50 p-3 rounded-lg text-center">
              <p class="text-sm text-gray-600">Offres actives</p>
              <p class="text-2xl font-semibold text-primary">{{ filteredJobs.length }}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg text-center">
              <p class="text-sm text-gray-600">Postes tot{{ totalPositions > 1 ? 'aux' : 'al' }}</p>
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

          <!-- Informations de contact et activité -->
          <div class="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-700 mt-4">
            <p v-if="company.address" class="flex items-center">
              <IconMapPin class="w-4 h-4 mr-1 text-primary" /> {{ company.address }}
            </p>
            <p v-if="company.mainActivity" class="flex items-center">
              <IconBriefcase class="w-4 h-4 mr-1 text-primary" /> {{ company.mainActivity }}
            </p>
            <p v-if="company.emailAddress" class="flex items-center">
              <IconMail class="w-4 h-4 mr-1 text-primary" /> {{ company.emailAddress }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Contrôles de recherche et de tri des offres -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 p-4 border-b border-gray-200 bg-white rounded-lg shadow-sm">
      <!-- Barre de recherche -->
      <div class="w-full md:w-2/3 lg:w-1/2">
        <div class="relative">
          <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher dans les offres de cette entreprise..."
            class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" />
        </div>
      </div>

      <!-- Filtres et Tri -->
      <div class="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
        <!-- Filtre par contrat -->
        <select v-model="contractFilter" class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
          <option value="">Tous les types de contrat</option>
          <option v-for="type in contractTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <!-- Sélecteur de tri -->
        <select v-model="sortOption" class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
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


    <!-- États de chargement/erreur des offres -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement des offres de {{ company?.name || 'l\'entreprise' }}...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-center">
      <p class="text-red-700 font-medium mb-2">Une erreur est survenue lors du chargement des offres.</p>
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button @click="refreshCompanyJobs" class="mt-4 text-red-600 hover:text-red-800 font-medium border border-red-600 rounded-md px-4 py-2 hover:bg-red-50 transition-colors">
        Réessayer
      </button>
    </div>

    <!-- Contenu principal des offres -->
    <div v-else>
      <!-- Message d'absence d'offres -->
      <div v-if="filteredJobs.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="text-6xl mb-4">📭</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ searchQuery || contractFilter ? 'Aucun résultat trouvé' : 'Aucune offre disponible pour le moment' }}
          </h3>
          <p class="text-gray-500">
            {{ searchQuery || contractFilter
              ? `Aucune offre ne correspond à vos critères de recherche pour "${company?.name || 'cette entreprise'}".`
              : `Cette entreprise n'a actuellement aucune offre d'emploi active. Revenez plus tard !` }}
          </p>
          <button v-if="searchQuery || contractFilter" @click="clearFilters"
            class="mt-4 text-primary hover:text-secondary font-medium underline">
            Effacer les filtres
          </button>
        </div>
      </div>

      <!-- Liste des offres -->
      <div v-else>
        <p class="text-gray-600 text-center my-6">
          {{ filteredJobs.length }} offre{{ filteredJobs.length > 1 ? 's' : '' }} active{{ filteredJobs.length > 1 ? 's' : '' }} chez {{ company?.name }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink v-for="job in paginatedJobs" :key="job.id"
            :to="`/offer/${job.id}/${job.slug}`"
            class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4 gap-4">
                <h2 class="text-xl font-semibold text-gray-900 leading-tight flex-1">{{ job.post }}</h2>
                <span class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap" :class="getContractClass(job.contract)">
                  {{ job.contract }}
                </span>
              </div>

              <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 border-y border-gray-200 py-3 mb-4">
                <p class="flex items-center">
                  <IconCalendar class="w-4 h-4 mr-1 text-primary" /> Clôture : {{ formatDate(job.closingDate) }}
                </p>
                <p class="flex items-center">
                  <IconUsers class="w-4 h-4 mr-1 text-primary" /> {{ job.placeNumber }} poste{{ job.placeNumber !== 1 ? 's' : '' }}
                </p>
                <p class="flex items-center">
                  <IconLocation class="w-4 h-4 mr-1 text-primary" /> {{ job.location }}
                </p>
              </div>
              <p class="text-gray-600 text-sm line-clamp-3" v-html="job.summary"></p>
            </div>
            
            <div class="flex justify-end mt-4">
              <span class="text-primary hover:text-secondary flex items-center gap-1 text-sm font-medium">
                Voir l'offre <IconArrowRight class="w-4 h-4" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Pagination -->
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
import { IconArrowLeft, IconRefresh, IconMapPin, IconSearch, IconLocation, IconBriefcase, IconMail, IconCalendar, IconUsers, IconArrowRight } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const jobsStore = useJobsStore();
const { jobs, isLoading, error } = storeToRefs(jobsStore);

const searchQuery = ref('');
const sortOption = ref('default');
const contractFilter = ref('');

// --- Chargement initial des offres ---
const refreshCompanyJobs = () => jobsStore.fetchJobs();
onMounted(refreshCompanyJobs);

// --- Données de l'entreprise et de ses offres ---
const companyJobs = computed(() =>
  jobs.value.filter(job =>
    job.company?.id === Number(route.params.id) &&
    job.status === 'opened' // S'assurer que seules les offres ouvertes sont affichées
  )
);

const company = computed(() => {
  // Récupère les infos de l'entreprise à partir de la première offre trouvée
  return companyJobs.value[0]?.company || null;
});

// --- Filtres dynamiques pour les types de contrat ---
const contractTypes = computed(() => {
  const types = new Set<string>();
  companyJobs.value.forEach(job => {
    if (job.contract) types.add(job.contract);
  });
  return Array.from(types).sort(); // Tri alphabétique pour la liste déroulante
});

// --- Filtrage des offres par recherche et contrat ---
const filteredJobs = computed(() =>
  companyJobs.value.filter(job => {
    const search = searchQuery.value.toLowerCase();
    // Recherche par titre de poste, profil, résumé ou localisation
    const matchesSearch = job.post.toLowerCase().includes(search) ||
                          job.profile.toLowerCase().includes(search) ||
                          job.summary.toLowerCase().includes(search) ||
                          job.location.toLowerCase().includes(search);

    // Filtrage par type de contrat
    const matchesContract = !contractFilter.value || job.contract === contractFilter.value;

    return matchesSearch && matchesContract;
  })
);

// --- Tri des offres ---
const sortedJobs = computed(() => {
  const sorted = [...filteredJobs.value]; // Crée une copie pour ne pas modifier l'original
  switch (sortOption.value) {
    case 'alpha-asc':
      return sorted.sort((a, b) => a.post.localeCompare(b.post));
    case 'alpha-desc':
      return sorted.sort((a, b) => b.post.localeCompare(a.post));
    case 'positions-desc':
      return sorted.sort((a, b) => b.placeNumber - a.placeNumber);
    case 'positions-asc':
      return sorted.sort((a, b) => a.placeNumber - b.placeNumber);
    case 'closing-desc': // Date de clôture la plus éloignée en premier
      return sorted.sort((a, b) => new Date(b.closingDate).getTime() - new Date(a.closingDate).getTime());
    case 'closing-asc': // Date de clôture la plus proche en premier
      return sorted.sort((a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime());
    default:
      return sorted; // Tri par défaut (ordre d'arrivée ou défini par l'API)
  }
});

// --- Métriques de l'entreprise ---
const totalPositions = computed(() =>
  companyJobs.value.reduce((acc, job) => acc + job.placeNumber, 0)
);

const avgPositions = computed(() =>
  companyJobs.value.length ? Math.round(totalPositions.value / companyJobs.value.length) : 0
);

const nextClosing = computed(() => {
  const now = Date.now();
  const futureDates = companyJobs.value
    .map(j => new Date(j.closingDate).getTime())
    .filter(timestamp => timestamp > now); // Seulement les dates futures

  return futureDates.length > 0
    ? format(Math.min(...futureDates), 'dd MMMM yyyy', { locale: fr })
    : 'Aucune';
});

// --- Pagination ---
const itemsPerPage = 9; // Augmenté pour un affichage plus dense et harmonieux
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(sortedJobs.value.length / itemsPerPage));
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedJobs.value.slice(start, start + itemsPerPage);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte en haut de la liste
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte en haut de la liste
  }
}

// Réinitialise la pagination quand les filtres ou la recherche changent
watch([searchQuery, contractFilter, sortOption], () => {
  currentPage.value = 1;
});

// --- Helpers pour le formatage et les classes ---
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

// --- Gestion d'erreur d'image (pour les logos d'entreprise) ---
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const name = target.alt.replace('Logo de ', '') || 'Entreprise Inconnue';
  // Génère un avatar initial si le logo ne charge pas, avec des couleurs personnalisées
  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=e0f2fe,c0e3fd&fontColor=0369a1`;
};

// Fonction pour effacer tous les filtres
const clearFilters = () => {
  searchQuery.value = '';
  contractFilter.value = '';
  sortOption.value = 'default';
};

// --- SEO (Search Engine Optimization) ---
useSeoMeta({
  title: `Offres d'emploi chez ${company.value?.name || 'cette entreprise'}`,
  ogTitle: `Découvrez les offres d'emploi chez ${company.value?.name || 'cette entreprise'}`,
  description: `Consultez toutes les offres d'emploi actives et les opportunités de carrière chez ${company.value?.name || 'cette entreprise'} sur SuitOps Hire au Bénin.`,
});
</script>

<style scoped>
/* Animation pour l'icône de rafraîchissement */
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
