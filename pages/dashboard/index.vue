<template>
  <main class="py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- En-tête -->
    <section class="md:flex md:items-center md:justify-between border-b pb-6">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Tableau de bord
        </h2>
        <p class="mt-2 text-sm text-gray-500">Visualiser vos informations et contenus</p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button type="button"
          class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          Exporter en PDF
        </button>
      </div>
    </section>

    <!-- Statistiques -->
    <section class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.name"
        class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
        <dt>
          <div class="absolute rounded-md bg-secondary p-3">
            <component :is="stat.icon" class="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p class="ml-16 truncate text-sm font-medium text-gray-500">{{ stat.name }}</p>
        </dt>
        <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
          <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
          <div class="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <NuxtLink :to="stat.href" class="font-medium text-primary hover:text-secondary">
                Voir tout
                <span class="sr-only"> {{ stat.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </dd>
      </div>
    </section>

    <!-- Graphiques -->
    <section class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Graphique des candidatures -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconChartLine class="w-5 h-5 text-primary" />
          Évolution des candidatures
        </h3>
        <Line :data="applicationsChartData" :options="chartOptions" />
      </div>

      <!-- Graphique des entretiens -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconChartPie class="w-5 h-5 text-primary" />
          Statut des candidatures
        </h3>
        <Pie :data="statusChartData" :options="chartOptions" />
      </div>

      <!-- Graphique des fichiers -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconChartBar class="w-5 h-5 text-primary" />
          Répartition des documents
        </h3>
        <Bar :data="documentsChartData" :options="chartOptions" />
      </div>
    </section>

    <hr class="my-8 border-gray-200" />

    <!-- Candidatures récentes -->
    <section class="mt-8">
      <div class="md:flex md:items-center md:justify-between">
        <div>
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <IconListDetails class="w-5 h-5 text-primary" />
            Candidatures récentes
          </h3>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
          <NuxtLink to="/dashboard/applications"
            class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Voir toutes les candidatures
          </NuxtLink>
        </div>
      </div>

      <!-- Barre de recherche -->
      <div class="my-6">
        <input v-model="searchTerm" type="text" placeholder="Rechercher une candidature..."
          class="w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary" />
      </div>

      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Poste
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Entreprise
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Statut
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="application in filteredApplications" :key="application.id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {{ application.position }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ application.company }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatDate(application.date) }}
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-500">
                      <span :class="[
                        statusColors[application.status.text],
                        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                      ]">
                        {{ application.status.text }}
                      </span>
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <NuxtLink :to="`/applications/${application.position}`" class="text-primary hover:text-secondary">
                        Voir<span class="sr-only">, {{ application.position }}</span>
                      </NuxtLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <hr class="my-8 border-gray-200" />

    <!-- Documents actifs -->
    <section class="my-8">
      <div class="md:flex md:items-center md:justify-between">
        <div>
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <IconListDetails class="w-5 h-5 text-primary" />
            Documents actifs
          </h3>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
          <NuxtLink to="/dashboard/documents"
            class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Voir tous les documents
          </NuxtLink>
        </div>
      </div>

      <!-- Barre de recherche -->
      <div class="my-6">
        <input v-model="searchTerm" type="text" placeholder="Rechercher un document..."
          class="w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary" />
      </div>

      <div class="overflow-x-auto bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Nom
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Taille
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Statut
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Date d'upload
              </th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="doc in filteredDocuments" :key="doc.id">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                <div class="flex items-center gap-3">
                  <IconFile class="w-5 h-5 text-gray-400" />
                  {{ doc.name }}
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span class="inline-flex items-center gap-1">
                  <FileTypeIcon :type="doc.type" />
                  {{ doc.type }}
                </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ doc.size }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span :class="statusStyles[doc.status]"
                  class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
                  {{ doc.status }}
                </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ formatDate(doc.uploadDate) }}
              </td>
              <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div class="flex items-center justify-end gap-3">
                  <button class="text-primary hover:text-secondary">
                    <IconEdit class="w-5 h-5" />
                  </button>
                  <button class="text-red-600 hover:text-red-900">
                    <IconTrash class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Line, Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarController, BarElement, PieController } from 'chart.js'
import { IconBriefcase, IconCalendarStats, IconChartLine, IconChartBar, IconBell, IconFileText, IconChartPie, IconListDetails, IconEdit, IconTrash } from '@tabler/icons-vue'

