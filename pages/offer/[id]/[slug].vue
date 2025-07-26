<template>
  <main class="max-w-7xl mx-auto py-6 px-4">
    <button @click="router.go(-1)" class="text-primary hover:text-secondary flex items-center gap-2">
      <IconArrowLeft class="w-5 h-5" />
      Retour
    </button>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Chargement...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto py-6 px-4">
      <div class="bg-red-50 p-4 rounded-md">
        <p class="text-red-700">{{ error }}</p>
        <button @click="loadJob" class="mt-2 text-red-600 hover:text-red-800 font-medium">
          Réessayer
        </button>
      </div>
    </div>

    <!-- Job Details -->
    <div v-else-if="currentJob" class="max-w-7xl mx-auto py-6 px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-gray-900">{{ currentJob.post }}</h1>
              <span :class="[
                'ml-4 px-2 py-1 text-xs font-medium rounded-full',
                currentJob.contract === 'CDI' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              ]">
                {{ currentJob.contract }}
              </span>
            </div>
            <a :href="`https://localhost:3000/company/${currentJob.company.id}/${currentJob.company.name}`"
              target="_blank" class="mt-2 text-gray-600 hover:text-primary"
              :title="`Consulter le profil de ${currentJob.company.name}`">
              {{ currentJob.company.name }}
            </a>
          </div>
          <div class="mt-4 sm:mt-0">
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
              Postuler
            </button>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex items-center text-gray-600">
            <IconLocation class="h-5 w-5 mr-2" />
            {{ currentJob.location }}
          </div>
          <div class="flex items-center text-gray-600">
            <IconCalendar class="h-5 w-5 mr-2" />
            Date limite: {{ formatDate(currentJob.closingDate) }}
          </div>
          <div class="flex items-center text-gray-600">
            <IconUsers class="h-5 w-5 mr-2" />
            {{ currentJob.placeNumber }} poste{{ currentJob.placeNumber > 1 ? 's' : '' }}
          </div>
          <div class="flex items-center text-gray-600">
            <IconMail class="h-5 w-5 mr-2" />
            {{ currentJob.email }}
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div v-if="!hasDetails" class="lg:col-span-2 space-y-8">
          <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg shadow-sm">
            <p class="font-medium text-center">Pas de détails définis pour ce poste.</p>
          </div>
        </div>

        <div v-else class="lg:col-span-2 space-y-8">
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
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Aptitudes</h2>
            <div class="prose max-w-none" v-html="currentJob.aptitudes"></div>
          </div>
        </div>

        <!-- Colonne droit-->
        <div class="space-y-8">
          <!-- Company Info -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">L'entreprise</h2>
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-gray-900">{{ currentJob.company.name }}</h3>
                <p class="text-gray-600">{{ currentJob.company.mainActivity }}</p>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Localisation</h3>
                <p class="text-gray-600">{{ currentJob.company.address }}</p>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Contact</h3>
                <p class="text-gray-600">{{ currentJob.company.phoneNumber }}</p>
                <p class="text-gray-600">{{ currentJob.company.emailAddress }}</p>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div v-if="currentJob.requiredDocument && currentJob.requiredDocument.trim() !== '<p> </p>'"
            class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Documents requis</h2>
            <div class="prose max-w-none" v-html="currentJob.requiredDocument"></div>
          </div>
          <div v-else class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg shadow-sm">
            <p class="font-medium">Les détails du document sont manquants. Soumettez ceux requis par le formulaire.</p>
          </div>

          <!-- Quiz Section -->
          <div v-if="currentJob.quizzes.length > 0" class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Questions techniques</h2>
            <div class="space-y-4">
              <div v-for="quiz in currentJob.quizzes" :key="quiz.id" class="border-b pb-4 last:border-b-0">
                <h3 class="font-medium text-gray-900 mb-2">{{ quiz.statement }}</h3>
                <div class="space-y-2">
                  <div v-for="answer in quiz.answers" :key="answer.id" class="flex items-center">
                    <span class="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    <span class="text-gray-600">{{ answer.statement }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconArrowLeft, IconLocation, IconCalendar, IconUsers, IconMail } from '@tabler/icons-vue'
import { useJobsStore } from '~/stores/jobs'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const { isLoading, error, currentJob } = storeToRefs(jobsStore)

const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), 'dd MMMM yyyy', { locale: fr })
}

const loadJob = async () => {
  const id = route.params.id as string
  await jobsStore.fetchJobById(id)
}

onMounted(() => {
  loadJob()
})


const hasDetails = computed(() => {
  return !!(
    currentJob.value?.summary?.trim() !== '<p> </p>' ||
    currentJob.value?.tasks?.trim() !== '<p> </p>' ||
    currentJob.value?.skills?.trim() !== '<p> </p>' ||
    currentJob.value?.aptitudes?.trim() !== '<p> </p>'
  )
})

// Page title
useHead({
  title: computed(() => currentJob.value ? `${currentJob.value.post} - ${currentJob.value.company.name}` : 'Offre d\'emploi')
})
</script>