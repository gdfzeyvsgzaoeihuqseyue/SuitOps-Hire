<template>
  <main class="p-4 sm:p-6 mt-6 min-h-screen bg-gray-50">
    <!-- Back Button -->
    <button @click="router.go(-1)" class="text-primary hover:text-secondary flex items-center gap-2 font-medium mb-6 transition-colors duration-200">
      <IconArrowLeft class="w-5 h-5" />
      Retour aux offres
    </button>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement de l'offre d'emploi...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-center">
      <p class="text-red-700 font-medium mb-2">Une erreur est survenue lors du chargement de l'offre.</p>
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button @click="loadJob" class="mt-4 text-red-600 hover:text-red-800 font-medium border border-red-600 rounded-md px-4 py-2 hover:bg-red-50 transition-colors">
        Réessayer
      </button>
    </div>

    <!-- Job Details Content -->
    <div v-else-if="currentJob">
      <!-- Header Section: Job Title, Company, Apply Button, Key Info -->
      <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{{ currentJob.post }}</h1>
              <span :class="getContractClass(currentJob.contract)"
                class="px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap shadow-sm">
                {{ currentJob.contract }}
              </span>
            </div>
            <NuxtLink :to="`/offer/company/${currentJob.company.id}/${currentJob.company.name}`"
              class="text-gray-600 hover:text-primary text-base transition-colors duration-200 block"
              :title="`Consulter le profil de ${currentJob.company.name}`">
              {{ currentJob.company.name }}
            </NuxtLink>
          </div>
          <div class="mt-4 sm:mt-0 flex-shrink-0">
            <button
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200">
              Postuler
            </button>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
          <div class="flex items-center">
            <IconLocation class="h-5 w-5 mr-2 text-primary" />
            {{ currentJob.location }}
          </div>
          <div class="flex items-center">
            <IconCalendar class="h-5 w-5 mr-2 text-primary" />
            Date limite: {{ formatDate(currentJob.closingDate) }}
          </div>
          <div class="flex items-center">
            <IconUsers class="h-5 w-5 mr-2 text-primary" />
            {{ currentJob.placeNumber }} poste{{ currentJob.placeNumber > 1 ? 's' : '' }}
          </div>
          <div class="flex items-center" v-if="currentJob.email">
            <IconMail class="h-5 w-5 mr-2 text-primary" />
            {{ currentJob.email }}
          </div>
        </div>
      </div>

      <!-- Main Content Area: Job Description, Tasks, Skills, Aptitudes -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Main Job Details -->
        <div class="lg:col-span-2 space-y-8">
          <div v-if="!hasDetails" class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg shadow-sm text-center">
            <p class="font-medium">Aucun détail spécifique défini pour ce poste. Veuillez consulter le résumé ou contacter l'entreprise.</p>
          </div>

          <div v-if="currentJob.summary && currentJob.summary.trim() !== '<p> </p>'"
            class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Description du poste</h2>
            <div class="prose max-w-none" v-html="currentJob.summary"></div>
          </div>

          <div v-if="currentJob.tasks && currentJob.tasks.trim() !== '<p> </p>'"
            class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Tâches principales</h2>
            <div class="prose max-w-none" v-html="currentJob.tasks"></div>
          </div>

          <div v-if="currentJob.skills && currentJob.skills.trim() !== '<p> </p>'"
            class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Compétences requises</h2>
            <div class="prose max-w-none" v-html="currentJob.skills"></div>
          </div>

          <div v-if="currentJob.aptitudes && currentJob.aptitudes.trim() !== '<p> </p>'"
            class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Aptitudes et qualités</h2>
            <div class="prose max-w-none" v-html="currentJob.aptitudes"></div>
          </div>
        </div>

        <!-- Right Column: Company Info, Required Documents, Quiz Status -->
        <div class="space-y-8">
          <!-- Company Info Card -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">À propos de l'entreprise</h2>
            <div class="space-y-4 text-gray-700">
              <div>
                <h3 class="font-medium text-gray-900 mb-1">{{ currentJob.company.name }}</h3>
                <p>{{ currentJob.company.mainActivity }}</p>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 mb-1">Localisation</h3>
                <p>{{ currentJob.company.address }}</p>
              </div>
              <div v-if="currentJob.company.phoneNumber">
                <h3 class="font-medium text-gray-900 mb-1">Téléphone</h3>
                <p>{{ currentJob.company.phoneNumber }}</p>
              </div>
              <div v-if="currentJob.company.emailAddress">
                <h3 class="font-medium text-gray-900 mb-1">Email</h3>
                <p>{{ currentJob.company.emailAddress }}</p>
              </div>
              <NuxtLink :to="`/offer/company/${currentJob.company.id}/${currentJob.company.name}`"
                class="inline-flex items-center text-primary hover:text-secondary font-medium text-sm mt-2 transition-colors">
                Voir le profil complet <IconArrowRight class="w-4 h-4 ml-1" />
              </NuxtLink>
            </div>
          </div>

          <!-- Required Documents Section -->
          <div v-if="currentJob.requiredDocument && currentJob.requiredDocument.trim() !== '<p> </p>'"
            class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Documents requis pour postuler</h2>
            <div class="prose max-w-none" v-html="currentJob.requiredDocument"></div>
          </div>
          <div v-else class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg shadow-sm">
            <p class="font-medium text-center">Les documents requis ne sont pas spécifiés. Veuillez soumettre les documents habituels via le formulaire de candidature.</p>
          </div>

          <!-- Quiz Section (Modified as per request) -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Évaluation technique (Quiz)</h2>
            <div v-if="currentJob.quizzes && currentJob.quizzes.length > 0" class="text-green-700 bg-green-50 p-4 rounded-md flex items-center gap-2">
              <IconCircleCheck class="w-6 h-6 flex-shrink-0" />
              <p class="font-medium">Cette offre contient un quiz technique. Préparez-vous !</p>
            </div>
            <div v-else class="text-gray-700 bg-gray-50 p-4 rounded-md flex items-center gap-2">
              <IconInfoCircle class="w-6 h-6 flex-shrink-0" />
              <p class="font-medium">Cette offre ne contient pas de quiz technique.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Job Found State -->
    <div v-else class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-4">😔</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Offre non trouvée</h3>
        <p class="text-gray-500">
          L'offre d'emploi que vous recherchez n'existe pas ou a été retirée.
        </p>
        <NuxtLink to="/offer"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary transition-colors">
          Voir toutes les offres
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IconArrowLeft, IconLocation, IconCalendar, IconUsers, IconMail, IconArrowRight, IconCircleCheck, IconInfoCircle } from '@tabler/icons-vue';
import { useJobsStore } from '~/stores/jobs';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const jobsStore = useJobsStore();
const { isLoading, error, currentJob } = storeToRefs(jobsStore);