const statusColors = {
  'En cours': 'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
  'Entretien': 'text-green-700 bg-green-50 ring-green-600/20',
  'Refusé': 'text-red-700 bg-red-50 ring-red-600/20',
  'Accepté': 'text-blue-700 bg-blue-50 ring-blue-600/20'
} as any

const searchTerm = ref('')

// Filtrage dynamique selon la recherche
const filteredApplications = computed(() => {
  const query = searchTerm.value.toLowerCase()
  return applications.value.filter(app =>
    app.position.toLowerCase().includes(query) ||
    app.company.toLowerCase().includes(query) ||
    app.status.text.toLowerCase().includes(query)
  )
})

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarController, BarElement, PieController)

// Statistiques calculées dynamiquement
const stats = computed(() => [
  {
    name: 'Candidatures totales',
    value: applications.value.length.toString(),
    icon: IconBriefcase,
    href: '/dashboard/applications'
  },
  {
    name: 'Entretiens à venir',
    value: applications.value.filter(a => a.status.text === 'Entretien').length.toString(),
    icon: IconCalendarStats,
    href: '#'
  },
  {
    name: 'Documents',
    value: '3',
    icon: IconFileText,
    href: '/dashboard/documents'
  },
  {
    name: 'Notification non lus',
    value: '5',
    icon: IconBell,
    href: '/dashboard/notification'
  }
])


const applications = ref([
  {
    id: 1,
    position: 'Développeur Full Stack',
    company: 'PGS Software',
    date: '2024-04-01',
    status: { text: 'En cours', color: 'text-yellow-700 bg-yellow-50 ring-yellow-600/20' }
  },
  {
    id: 2,
    position: 'DevOps Engineer',
    company: 'PGS Tech',
    date: '2024-03-28',
    status: { text: 'Entretien', color: 'text-green-700 bg-green-50 ring-green-600/20' }
  },
  {
    id: 3,
    position: 'UX Designer',
    company: 'PGS Design',
    date: '2024-03-25',
    status: { text: 'Refusé', color: 'text-red-700 bg-red-50 ring-red-600/20' }
  }
])

// Exemple de données pour les documents
const documents = ref([
  {
    id: 1,
    name: 'CV_Elisee_Atonde.pdf',
    type: 'PDF',
    size: '1.2 Mo',
    status: 'Actif',
    uploadDate: '2024-03-15'
  },
  {
    id: 2,
    name: 'Diplome_Master.pdf',
    type: 'PDF',
    size: '2.1 Mo',
    status: 'Actif',
    uploadDate: '2024-04-01'
  }
])

// Styles dynamiques pour les statuts
const statusStyles = {
  Actif: 'bg-green-100 text-green-800',
  Archivé: 'bg-gray-100 text-gray-800',
  Expiré: 'bg-yellow-100 text-yellow-800'
} as any

const filteredDocuments = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return documents.value.filter(doc => doc.name.toLowerCase().includes(term))
})

// Chart data
const applicationsChartData = computed(() => {
  const allMonths = [
    'Jan', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
  ];

  // Initialisation d'un tableau de comptages pour chacun des 12 mois
  const monthlyCounts = new Array(12).fill(0);

  // Incrémenter le compteur du mois correspondant à chaque candidature
  applications.value.forEach(app => {
    const monthIndex = new Date(app.date).getMonth();
    monthlyCounts[monthIndex]++;
  });

  return {
    labels: allMonths,
    datasets: [{
      label: 'Candidatures',
      data: monthlyCounts,
      borderColor: '#0ea5e9',
      tension: 0.4
    }]
  }
});


// Calcul des données pour les graphiques
const statusChartData = computed(() => {
  const statusCounts = applications.value.reduce((acc: any, app) => {
    acc[app.status.text] = (acc[app.status.text] || 0) + 1
    return acc
  }, {})

  return {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#fbbf24', '#22c55e', '#ef4444', '#3b82f6']
    }]
  } as any
})

const documentsChartData = computed(() => {
  const typeCounts = documents.value.reduce((acc: any, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1
    return acc
  }, {})

  return {
    labels: Object.keys(typeCounts),
    datasets: [{
      label: 'Documents par type',
      data: Object.values(typeCounts),
      backgroundColor: ['#0ea5e9', '#3b82f6', '#6366f1']
    }]
  } as any
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr })
}


// SEO
useHead({
  title: 'Tableau de bord',
  meta: [{ name: 'description', content: 'Visualiser vos informations et contenus sur PGS Hire' }]
})
</script>