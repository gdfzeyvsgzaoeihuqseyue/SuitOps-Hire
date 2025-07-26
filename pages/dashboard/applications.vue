<template>
  <main class="py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- En-tête -->
    <section class="md:flex md:items-center md:justify-between border-b pb-6">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Mes candidatures
        </h2>
        <p class="mt-2 text-sm text-gray-700">Toutes vos candidatures actives et archivées</p>
      </div>
      <div class="mt-4 gap-8 flex items-center md:ml-4 md:mt-0">
        <NuxtLink to="/offer"
          class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          Postuler à une offre
        </NuxtLink>
      </div>
    </section>

    <!-- Graphiques -->
    <section class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Graphique d'évolution des candidatures -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconChartLine class="w-5 h-5 text-primary" />
          Évolution des candidatures
        </h3>
        <Line :data="chartDataEvolution" :options="chartOptions" />
      </div>
      <!-- Graphique de répartition des statuts -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconChartPie class="w-5 h-5 text-primary" />
          Répartition des statuts
        </h3>
        <Doughnut :data="chartDataStatuses" :options="chartOptions" />
      </div>
    </section>

    <hr class="my-8 border-gray-200" />

    <!-- Tableau des candidatures -->
    <section class="mt-8 bg-white shadow rounded-lg overflow-hidden flow-root">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <IconListDetails class="w-5 h-5 text-primary" />
          Mes candidatures
        </h3>
      </div>

      <!-- Filtre de recherche -->
      <div class="p-4 border-b border-gray-200">
        <input type="text" v-model="searchQuery" placeholder="Rechercher une candidature..."
          class="w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary" />
      </div>

      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 px-4 py-5 sm:px-6">
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
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span :class="[
                      statusColors[application.status],
                      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                    ]">
                      {{ application.status }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <NuxtLink :to="`/candidatures/${application.position}`"
                      class="text-primary hover:text-secondary">
                      Voir
                      <span class="sr-only">, {{ application.position }}</span>
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Message d'absence si aucune candidature trouvée -->
            <div v-if="filteredApplications.length === 0" class="p-4 text-center text-gray-500">
              Aucune candidature ne correspond à votre recherche.
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Line, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { IconChartLine, IconChartPie, IconListDetails } from '@tabler/icons-vue'

// Enregistrement des composants ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend)


const statusColors = {
  'En cours': 'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
  'Entretien': 'text-green-700 bg-green-50 ring-green-600/20',
  'Refusé': 'text-red-700 bg-red-50 ring-red-600/20',
} as any


// Exemple de données pour les candidatures
const applications = ref([
  {
    id: 1,
    position: 'Développeur Full Stack',
    company: 'PGS Software',
    date: '2024-04-01',
    status: 'En cours'
  },
  {
    id: 2,
    position: 'DevOps Engineer',
    company: 'PGS Tech',
    date: '2024-03-28',
    status: 'Entretien'
  },
  {
    id: 3,
    position: 'UX Designer',
    company: 'PGS Design',
    date: '2024-03-25',
    status: 'Refusé'
  }
])

const searchQuery = ref('')

// Filtrer les candidatures en fonction de la requête de recherche
const filteredApplications = computed(() => {
  if (!searchQuery.value) return applications.value
  const query = searchQuery.value.toLowerCase()
  return applications.value.filter(app =>
    app.position.toLowerCase().includes(query) ||
    app.company.toLowerCase().includes(query)
  )
})

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr })
}

// Configuration des options communes pour les graphiques
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true
}

// Graphique de répartition des statuts (Doughnut)
const chartDataStatuses = computed(() => {
  const statusCounts = {} as any
  applications.value.forEach(app => {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1
  })
  
  return {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#fbbf24', '#22c55e', '#ef4444']
    }]
  } as any
})


// Graphique d'évolution des candidatures (Line)
const chartDataEvolution = computed(() => {
  // Tableau fixe avec tous les mois en français
  const allMonths = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  // Initialisation d'un tableau de comptages pour chacun des 12 mois
  const monthlyCounts = new Array(12).fill(0)

  // Comptage du nombre de candidatures par mois
  applications.value.forEach(app => {
    const monthIndex = new Date(app.date).getMonth() // 0 pour janvier, ..., 11 pour décembre
    monthlyCounts[monthIndex]++
  })

  return {
    labels: allMonths,  // Tous les mois de Janvier à Décembre seront affichés
    datasets: [{
      label: 'Nombre de candidatures',
      data: monthlyCounts,   // Comptage des candidatures par mois
      borderColor: '#0ea5e9',
      tension: 0.4,
      fill: false
    }]
  }
})


// SEO
useHead({
  title: 'Candidatures',
  meta: [{ name: 'description', content: 'Toutes vos candidatures sur PGS Hire' }]
})
</script>
