<template>
  <main class="py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
    <!-- En-tête -->
    <section class="md:flex md:items-center md:justify-between border-b pb-6">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Paramètres du compte
        </h2>
        <p class="mt-2 text-sm text-gray-500">Gérez les préférences et les configurations de votre compte</p>
      </div>
    </section>

    <!-- Contenu principal -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Navigation -->
      <aside class="lg:col-span-1">
        <nav class="space-y-1 bg-white rounded-lg shadow p-4">
          <button v-for="tab in tabs" :key="tab.id" @click="selectedTab = tab.id" :class="[selectedTab === tab.id
            ? 'bg-bgClr text-secondary'
            : 'text-gray-600 hover:bg-gray-50',
            'w-full text-left px-4 py-2 rounded-md flex items-center gap-3 transition-colors']">
            <component :is="tab.icon" class="w-5 h-5" />
            {{ tab.name }}
          </button>
        </nav>
      </aside>

      <!-- Onglets -->
      <aside class="lg:col-span-2 space-y-8">
        <!-- Compte -->
        <section v-show="selectedTab === 'account'" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-6 flex items-center gap-3">
            <IconUser class="w-6 h-6 text-primary" />
            Informations du compte
          </h3>

          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Adresse email</p>
                <p class="text-sm text-gray-500">elisee.atonde@example.com</p>
              </div>
              <button class="text-primary hover:text-secondary flex items-center gap-2">
                <IconEdit class="w-5 h-5" />
                Modifier
              </button>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Numéro de téléphone</p>
                <p class="text-sm text-gray-500">+229 12 34 56 78</p>
              </div>
              <button class="text-primary hover:text-secondary flex items-center gap-2">
                <IconEdit class="w-5 h-5" />
                Modifier
              </button>
            </div>

            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-700">Exporter les données</p>
                  <p class="text-sm text-gray-600">Télécharger toutes vos données au format ZIP</p>
                </div>
                <button class="flex items-center gap-2 text-secondary hover:text-red-900">
                  <IconDownload class="w-5 h-5" />
                  Exporter
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Sécurité -->
        <section v-show="selectedTab === 'security'" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-6 flex items-center gap-3">
            <IconLock class="w-6 h-6 text-primary" />
            Sécurité
          </h3>

          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Authentification à deux facteurs</p>
                <p class="text-sm text-gray-500">Protection supplémentaire pour votre compte</p>
              </div>
              <Switch v-model="twoFactorEnabled" :class="twoFactorEnabled ? 'bg-primary' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors">
                <span class="sr-only">Activer 2FA</span>
                <span aria-hidden="true" :class="twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition" />
              </Switch>
            </div>

            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center mb-4">
                <p class="font-medium text-gray-900">Sessions actives</p>
                <button class="text-primary hover:text-secondary text-sm">
                  Voir toutes les sessions
                </button>
              </div>
              <div class="space-y-3">
                <div v-for="session in activeSessions" :key="session.id"
                  class="flex items-center justify-between text-sm">
                  <div>
                    <p class="text-gray-900">{{ session.device }}</p>
                    <p class="text-gray-500">{{ session.location }} · {{ session.ip }}</p>
                    <p class="text-gray-400 text-xs">{{ formatDate(session.lastActivity) }}</p>
                  </div>
                  <button class="text-red-600 hover:text-red-800">
                    <IconLogout class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Notifications -->
        <section v-show="selectedTab === 'notifications'" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-6 flex items-center gap-3">
            <IconBell class="w-6 h-6 text-primary" />
            Préférences de notifications
          </h3>

          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Notifications par email</p>
                <p class="text-sm text-gray-500">Recevoir les mises à jour importantes par email</p>
              </div>
              <Switch v-model="emailNotifications" :class="emailNotifications ? 'bg-primary' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors">
                <span class="sr-only">Activer notifications email</span>
                <span aria-hidden="true" :class="emailNotifications ? 'translate-x-5' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition" />
              </Switch>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">Notifications push</p>
                <p class="text-sm text-gray-500">Recevoir des alertes en temps réel</p>
              </div>
              <Switch v-model="pushNotifications" :class="pushNotifications ? 'bg-primary' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors">
                <span class="sr-only">Activer notifications push</span>
                <span aria-hidden="true" :class="pushNotifications ? 'translate-x-5' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition" />
              </Switch>
            </div>
          </div>
        </section>

        <!-- Préférences -->
        <section v-show="selectedTab === 'preferences'" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-6 flex items-center gap-3">
            <IconSettings class="w-6 h-6 text-primary" />
            Préférences générales
          </h3>

          <div class="space-y-6">
            <div class="p-4 bg-gray-50 rounded-lg">
              <label class="block text-sm font-medium text-gray-700 mb-2">Langue</label>
              <select
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary">
                <option>Français</option>
                <option>English</option>
              </select>
            </div>

            <div class="p-4 bg-gray-50 rounded-lg">
              <label class="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
              <select
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary">
                <option>(UTC+01:00) Paris</option>
                <option>(UTC+00:00) Londres</option>
              </select>
            </div>

            <div class="p-4 bg-gray-50 rounded-lg">
              <label class="block text-sm font-medium text-gray-700 mb-2">Thème</label>
              <div class="flex gap-4">
                <button class="p-2 border rounded-md hover:border-secondary">
                  <IconSun class="w-6 h-6 text-gray-600" />
                </button>
                <button class="p-2 border rounded-md hover:border-secondary">
                  <IconMoon class="w-6 h-6 text-gray-600" />
                </button>
                <button class="p-2 border rounded-md hover:border-secondary">
                  <IconDeviceDesktop class="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Zone dangereuse -->
        <section v-show="selectedTab === 'danger'" class="bg-white rounded-lg shadow p-6 border border-red-100">
          <h3 class="text-lg font-semibold mb-6 flex items-center gap-3 text-red-700">
            <IconAlertTriangle class="w-6 h-6" />
            Zone dangereuse
          </h3>

          <div class="space-y-6">
            <div class="p-4 bg-red-50 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-red-700">Supprimer le compte</p>
                  <p class="text-sm text-red-600">Cette action est irréversible</p>
                </div>
                <button class="flex items-center gap-2 text-red-700 hover:text-red-900">
                  <IconTrash class="w-5 h-5" />
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@headlessui/vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconUser, IconLock, IconBell, IconSettings, IconAlertTriangle, IconEdit, IconLogout, IconTrash, IconDownload, IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-vue'

const selectedTab = ref('account')

const tabs = [
  { id: 'account', name: 'Compte', icon: IconUser },
  { id: 'security', name: 'Sécurité', icon: IconLock },
  { id: 'notifications', name: 'Notifications', icon: IconBell },
  { id: 'preferences', name: 'Préférences', icon: IconSettings },
  { id: 'danger', name: 'Zone dangereuse', icon: IconAlertTriangle }
]

const twoFactorEnabled = ref(false)
const emailNotifications = ref(true)
const pushNotifications = ref(false)

const activeSessions = [
  {
    id: 1,
    device: 'Chrome sur Windows',
    location: 'Porto-Novo, Bénin',
    ip: '192.168.1.1',
    lastActivity: '2024-04-15T14:32:00'
  },
  {
    id: 2,
    device: 'Safari sur iPhone',
    location: 'Cotonou, Bénin',
    ip: '196.200.12.34',
    lastActivity: '2024-04-14T09:15:00'
  }
]

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr })
}
</script>