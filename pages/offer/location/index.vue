<template>
  <div class="p-4 sm:p-6 mt-6 min-h-screen">
    <!-- En-tête de la page -->
    <header class="mb-8 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Offres par localisation</h1>
          <p class="text-gray-600">Explorez les opportunités d'emploi par ville ou région</p>
        </div>

        <button @click="refreshLocation"
          class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-200 mt-4 sm:mt-0">
          <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
            'animate-spin': isLoading,
            'group-hover:rotate-180': !isLoading
          }" />
          Actualiser les lieux
        </button>
      </div>

      <!-- Filtres et Recherche -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <!-- Barre de recherche -->
        <div class="w-full md:w-2/3 lg:w-1/2">
          <div class="relative">
            <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input v-model="jobsStore.searchQuery" type="text" placeholder="Rechercher une ville ou une région..."
              class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" />
          </div>
        </div>

        <!-- Tri des résultats -->
        <div class="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
          <div>
            <select v-model="sortOption"
              class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
              <option value="default">Tri par défaut</option>
              <option value="alpha-asc">Nom (A-Z)</option>
              <option value="alpha-desc">Nom (Z-A)</option>
              <option value="most-posts">Plus d'offres</option>
              <option value="least-posts">Moins d'offres</option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <!-- États de chargement, d'erreur ou d'absence de données -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement des localisations...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-center">
      <p class="text-red-700 font-medium mb-2">Une erreur est survenue lors du chargement des localisations.</p>
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button @click="refreshLocation" class="mt-4 text-red-600 hover:text-red-800 font-medium border border-red-600 rounded-md px-4 py-2 hover:bg-red-50 transition-colors">
        Réessayer
      </button>
    </div>

    <div v-else-if="sortedLocations.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-4">🌍</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ jobsStore.searchQuery ? 'Aucun résultat trouvé' : 'Aucun lieu disponible pour le moment' }}
        </h3>
        <p class="text-gray-500">
          {{ jobsStore.searchQuery
            ? `Nous n'avons trouvé aucune localisation correspondant à votre recherche : "${jobsStore.searchQuery}".`
            : 'Revenez régulièrement pour découvrir de nouvelles opportunités par lieu.' }}
        </p>
        <button v-if="jobsStore.searchQuery" @click="jobsStore.searchQuery = ''"
          class="mt-4 text-primary hover:text-secondary font-medium underline">
          Effacer la recherche
        </button>
      </div>
    </div>

    <!-- Liste des localisations -->
    <div v-else>
      <p class="text-gray-600 text-center my-6">
        {{ sortedLocations.length }} lieu{{ sortedLocations.length > 1 ? 'x' : '' }} avec des offres active{{
          sortedLocations.length > 1 ? 's' : '' }}
      </p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink v-for="location in paginatedLocations" :key="location"
          :to="`/offer/location/${encodeURIComponent(location)}`"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] flex flex-col items-center text-center">
          <IconLocation class="w-12 h-12 text-primary mb-4 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <h2 class="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors truncate mb-1" :title="location">
              {{ location }}
            </h2>
            <p class="text-gray-600 text-sm">
              <span class="font-bold text-primary">{{ jobCounts[location] }}</span> offre{{ jobCounts[location] !== 1 ? 's' : '' }} disponible{{
                jobCounts[location] !== 1 ? 's' : '' }}
            </p>
          </div>
        </NuxtLink>
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
import { onMounted, computed, ref, watch } from 'vue';
import { useJobsStore } from '~/stores/job';
import { storeToRefs } from 'pinia';
import { IconRefresh, IconSearch, IconLocation } from '@tabler/icons-vue';

// --- Store et Données de base ---
const jobsStore = useJobsStore();
const { isLoading, error, jobs } = storeToRefs(jobsStore);

// Normalisation des localisations (supprime les détails après la première virgule et nettoie)
const normalizeLocation = (location: string) => {
  let cleaned = location.trim().split(',')[0].trim();
  // Optionnel: Capitaliser la première lettre de chaque mot pour l'affichage
  return cleaned.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Extraction des localisations uniques
const locations = computed(() => {
  const locationsSet = new Set<string>(); // Utiliser un Set pour garantir l'unicité
  jobs.value.forEach(job => {
    if (job.location) {
      const normalized = normalizeLocation(job.location);
      if (normalized) { // S'assurer que la localisation n'est pas vide après normalisation
        locationsSet.add(normalized);
      }
    }
  });
  // Retourne un tableau trié alphabétiquement par défaut pour une meilleure prévisibilité
  return Array.from(locationsSet).sort((a, b) => a.localeCompare(b));
});

// Compte des offres par localisation
const jobCounts = computed(() => {
  const counts: { [key: string]: number } = {};
  jobs.value.forEach(job => {
    if (job.location) {
      const normalized = normalizeLocation(job.location);
      if (normalized) {
        counts[normalized] = (counts[normalized] || 0) + 1;
      }
    }
  });
  return counts;
});

// --- Filtrage et Tri ---
const filteredLocations = computed(() => {
  const search = jobsStore.searchQuery.toLowerCase();
  return locations.value.filter(location =>
    location.toLowerCase().includes(search) // Utilise directement la localisation normalisée pour la recherche
  );
});

const sortOption = ref<string>('default');
const sortedLocations = computed(() => {
  const result = [...filteredLocations.value]; // Crée une copie pour ne pas modifier l'original

  switch (sortOption.value) {
    case 'alpha-asc': return result.sort((a, b) => a.localeCompare(b));
    case 'alpha-desc': return result.sort((a, b) => b.localeCompare(a));
    case 'most-posts': return result.sort((a, b) => jobCounts.value[b] - jobCounts.value[a]); // Plus d'offres en premier
    case 'least-posts': return result.sort((a, b) => jobCounts.value[a] - jobCounts.value[b]);   // Moins d'offres en premier
    default: return result; // Tri par défaut (alphabétique si `locations` est déjà trié)
  }
});

// --- Pagination ---
const itemsPerPage = 12; // Augmenté pour un affichage plus dense
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(sortedLocations.value.length / itemsPerPage));
const paginatedLocations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedLocations.value.slice(start, start + itemsPerPage);
});

// Navigation pagination
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

// Réinitialise la page à 1 lorsque la recherche ou le tri changent
watch([() => jobsStore.searchQuery, sortOption], () => {
  currentPage.value = 1;
});

// --- Chargement initial ---
const refreshLocation = () => jobsStore.fetchJobs();
onMounted(refreshLocation);

// --- SEO (Search Engine Optimization) ---
useSeoMeta({
  title: "Offres d'emploi par ville et région",
  ogTitle: "Trouvez des emplois par localisation avec SuitOps Hire",
  description: "Découvrez toutes les offres d'emploi disponibles par ville et région au Bénin. Simplifiez votre recherche d'emploi et trouvez des opportunités près de chez vous avec SuitOps Hire.",
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