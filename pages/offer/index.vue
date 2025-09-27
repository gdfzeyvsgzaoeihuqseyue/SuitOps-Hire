<template>
  <div class="flex flex-col lg:flex-row relative mt-6 min-h-screen">
    <main class="flex-1 p-4 sm:p-6">
      <header class="mb-8 flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Offres d'emploi</h1>
            <p class="text-gray-600">Toutes les offres ouvertes disponibles</p>
          </div>

          <button @click="refreshJobs"
            class="group flex items-center gap-2 text-primary hover:text-secondary transition-colors duration-200 mt-4 sm:mt-0">
            <IconRefresh class="w-5 h-5 transition-transform duration-300" :class="{
              'animate-spin': isLoading,
              'group-hover:rotate-180': !isLoading
            }" />
            Actualiser les offres
          </button>
        </div>

        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="w-full md:w-2/3 lg:w-1/2">
            <div class="relative">
              <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input v-model="jobsStore.searchQuery" type="text"
                placeholder="Rechercher par poste, entreprise, lieu ou profil..."
                class="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200" />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-start gap-4 w-full md:w-auto">
            <select v-model="selectedContract"
              class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
              <option value="">Tous les types de contrat</option>
              <option v-for="type in contractTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <select v-model="sortOption"
              class="rounded-md border-gray-300 focus:ring-2 focus:ring-primary py-2 px-3 pr-8 transition-colors duration-200 w-full sm:w-auto">
              <option value="default">Tri par défaut</option>
              <option value="alpha-asc">A-Z</option>
              <option value="alpha-desc">Z-A</option>
              <option value="closingDateDesc">Clôture la plus éloignée</option>
              <option value="closingDateAsc">Clôture la plus proche</option>
              <option value="placeNumberDesc">Plus de postes disponibles</option>
              <option value="placeNumberAsc">Moins de postes disponibles</option>
            </select>
          </div>
        </div>
      </header>

      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-gray-600">Recherche des offres...</p>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-center">
        <p class="text-red-700 font-medium mb-2">Une erreur est survenue lors du chargement des offres.</p>
        <p class="text-red-600 text-sm">{{ error }}</p>
        <button @click="refreshJobs"
          class="mt-4 text-red-600 hover:text-red-800 font-medium border border-red-600 rounded-md px-4 py-2 hover:bg-red-50 transition-colors">
          Réessayer
        </button>
      </div>

      <div v-else-if="processedJobs.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div class="text-6xl mb-4">😕</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ jobsStore.searchQuery ? 'Aucun résultat trouvé' : 'Aucune offre disponible pour le moment' }}
          </h3>
          <p class="text-gray-500">
            {{ jobsStore.searchQuery
              ? `Nous n'avons trouvé aucune offre correspondant à votre recherche : "${jobsStore.searchQuery}".`
              : 'Revenez régulièrement pour découvrir nos nouvelles opportunités.' }}
          </p>
          <button v-if="jobsStore.searchQuery" @click="jobsStore.searchQuery = ''"
            class="mt-4 text-primary hover:text-secondary font-medium underline">
            Effacer la recherche
          </button>
        </div>
      </div>

      <div v-else>
        <p class="text-gray-600 text-center my-6">
          {{ processedJobs.length }} offre{{ processedJobs.length > 1 ? 's' : '' }} active{{ processedJobs.length > 1 ?
            's' : '' }} disponible{{ processedJobs.length > 1 ? 's' : '' }}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="job in paginatedJobs" :key="job.id"
            class="bg-white rounded-lg shadow-md p-6 relative transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
            :class="{ 'lg:blur-sm lg:pointer-events-none': isSidebarOpen && selectedJob?.id !== job.id }">
            <div
              class="absolute top-0 right-4 -translate-y-1/2 px-3 py-1 text-xs font-medium rounded-full shadow-sm z-10"
              :class="getContractClass(job.contract)">
              {{ job.contract }}
            </div>

            <div class="flex items-center justify-between mb-4">
              <div v-if="job.createdAt !== job.closingDate"
                class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"
                title="Cette offre a été modifiée récemment">
                ✎ Modifiée
              </div>
              <div v-else class="h-[20px]"></div> <button @click="toggleSidebar(job)"
                class="p-2 rounded-full transition-colors duration-200"
                :class="isSidebarOpen && selectedJob?.id === job.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'">
                <IconInfoCircle class="h-5 w-5" />
              </button>
            </div>

            <div class="flex flex-col items-start gap-3 mb-4">
              <NuxtLink :to="`https://suitops.netlify.app/company/${job.company.id}/${job.company.name}`"
                target="_blank" class="flex items-center gap-3 group">
                <img
                  :src="job.company.logo?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${job.company.name}`"
                  alt="Logo Entreprise" class="w-12 h-12 object-cover rounded-full border border-gray-200 flex-shrink-0"
                  @error="handleImageError" />
                <div>
                  <span class="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors"
                    :title="`Consulter le profil de ${job.company.name}`">
                    {{ job.company.name }}
                  </span>
                </div>
              </NuxtLink>
              <h2 class="text-xl font-semibold text-gray-900 leading-tight">{{ job.post }}</h2>
              <p class="text-gray-700 text-sm line-clamp-1" :title="job.profile">{{ job.profile }}</p>
            </div>

            <div class="mb-4 text-gray-600 text-sm space-y-2 border-y border-gray-200 py-3">
              <div class="flex items-center">
                <IconUsers class="w-4 h-4 mr-2 text-primary" /> {{ job.placeNumber }} poste{{ job.placeNumber > 1 ? 's'
                  :
                  '' }}
              </div>
              <div class="flex items-center">
                <IconLocation class="w-4 h-4 mr-2 text-primary" /> {{ job.location }}
              </div>
              <div class="flex items-center">
                <IconCalendarX class="w-4 h-4 mr-2 text-primary" /> Clôture : {{ formatDate(job.closingDate) }}
              </div>
            </div>

            <p class="text-gray-600 text-sm mt-2 line-clamp-3" v-html="job.summary"></p>

            <!-- Actions -->
            <div class="flex items-center justify-between mt-4">
              <span class="text-xs text-gray-500">
                Publié le {{ formatDate(job.createdAt) }}
              </span>
              <NuxtLink :to="`/offer/${job.id}/${job.slug}`"
                class="text-primary hover:text-secondary font-medium text-sm flex items-center gap-1 transition-colors">
                Voir l'offre
                <IconArrowRight class="w-4 h-4" />
              </NuxtLink>
            </div>
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
    </main>

    <div v-if="isSidebarOpen" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" @click="closeSidebar">
    </div>

    <transition name="slide">
      <aside v-if="isSidebarOpen"
        class="fixed top-0 right-0 h-full bg-white border-l shadow-xl overflow-y-auto z-50 transition-transform duration-300 ease-in-out w-[80%] sm:w-96 lg:w-80"
        :class="isSidebarOpen ? 'translate-x-0' : 'translate-x-full'">
        <div v-if="selectedJob" class="h-full flex flex-col">
          <header class="sticky top-0 bg-white z-10 border-b p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img
                  :src="selectedJob.company.logo?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedJob.company.name}`"
                  alt="Logo Entreprise" class="w-10 h-10 object-cover rounded-full border border-gray-200"
                  @error="handleImageError" />
                <NuxtLink
                  :to="`https://suitops.netlify.app/company/${selectedJob.company.id}/${selectedJob.company.name}`"
                  target="_blank" :title="`Consulter le profil de ${selectedJob.company.name}`"
                  class="text-lg font-medium text-gray-800 hover:text-primary transition-colors">
                  {{ selectedJob.company.name }}
                </NuxtLink>
              </div>
              <button @click="closeSidebar"
                class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                <IconX
                  class="w-6 h-6 transform transition duration-300 ease-in-out hover:rotate-90 hover:text-critique" />
              </button>
            </div>
            <div class="mt-3 flex items-center justify-between gap-2">
              <h2 class="text-xl font-bold text-primary leading-tight">{{ selectedJob.post }}</h2>
              <button @click="openApplicationModalForSelectedJob"
                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm whitespace-nowrap transition-colors">
                Postuler
              </button>
            </div>
          </header>

          <main class="p-4 flex-1 space-y-5 overflow-y-auto">
            <div v-if="selectedJob.profile && selectedJob.profile.trim() !== '<p> </p>'">
              <p class="text-gray-800 font-semibold mb-1">Profil recherché :</p>
              <div class="text-sm text-gray-700 leading-relaxed" v-html="selectedJob.profile"></div>
            </div>
            <div v-if="selectedJob.skills && selectedJob.skills.trim() !== '<p> </p>'">
              <p class="text-gray-800 font-semibold mb-1">Compétences :</p>
              <div class="text-sm text-gray-700 leading-relaxed" v-html="selectedJob.skills"></div>
            </div>
            <div v-if="selectedJob.aptitudes && selectedJob.aptitudes.trim() !== '<p> </p>'">
              <p class="text-gray-800 font-semibold mb-1">Aptitudes :</p>
              <div class="text-sm text-gray-700 leading-relaxed" v-html="selectedJob.aptitudes"></div>
            </div>
            <div v-if="selectedJob.tasks && selectedJob.tasks.trim() !== '<p> </p>'">
              <p class="text-gray-800 font-semibold mb-1">Tâches :</p>
              <div class="text-sm text-gray-700 leading-relaxed" v-html="selectedJob.tasks"></div>
            </div>
            <div v-if="selectedJob.requiredDocument && selectedJob.requiredDocument.trim() !== '<p> </p>'">
              <p class="text-gray-800 font-semibold mb-1">Documents requis :</p>
              <div class="text-sm text-gray-700 leading-relaxed" v-html="selectedJob.requiredDocument"></div>
            </div>
          </main>

          <footer class="sticky bottom-0 bg-white z-10 p-4 border-t shadow-sm">
            <NuxtLink :to="`/offer/${selectedJob.id}/${selectedJob.slug}`"
              class="block text-center bg-primary hover:bg-secondary text-white font-medium py-2.5 rounded-lg transition-colors duration-200">
              Voir l'offre complète
            </NuxtLink>
          </footer>
        </div>
      </aside>
    </transition>

    <JobApplicationModal ref="jobApplicationModalRef" :target-url="currentJobRedirectUrl" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useJobsStore } from '~/stores/jobs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { storeToRefs } from 'pinia';
