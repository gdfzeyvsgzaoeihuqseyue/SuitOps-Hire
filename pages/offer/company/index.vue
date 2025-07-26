<template>
  <div class="p-4 sm:p-6 mt-6 min-h-screen bg-gray-50">
    <header class="mb-8 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Offres par entreprise</h1>
          <p class="text-gray-600">Explorez les entreprises qui recrutent actuellement</p>
        </div>

        <button @click="refreshCompanies"
          class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-200 mt-4 sm:mt-0">
          <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
            'animate-spin': isLoading,
            'group-hover:rotate-180': !isLoading
          }" />
          Actualiser les entreprises
        </button>
      </div>

      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="w-full md:w-2/3 lg:w-1/2">
          <div class="relative">
            <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input v-model="jobsStore.searchQuery" type="text"
              placeholder="Rechercher par nom d'entreprise..."
              class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
          <div>
            <select v-model="sortOption"
              class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
              <option value="default">Tri par défaut</option>
              <option value="alpha-asc">Nom (A-Z)</option>
              <option value="alpha-desc">Nom (Z-A)</option>
              <option value="jobs-desc">Plus d'offres</option>
              <option value="jobs-asc">Moins d'offres</option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement des entreprises...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-center">
      <p class="text-red-700 font-medium mb-2">Une erreur est survenue lors du chargement des entreprises.</p>
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button @click="refreshCompanies" class="mt-4 text-red-600 hover:text-red-800 font-medium border border-red-600 rounded-md px-4 py-2 hover:bg-red-50 transition-colors">
        Réessayer
      </button>
    </div>

    <div v-else-if="sortedCompanies.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-4">🏢</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ jobsStore.searchQuery ? 'Aucun résultat trouvé' : 'Aucune entreprise disponible pour le moment' }}
        </h3>
        <p class="text-gray-500">
          {{ jobsStore.searchQuery
            ? `Nous n'avons trouvé aucune entreprise correspondant à votre recherche : "${jobsStore.searchQuery}".`
            : 'Revenez régulièrement pour découvrir de nouvelles entreprises qui recrutent.' }}
        </p>
        <button v-if="jobsStore.searchQuery" @click="jobsStore.searchQuery = ''"
          class="mt-4 text-primary hover:text-secondary font-medium underline">
          Effacer la recherche
        </button>
      </div>
    </div>

    <div v-else>
      <p class="text-gray-600 text-center my-6">
        {{ sortedCompanies.length }} entreprise{{ sortedCompanies.length > 1 ? 's' : '' }} trouvée{{
          sortedCompanies.length > 1 ? 's' : '' }} avec des offres actives
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink v-for="company in paginatedCompanies" :key="company.id"
          :to="`/offer/company/${company.id}/${company.slug}`"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] flex flex-col items-center text-center">
          <img :src="company.logo?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${company.name}&backgroundColor=e0f2fe,c0e3fd&fontColor=0369a1`"
            :alt="`Logo de ${company.name}`" class="w-20 h-20 rounded-full border-2 border-gray-100 object-cover mb-4 flex-shrink-0"
            @error="handleImageError" />
          <div class="flex-1 min-w-0">
            <h2 class="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors truncate mb-1" :title="company.name">
              {{ company.name }}
            </h2>
            <p class="text-gray-600 text-sm">
              <span class="font-bold text-primary">{{ company.jobCount }}</span> offre{{ company.jobCount !== 1 ? 's' : '' }} disponible{{ company.jobCount !== 1 ? 's' : '' }}
            </p>
          </div>
        </NuxtLink>
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
import { computed, onMounted, ref, watch } from 'vue';
import { useJobsStore } from '~/stores/jobs';
import { storeToRefs } from 'pinia';
import { IconRefresh, IconSearch } from '@tabler/icons-vue';

// --- Store et Données de base ---
const jobsStore = useJobsStore();
const { isLoading, error, jobs } = storeToRefs(jobsStore);

// Extraction des entreprises uniques avec le compte de leurs offres
const companies = computed(() => {
  const companiesMap = new Map<number, any>();

  jobs.value.forEach(job => {
    const company = job.company as any;
    if (company?.id) {
      const existing = companiesMap.get(company.id);
      companiesMap.set(company.id, {
        id: company.id,
        name: company.name,
        // Assure un slug valide, même si non fourni par l'API
        slug: company.slug || company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        logo: company.logo,
        jobCount: existing ? existing.jobCount + 1 : 1
      });
    }
  });

  // Convertit la Map en Array et ne garde que les entreprises ayant au moins une offre
  return Array.from(companiesMap.values()).filter(company => company.jobCount > 0);
});

// --- Filtrage et Tri ---
const sortOption = ref('default');

const filteredCompanies = computed(() => {
  let result = companies.value;

  // Filtrage par barre de recherche
  if (jobsStore.searchQuery) {
    result = result.filter(company =>
      company.name.toLowerCase().includes(jobsStore.searchQuery.toLowerCase())
    );
  }
  return result;
});

const sortedCompanies = computed(() => {
  const result = [...filteredCompanies.value]; // Crée une copie pour ne pas modifier l'original
  switch (sortOption.value) {
    case 'alpha-asc': return result.sort((a, b) => a.name.localeCompare(b.name));
    case 'alpha-desc': return result.sort((a, b) => b.name.localeCompare(a.name));
    case 'jobs-desc': return result.sort((a, b) => b.jobCount - a.jobCount); // Plus d'offres en premier
    case 'jobs-asc': return result.sort((a, b) => a.jobCount - b.jobCount);   // Moins d'offres en premier
    default: return result; // Tri par défaut (ordre d'arrivée ou défini par l'API)
  }
});

// --- Pagination ---
const itemsPerPage = 12; // Augmenté pour un affichage plus dense et harmonieux
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(sortedCompanies.value.length / itemsPerPage));
const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedCompanies.value.slice(start, start + itemsPerPage);
});

// Réinitialise la page à 1 lorsque la recherche ou le tri changent
watch([() => jobsStore.searchQuery, sortOption], () => {
  currentPage.value = 1;
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

// --- Logique d'erreur de chargement d'image ---
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const name = target.alt.replace('Logo de ', '') || 'Entreprise Inconnue'; // Utilise le nom de l'entreprise
  // Génère un avatar initial si le logo ne charge pas, avec des couleurs personnalisées
  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=e0f2fe,c0e3fd&fontColor=0369a1`;
};

// --- Rafraîchissement des données ---
const refreshCompanies = () => jobsStore.fetchJobs();

// Chargement initial des offres au montage du composant
onMounted(() => {
  refreshCompanies();
});

// --- SEO (Search Engine Optimization) ---
useSeoMeta({
  title: "Entreprises qui recrutent - Trouvez votre emploi | PGS Hire Bénin",
  ogTitle: "Découvrez les entreprises qui recrutent avec PGS Hire",
  description: "Explorez la liste des entreprises partenaires de PGS Hire au Bénin et découvrez leurs offres d'emploi actives. Trouvez l'employeur idéal pour votre carrière.",
  ogDescription: "Découvrez les entreprises qui recrutent actuellement au Bénin via PGS Hire et trouvez des opportunités de carrière uniques.",
  ogImage: '/img/social-share-companies.png', // Chemin vers une image pertinente pour le partage social
  twitterCard: 'summary_large_image',
  twitterTitle: "Entreprises qui recrutent - PGS Hire",
  twitterDescription: "Explorez la liste des entreprises partenaires de PGS Hire au Bénin et découvrez leurs offres d'emploi actives.",
  twitterImage: '/img/social-share-companies.png',
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
