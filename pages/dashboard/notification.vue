<template>
  <main class="py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- En-tête -->
    <section class="md:flex md:items-center md:justify-between border-b pb-6">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Notifications
        </h2>
        <p class="mt-2 text-sm text-gray-500">Historique de toutes vos alertes</p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button type="button"
          class="ml-3 inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <IconCheck class="w-4 h-4 mr-2" />
          Tout marquer comme lu
        </button>
      </div>
    </section>

    <!-- Statistiques -->
    <section class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div class="bg-white overflow-hidden rounded-lg shadow px-4 py-5 sm:p-6">
        <dt class="flex items-center gap-3">
          <IconBell class="h-6 w-6 text-primary" />
          <span class="text-sm font-medium text-gray-500">Notifications non lues</span>
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ unreadCount }}</dd>
      </div>
      <div class="bg-white overflow-hidden rounded-lg shadow px-4 py-5 sm:p-6">
        <dt class="flex items-center gap-3">
          <IconAlertCircle class="h-6 w-6 text-primary" />
          <span class="text-sm font-medium text-gray-500">Alertes urgentes</span>
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ urgentCount }}</dd>
      </div>
      <div class="bg-white overflow-hidden rounded-lg shadow px-4 py-5 sm:p-6">
        <dt class="flex items-center gap-3">
          <IconMail class="h-6 w-6 text-primary" />
          <span class="text-sm font-medium text-gray-500">Messages système</span>
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ systemMessageCount }}</dd>
      </div>
    </section>

    <!-- Graphique d'activité -->
    <section class="mt-8 bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <IconChartLine class="w-5 h-5 text-primary" />
        Activité des notifications
      </h3>
      <div class="h-64">
        <Line :data="activityChartData" :options="chartOptions" />
      </div>
    </section>

    <!-- Liste des notifications -->
    <section class="mt-8 bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <IconList class="w-5 h-5 text-primary" />
          Historique complet
        </h3>
      </div>

      <div class="p-4 border-b border-gray-200">
        <input v-model="searchTerm" type="text" placeholder="Rechercher une notification..."
          class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-secondary focus:ring focus:ring-secondary focus:ring-opacity-50" />
      </div>

      <div class="overflow-x-auto px-4 py-5 sm:px-6">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Type
              </th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Contenu
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
            <tr v-for="notification in filteredNotifications" :key="notification.id"
              :class="{ 'bg-gray-50': !notification.read }">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                <div class="flex items-center gap-3">
                  <NotificationIcon :type="notification.type" />
                  {{ notification.type }}
                </div>
              </td>
              <td class="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                {{ notification.message }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ formatDateTime(notification.date) }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span :class="statusStyles[notification.read ? 'read' : 'unread']"
                  class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
                  {{ notification.read ? 'Lu' : 'Non lu' }}
                </span>
              </td>
              <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div class="flex items-center justify-end gap-3">
                  <button class="text-primary hover:text-secondary">
                    <IconEye class="w-5 h-5" />
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
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconCheck, IconBell, IconAlertCircle, IconMail, IconChartLine, IconList, IconEye, IconTrash, IconInfoCircle, IconAlertTriangle, IconMessage } from '@tabler/icons-vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const searchTerm = ref('')

const notifications = ref([
  {
    id: 1,
    type: 'Alerte',
    message: 'Mise à jour critique disponible',
    date: '2024-04-15T14:30:00',
    read: false,
    urgent: true
  },
  {
    id: 2,
    type: 'Message',
    message: 'Nouveau message de votre recruteur',
    date: '2024-04-14T09:15:00',
    read: true
  },
  {
    id: 3,
    type: 'Rappel',
    message: 'Entretien prévu demain à 10h00',
    date: '2024-04-15T08:00:00',
    read: false
  }
])

const statusStyles = {
  read: 'bg-gray-100 text-gray-800',
  unread: 'bg-blue-100 text-blue-800'
}

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const urgentCount = computed(() => notifications.value.filter(n => n.urgent).length)
const systemMessageCount = computed(() => notifications.value.filter(n => n.type === 'Message').length)

const activityChartData = computed(() => ({
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
  datasets: [{
    label: 'Notifications par mois',
    data: [3, 5, 2, 4, 6, 8],
    borderColor: '#3b82f6',
    tension: 0.4
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const filteredNotifications = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return notifications.value.filter(n =>
    n.type.toLowerCase().includes(term) ||
    n.message.toLowerCase().includes(term)
  )
})

const formatDateTime = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy - HH:mm', { locale: fr })
}

const NotificationIcon = {
  props: ['type'],
  template: `
    <span class="inline-block">
      <IconAlertTriangle v-if="type === 'Alerte'" class="w-5 h-5 text-red-600" />
      <IconMessage v-else-if="type === 'Message'" class="w-5 h-5 text-blue-600" />
      <IconInfoCircle v-else class="w-5 h-5 text-gray-600" />
    </span>
  `,
  components: { IconAlertTriangle, IconMessage, IconInfoCircle }
}

// SEO
useHead({
  title: 'Notifications',
  meta: [{ name: 'description', content: 'Historique de toutes vos alertes sur PGS Hire' }]
})
</script>