import { IconRefresh, IconSearch, IconInfoCircle, IconLocation, IconUsers, IconCalendarX, IconX, IconArrowRight } from '@tabler/icons-vue';

// Import the JobApplicationModal component
import JobApplicationModal from '~/components/JobApplicationModal.vue';

// --- Store et Données de base ---
const jobsStore = useJobsStore();
const { isLoading, error, filteredJobs: storeFilteredJobs, jobs } = storeToRefs(jobsStore);

// Ref for the modal component
const jobApplicationModalRef = ref<InstanceType<typeof JobApplicationModal> | null>(null);

// Determine the unique contract types available
const contractTypes = computed(() => {
  const typesSet = new Set<string>();
  jobs.value.forEach(job => {
    if (job.contract) {
      typesSet.add(job.contract);
    }
  });
  return Array.from(typesSet);
});

// --- Filter and Sort ---
const selectedContract = ref<string>('');
const sortOption = ref<string>('default');

// The `processedJobs` is the data source after applying filters and sorting
const processedJobs = computed(() => {
  let result = storeFilteredJobs.value; // Already filtered by the store's search bar

  // Filtering by contract type
  if (selectedContract.value) {
    result = result.filter(job => job.contract === selectedContract.value);
  }

  // Sorting results
  switch (sortOption.value) {
    case 'alpha-asc':
      result = [...result].sort((a, b) => a.post.localeCompare(b.post));
      break;
    case 'alpha-desc':
      result = [...result].sort((a, b) => b.post.localeCompare(a.post));
      break;
    case 'closingDateDesc': // Furthest closing date first
      result = [...result].sort((a, b) =>
        new Date(b.closingDate).getTime() - new Date(a.closingDate).getTime()
      );
      break;
    case 'closingDateAsc': // Closest closing date first
      result = [...result].sort((a, b) =>
        new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
      );
      break;
    case 'placeNumberDesc': // More available positions first
      result = [...result].sort((a, b) => b.placeNumber - a.placeNumber);
      break;
    case 'placeNumberAsc': // Fewer available positions first
      result = [...result].sort((a, b) => a.placeNumber - b.placeNumber);
      break;
    case 'default':
    default:
      // Default option: can be sorted by most recent publication date or ID
      // For now, it's the order returned by the store
      break;
  }
  return result;
});

