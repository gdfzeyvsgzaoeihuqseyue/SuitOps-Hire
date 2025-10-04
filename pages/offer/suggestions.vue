<template>
  <div class="p-4 sm:p-6 mt-6 min-h-screen">
    <!-- En-tête de la page -->
    <header class="mb-8 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Suggestions pour vous</h1>
          <p class="text-gray-600">Découvrez les offres d'emploi les plus pertinentes</p>
        </div>

        <button @click="refreshSuggestions"
          class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-200 mt-4 sm:mt-0">
          <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
            'animate-spin': isLoading,
            'group-hover:rotate-180': !isLoading
          }" />
          Actualiser les suggestions
        </button>
      </div>

      <!-- Filtres et Recherche -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <!-- Barre de recherche -->
        <div class="w-full md:w-2/3 lg:w-1/2">
          <div class="relative">
            <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input v-model="jobsStore.searchQuery" type="text"
              placeholder="Rechercher par poste, entreprise ou lieu..."
              class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" />
          </div>
        </div>

        <!-- Filtres (Badge et Tri) -->
        <div class="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
          <!-- Filtre par badge -->
          <select v-model="selectedBadge"
            class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
            <option value="">Tous les badges</option>
            <option v-for="badge in availableBadges" :key="badge" :value="badge">
              {{ badge }}
            </option>
          </select>
          <!-- Trier -->
          <select v-model="sortOption"
            class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
            <option value="default">Tri par pertinence</option>
            <option value="alpha-asc">Titre (A-Z)</option>
            <option value="alpha-desc">Titre (Z-A)</option>
            <option value="closingDateDesc">Clôture la plus éloignée</option>
            <option value="closingDateAsc">Clôture la plus proche</option>
            <option value="placeNumberDesc">Plus de postes disponibles</option>
            <option value="placeNumberAsc">Moins de postes disponibles</option>
          </select>
        </div>
      </div>
    </header>

    <!-- États de chargement, d'erreur ou d'absence de données -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Préparation de vos suggestions...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-center">
      <p class="text-red-700 font-medium mb-2">Une erreur est survenue lors du chargement des suggestions.</p>
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button @click="refreshSuggestions" class="mt-4 text-red-600 hover:text-red-800 font-medium border border-red-600 rounded-md px-4 py-2 hover:bg-red-50 transition-colors">
        Réessayer
      </button>
    </div>

    <div v-else-if="suggestions.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ jobsStore.searchQuery ? 'Aucun résultat trouvé' : 'Aucune suggestion disponible pour le moment' }}
        </h3>
        <p class="text-gray-500">
          {{ jobsStore.searchQuery
            ? `Aucune offre ne correspond à votre recherche : "${jobsStore.searchQuery}".`
            : 'Ajustez vos préférences ou revenez plus tard pour de nouvelles suggestions.' }}
        </p>
        <button v-if="jobsStore.searchQuery" @click="jobsStore.searchQuery = ''"
          class="mt-4 text-primary hover:text-secondary font-medium underline">
          Effacer la recherche
        </button>
      </div>
    </div>

    <!-- Liste des suggestions -->
    <div v-else>
      <p class="text-gray-600 text-center my-6">
        {{ suggestions.length }} suggestion{{ suggestions.length > 1 ? 's' : '' }} pertinente{{ suggestions.length > 1 ?
          's' : '' }} pour vous
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="job in suggestions" :key="job.id"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] relative">
          <!-- Badges de recommandation -->
          <div class="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <span v-for="badge in getJobBadges(job)" :key="badge"
              class="px-2 py-1 text-xs font-medium rounded-full shadow-sm" :class="getBadgeClass(badge)">
              {{ badgeEmojis[badge] }} {{ badge }}
            </span>
          </div>

          <!-- En-tête de l'offre -->
          <div class="flex items-start gap-4 mb-4">
            <NuxtLink :to="`/offer/company/${job.company.id}/${job.company.name}`" target="_blank" class="group">
              <img :src="job.company.logo?.url || defaultLogo(job.company.name)" :alt="`Logo de ${job.company.name}`"
                class="w-12 h-12 rounded-full border border-gray-200 object-cover flex-shrink-0" />
            </NuxtLink>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 leading-tight">{{ job.post }}</h2>
              <NuxtLink :to="`/offer/company/${job.company.id}/${job.company.name}`"
                class="text-primary hover:text-secondary text-sm transition-colors"
                :title="`Consulter le profil de ${job.company.name}`">
                {{ job.company.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Métadonnées -->
          <div class="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-gray-600 text-sm border-y border-gray-200 py-3">
            <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getContractClass(job.contract)">
              {{ job.contract }}
            </span>
            <span class="flex items-center">
              <IconLocation class="w-4 h-4 mr-1 text-primary" /> {{ job.location }}
            </span>
            <span class="flex items-center">
              <IconUsers class="w-4 h-4 mr-1 text-primary" /> {{ job.placeNumber }} poste{{ job.placeNumber !== 1 ? 's' : '' }}
            </span>
            <span class="flex items-center">
              <IconCalendar class="w-4 h-4 mr-1 text-primary" /> Clôture : {{ formatDate(job.closingDate) }}
            </span>
          </div>

          <!-- Extrait -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-3" v-html="job.summary"></p>

          <!-- Actions -->
          <div class="flex items-center justify-between mt-4">
            <NuxtLink :to="`/offer/${job.id}/${job.slug}`"
              class="text-primary hover:text-secondary flex items-center gap-1 text-sm font-medium transition-colors">
              Voir l'offre <IconArrowRight class="w-4 h-4" />
            </NuxtLink>
            <span class="text-xs text-gray-500">
              Publié le {{ formatDate(job.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useJobsStore } from '~/stores/job';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IconRefresh, IconSearch, IconLocation, IconUsers, IconCalendar, IconArrowRight } from '@tabler/icons-vue';

// --- Store et Données de base ---
const jobsStore = useJobsStore();
const { jobs, isLoading, error, searchQuery } = storeToRefs(jobsStore);

// --- Réactifs pour les filtres et le tri ---
const sortOption = ref('default');
const selectedBadge = ref('');

// --- Badges et Recommandations ---

// Mapping des badges avec des emojis pour une meilleure visibilité
const badgeEmojis: { [key: string]: string } = {
  'Clôture proche': '⏳',
  'Plusieurs postes': '🔢', 
  'Grande entreprise': '🏢', 
  'Emploi stable': '✅', 
  'Quiz disponible': '📝', 
  'Urgent': '⚡',
  'Nouveau': '✨', 
};

// Fonctions pour déterminer les badges
const isClosingSoon = (job: any) => differenceInDays(new Date(job.closingDate), new Date()) <= 7 && differenceInDays(new Date(job.closingDate), new Date()) > 0;
const isUrgent = (job: any) => differenceInDays(new Date(job.closingDate), new Date()) <= 3 && differenceInDays(new Date(job.closingDate), new Date()) > 0;
const hasMultiplePositions = (job: any) => job.placeNumber > 1;
const isNewJob = (job: any) => differenceInDays(new Date(), new Date(job.createdAt)) <= 7; 

// Récupère tous les badges applicables à une offre donnée
const getJobBadges = (job: any) => {
  const badges = [];
  if (isNewJob(job)) badges.push('Nouveau');
  if (isClosingSoon(job)) badges.push('Clôture proche');
  if (hasMultiplePositions(job)) badges.push('Plusieurs postes'); // Consistent naming
  if ((job.company as any).storage >= 1000000) badges.push('Grande entreprise');
  if (job.contract === 'CDI') badges.push('Emploi stable');
  if (job.quizzes?.length > 0) badges.push('Quiz disponible'); // Consistent naming
  if (isUrgent(job)) badges.push('Urgent');
  return badges;
};

// Donne la classe Tailwind CSS pour un badge spécifique
const getBadgeClass = (badge: string) => {
  switch (badge) {
    case 'Nouveau': return 'bg-blue-100 text-blue-800';
    case 'Clôture proche': return 'bg-red-100 text-red-800';
    case 'Plusieurs postes': return 'bg-green-100 text-green-800';
    case 'Grande entreprise': return 'bg-purple-100 text-purple-800';
    case 'Emploi stable': return 'bg-teal-100 text-teal-800';
    case 'Quiz disponible': return 'bg-yellow-100 text-yellow-800';
    case 'Urgent': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Liste dynamique des badges disponibles pour le filtre
const availableBadges = computed(() => {
  const allBadges = jobs.value.flatMap(job => getJobBadges(job));
  return [...new Set(allBadges)].sort(); // Tri alphabétique pour la liste déroulante
});

// Calcule un score de recommandation pour chaque offre
const calculateRecommendationScore = (job: any) => {
  let score = 0;
  if (isNewJob(job)) score += 6; // Nouveau est très pertinent
  if (isUrgent(job)) score += 5; // Urgent est très pertinent
  else if (isClosingSoon(job)) score += 4; // Moins urgent mais important
  if (job.contract === 'CDI') score += 3;
  if (hasMultiplePositions(job)) score += 2;
  if ((job.company as any).storage >= 1000000) score += 1;
  if (job.quizzes?.length > 0) score += 1;
  return score;
};

// --- Offres suggérées (filtrées, triées et scorées) ---
const suggestions = computed(() => {
  let filtered = jobs.value.filter(job =>
    job.status === 'opened' &&
    new Date(job.closingDate) > new Date() // S'assurer que l'offre n'est pas clôturée
  );

  // Recherche par mots-clés
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(job =>
      job.post.toLowerCase().includes(query) ||
      job.company.name.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.summary.toLowerCase().includes(query) // Inclure le résumé dans la recherche
    );
  }

  // Filtrage par badge sélectionné
  if (selectedBadge.value) {
    filtered = filtered.filter(job =>
      getJobBadges(job).includes(selectedBadge.value)
    );
  }

  // Calcul du score et tri par pertinence par défaut
  const scored = filtered.map(job => ({
    ...job,
    score: calculateRecommendationScore(job)
  }));

  // Tri final
  scored.sort((a, b) => {
    switch (sortOption.value) {
      case 'alpha-asc': return a.post.localeCompare(b.post);
      case 'alpha-desc': return b.post.localeCompare(a.post);
      case 'closingDateAsc': return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
      case 'closingDateDesc': return new Date(b.closingDate).getTime() - new Date(a.closingDate).getTime();
      case 'placeNumberAsc': return a.placeNumber - b.placeNumber;
      case 'placeNumberDesc': return b.placeNumber - a.placeNumber;
      case 'default':
      default: return b.score - a.score; // Tri par score de recommandation (le plus élevé d'abord)
    }
  });

  // Limiter le nombre de suggestions affichées (pourrait être paginé si trop d'offres)
  return scored; // Removed .slice(0, 6) to show all matching suggestions, pagination can be added if needed
});

// --- Helpers pour le formatage et les classes ---
const formatDate = (timestamp: number) => format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr });

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

const defaultLogo = (name: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;

// --- Actions ---
const refreshSuggestions = () => jobsStore.fetchJobs();

// --- Chargement initial et watchers ---
onMounted(refreshSuggestions);

// Réinitialise les filtres et le tri quand la recherche globale change
watch(searchQuery, () => {
  selectedBadge.value = '';
  sortOption.value = 'default';
});

// --- SEO (Search Engine Optimization) ---
useSeoMeta({
  title: "Suggestions d'offres d'emploi personnalisées",
  ogTitle: "Découvrez les offres d'emploi recommandées pour vous",
  description: "Recevez des suggestions d'offres d'emploi personnalisées et pertinentes adaptées à votre profil et vos préférences. Trouvez votre prochain défi professionnel avec SuitOps Hire au Bénin.",
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