// --- Data Fetching ---
const loadJob = async () => {
  const id = route.params.id as string;
  await jobsStore.fetchJobById(id);
};

onMounted(() => {
  loadJob();
});

// --- Computed Properties ---
const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr });
};

const hasDetails = computed(() => {
  return !!(
    currentJob.value?.summary?.trim() !== '<p> </p>' && currentJob.value?.summary?.trim() !== '' ||
    currentJob.value?.tasks?.trim() !== '<p> </p>' && currentJob.value?.tasks?.trim() !== '' ||
    currentJob.value?.skills?.trim() !== '<p> </p>' && currentJob.value?.skills?.trim() !== '' ||
    currentJob.value?.aptitudes?.trim() !== '<p> </p>' && currentJob.value?.aptitudes?.trim() !== ''
  );
});

// --- Helper for Contract Class ---
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

// --- SEO Configuration ---
useSeoMeta({
  title: currentJob.value ? `${currentJob.value.post} - ${currentJob.value.company.name}` : 'Offre d\'emploi introuvable',
  ogTitle: currentJob.value ? `${currentJob.value.post} chez ${currentJob.value.company.name}` : 'Offre d\'emploi',
  description: currentJob.value ? `Détails de l'offre d'emploi pour ${currentJob.value.post} chez ${currentJob.value.company.name}. Postulez dès maintenant sur SuitOps Hire.` : 'Consultez les détails des offres d\'emploi sur SuitOps Hire.',
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

/* Styles for HTML content injected via v-html (using Tailwind's @tailwindcss/typography plugin) */
.prose :deep(ul),
.prose :deep(ol) {
  list-style-type: disc; /* or decimal for ol */
  margin-left: 1.25em; /* 5 units in Tailwind */
  padding-left: 0.25em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :deep(li) {
  margin-bottom: 0.25em;
}

.prose :deep(p) {
  margin-bottom: 0.5em;
}

.prose :deep(a) {
  color: theme('colors.primary');
  text-decoration: underline;
}

.prose :deep(strong) {
  font-weight: 600;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.25;
}

.prose :deep(h2) {
  font-size: 1.25em; /* text-xl */
}
.prose :deep(h3) {
  font-size: 1.125em; /* text-lg */
}
</style>