// --- Pagination ---
const itemsPerPage = 9; // Changed to 9 for better grid layout (3x3 on large screens)
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(processedJobs.value.length / itemsPerPage));
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return processedJobs.value.slice(start, start + itemsPerPage);
});

// Reset current page to 1 when filters change
watch([processedJobs, selectedContract, sortOption], () => {
  currentPage.value = 1;
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    // Scroll to top of job list after changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    // Scroll to top of job list after changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// --- Date Formatting ---
const formatDate = (timestamp: number) =>
  format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr });

// --- Sidebar Management (Job Details) ---
const isSidebarOpen = ref(false);
const selectedJob = ref<any | null>(null);

function toggleSidebar(job: any) {
  if (selectedJob.value?.id === job.id && isSidebarOpen.value) {
    // If the same job is already selected and sidebar is open, close it
    closeSidebar();
  } else {
    // Otherwise, select this job and open the sidebar
    selectedJob.value = job;
    isSidebarOpen.value = true;
  }
}

function closeSidebar() {
  isSidebarOpen.value = false;
  selectedJob.value = null; // Clear selected job when closing sidebar
}

// --- Image Error Handling (for company logos) ---
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const name = target.alt || 'Logo Entreprise';
  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
};

// --- Initial Job Load ---
const refreshJobs = () => jobsStore.fetchJobs();
onMounted(() => {
  refreshJobs();
  // Close sidebar on initial load or navigation to this page
  closeSidebar();
});

