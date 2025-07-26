<template>
  <main class="py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- En-tête -->
    <section class="md:flex md:items-center md:justify-between border-b pb-6">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Mes documents
        </h2>
        <p class="mt-2 text-sm text-gray-500">Espace de gestion de tous vos documents professionnels</p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button type="button"
          class="ml-3 inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <IconPlus class="w-4 h-4 mr-2" />
          Ajouter un document
        </button>
      </div>
    </section>

    <!-- Statistiques dynamiques -->
    <section class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div class="bg-white overflow-hidden rounded-lg shadow px-4 py-5 sm:p-6">
        <dt class="flex items-center gap-3">
          <IconFiles class="h-6 w-6 text-primary" />
          <span class="text-sm font-medium text-gray-500">Documents actifs</span>
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ activeCount }}</dd>
      </div>
      <div class="bg-white overflow-hidden rounded-lg shadow px-4 py-5 sm:p-6">
        <dt class="flex items-center gap-3">
          <IconFileUpload class="h-6 w-6 text-primary" />
          <span class="text-sm font-medium text-gray-500">Espace utilisé</span>
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ usedSpaceFormatted }}</dd>
      </div>
      <div class="bg-white overflow-hidden rounded-lg shadow px-4 py-5 sm:p-6">
        <dt class="flex items-center gap-3">
          <IconFileTypePdf class="h-6 w-6 text-primary" />
          <span class="text-sm font-medium text-gray-500">Documents PDF</span>
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ pdfCount }}</dd>
      </div>
    </section>

    <!-- Graphique -->
    <section class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Graphique des documents par statut -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconChartBar class="w-5 h-5 text-primary" />
          Documents par statut
        </h3>
        <Bar :data="documentsChartData" :options="chartOptions" />
      </div>

      <!-- Graphique des documents par type -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconChartPie class="w-5 h-5 text-primary" />
          Documents par type
        </h3>
        <Doughnut :data="dynamicChartData" :options="chartOptions" />
      </div>
    </section>

    <hr class="my-8 border-gray-200" />

    <!-- Liste des documents -->
    <section class="mt-8 bg-white shadow rounded-lg overflow-hidden flow-root">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <IconListDetails class="w-5 h-5 text-primary" />
          Tous les documents
        </h3>
      </div>

      <!-- Barre de recherche -->
      <div class="p-4 border-b border-gray-200">
        <input v-model="searchTerm" type="text" placeholder="Rechercher un document..."
          class="w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary" />
      </div>

      <div class="overflow-x-auto bg-white shadow rounded-lg overflow-hidden px-4 py-5 sm:px-6">
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
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarController,
  BarElement,
  Tooltip,
  Legend } from 'chart.js'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconPlus, IconFiles, IconFileUpload, IconFileTypePdf, IconChartPie, IconChartBar, IconFile, IconEdit, IconTrash, IconFileTypeDoc, IconFileTypeXls, IconFileUnknown, IconListDetails } from '@tabler/icons-vue'

const searchTerm = ref('')

// Enregistrement des composants ChartJS
ChartJS.register(CategoryScale, LinearScale, ArcElement, BarController, BarElement, Tooltip, Legend)

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
    name: 'Contrat_CDI.docx',
    type: 'Word',
    size: '356 Ko',
    status: 'Archivé',
    uploadDate: '2024-02-28'
  },
  {
    id: 3,
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

// Calcul dynamique du nombre de documents actifs
const activeCount = computed(() =>
  documents.value.filter(doc => doc.status === 'Actif').length
)

// Calcul dynamique du nombre de documents PDF
const pdfCount = computed(() =>
  documents.value.filter(doc => doc.type === 'PDF').length
)

// Fonction de conversion de taille ("Ko" ou "Mo") en octets
const parseSize = (sizeStr: string): number => {
  const [value, unit] = sizeStr.split(' ')
  const num = parseFloat(value)
  if (unit === 'Ko') return num * 1024
  if (unit === 'Mo') return num * 1024 * 1024
  return num
}

// Calcul dynamique de l'espace utilisé (en octets)
const usedSpaceBytes = computed(() =>
  documents.value.reduce((total, doc) => total + parseSize(doc.size), 0)
)

// Formatage de l'espace utilisé en Mo (avec deux décimales)
const usedSpaceFormatted = computed(() => {
  const mo = usedSpaceBytes.value / (1024 * 1024)
  return `${mo.toFixed(2)} Mo`
})

// Graphique dynamique basé sur le type de document
const dynamicChartData = computed(() => {
  // Définition des labels attendus
  const labels = ['PDF', 'Word', 'Excel', 'Images']
  // Calcul du nombre de documents par type
  const data = labels.map(type =>
    documents.value.filter(doc => doc.type === type).length
  )
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1']
    }]
  }
})

const documentsChartData = computed(() => {
  // Calcul des documents par statut
  const statusCounts = documents.value.reduce((acc: any, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1
    return acc
  }, {})

  const statusColors = { 'Actif': '#10B981', 'Archivé': '#6B7280', 'Expiré': '#F59E0B' }

  return {
    labels: Object.keys(statusCounts),
    datasets: [{
      label: 'Nombre de documents',
      data: Object.values(statusCounts),
      backgroundColor: Object.keys(statusCounts).map((status: string) => statusColors[status as keyof typeof statusColors]),
      borderColor: '#fff',
      borderWidth: 1
    }]
  } as any
})


// Options pour le graphique
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true
}

const filteredDocuments = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return documents.value.filter(doc => doc.name.toLowerCase().includes(term))
})

// Formatage de la date
const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: fr })
}

// Composant FileTypeIcon en inline pour l'affichage de l'icône selon le type
const FileTypeIcon = {
  props: ['type'],
  template: `
    <span class="inline-block">
      <IconFileTypePdf v-if="type === 'PDF'" class="w-4 h-4 text-red-600" />
      <IconFileTypeDoc v-else-if="type === 'Word'" class="w-4 h-4 text-blue-600" />
      <IconFileTypeXls v-else-if="type === 'Excel'" class="w-4 h-4 text-green-600" />
      <IconFileUnknown v-else class="w-4 h-4 text-gray-400" />
    </span>
  `,
  components: { IconFileTypePdf, IconFileTypeDoc, IconFileTypeXls, IconFileUnknown }
}

// SEO
useHead({
  title: 'Documents',
  meta: [{ name: 'description', content: 'Gerer vos documents professionnels sur PGS Hire' }]
})
</script>