// Watch for route changes to close sidebar (important for direct URL access to job pages)
const route = useRoute();
watch(route, () => {
  closeSidebar();
});

// --- Modal Integration Logic ---
const currentJobRedirectUrl = computed(() => {
  if (selectedJob.value) {
    return `https://hire.pgs.ctrlengine.com/offer/${selectedJob.value.id}/${selectedJob.value.slug}`;
  }
  return ''; // Return empty string if no job selected
});

const openApplicationModalForSelectedJob = () => {
  if (jobApplicationModalRef.value && selectedJob.value) {
    jobApplicationModalRef.value.openModal();
  }
};

// --- SEO ---
useHead({
  title: "Offres d'emploi",
  meta: [
    {
      name: 'description',
      content: "Découvrez et postulez à des milliers d'offres d'emploi et de stage au Bénin et dans la sous-région. Trouvez votre prochain défi professionnel avec SuitOps Hire."
    },
    { property: 'og:title', content: "Offres d'emploi - SuitOps Hire" },
  ]
});

// --- CSS Classes for contract badges ---
const getContractClass = (contract: string) => {
  switch (contract.toLowerCase()) {
    case 'cdi': return 'bg-green-100 text-green-800';
    case 'cdd': return 'bg-purple-100 text-purple-800';
    case 'stage': return 'bg-orange-100 text-orange-800';
    case 'alternance': return 'bg-blue-100 text-blue-800';
    case 'freelance': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>

<style scoped>
/* Transition pour la sidebar latérale */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Styles pour les éléments HTML générés par v-html, pour s'assurer qu'ils sont lisibles */
.text-sm div :deep(ul),
.text-sm div :deep(ol) {
  list-style-type: disc;
  margin-left: 1.25rem;
  padding-left: 0.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.text-sm div :deep(li) {
  margin-bottom: 0.25rem;
}

.text-sm div :deep(p) {
  margin-bottom: 0.5rem;
}

.text-sm div :deep(a) {
  color: theme('colors.primary');
  text-decoration: underline;
}

.text-sm div :deep(strong) {
  font-weight: 600;
}

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
