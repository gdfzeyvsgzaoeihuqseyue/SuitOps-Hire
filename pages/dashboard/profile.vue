<template>
  <main class="py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- En-tête -->
    <section class="md:flex md:items-center md:justify-between border-b pb-6">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Mon profil
        </h2>
        <p class="mt-2 text-sm text-gray-500">Vos infos personnel et de candidature</p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button type="button"
          class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          Générer un CV
        </button>
      </div>
    </section>

    <!-- Aperçu -->
    <section class="mt-8 bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-semibold mb-4 flex items-center gap-2 border-b">
        <IconEye class="w-5 h-5 text-primary" />
        Aperçu rapide
      </h3>

      <div class="flex items-center">
        <img :src="`https://api.dicebear.com/9.x/initials/svg?seed=${userData.firstName}+${userData.lastName}`"
          alt="Photo de profil" class="w-24 h-24 rounded-full object-cover" />
        <div class="ml-6">
          <h3 class="text-xl font-bold text-gray-900">{{ userData.firstName }} {{ userData.lastName }}</h3>
          <div class="text-gray-600">
            <p>{{ userData.email }}</p>
            <p>{{ userData.phone1 }}</p>
          </div>
        </div>
      </div>
      <div class="mt-6 space-y-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y py-2">
        <div>
          <p class="text-sm font-medium text-gray-500">Naissance</p>
          <p class="mt-1 text-gray-900">{{ userData.birthDate }} à {{ userData.birthPlace }}</p>
        </div>
        <div>
          <p class="mt-1 text-gray-900">{{ userData.city }}, {{ userData.country }}</p>
          <p class="text-sm font-medium text-gray-500">Adresse</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Situation matrimoniale</p>
          <p class="mt-1 text-gray-900">{{ userData.marital }} avec {{ userData.child }} enfant{{ userData.child > 1 ? 's' : '' }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Diplôme</p>
          <p class="mt-1 text-gray-900" v-if="userData.educations.length">
            {{ userData.educations[0].degree }} en {{ userData.educations[0].field }}
          </p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500" v-if="userData.experiences.length">
            {{ userData.experiences[0].duration }} à {{ userData.experiences[0].company }}
          </p>
          <p class="mt-1 text-gray-900">Expérience</p>
        </div>
      </div>
    </section>

    <!-- Contenus -->
    <section class="mt-8 space-y-8 pl-4 border-l-2">
      <div class="md:flex md:items-center md:justify-between">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <IconListDetails class="w-5 h-5 text-primary" /> Informations de formulaire
        </h3>
      </div>

      <!-- Sections modifiables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div v-for="section in sections.slice(0, 2)" :key="section.key">
          <aside class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <component :is="getIcon(section.iconName)" class="w-5 h-5 text-primary" />
              {{ section.title }}
            </h3>

            <div class="border-y py-4 space-y-8">
              <div :class="`grid grid-cols-1 lg:grid-cols-${section.gridCols} gap-8`">
                <div v-for="item in section.items" :key="item.key" class="space-y-1">
                  <h4 class="text-md font-bold text-gray-900">{{ item.value || '–' }}</h4>
                  <p class="text-sm text-gray-600">{{ item.label }}</p>
                </div>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button @click="openModal(section.key)" type="button"
                class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary">
                <IconEdit class="mr-1" /> Éditer {{ section.title }}
              </button>
            </div>
          </aside>
        </div>
      </div>

      <!-- Sections dynamiques -->
      <div v-for="section in sections.slice(2)" :key="section.key">
        <!-- Formations & Compétences -->
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-8" v-if="!['documents', 'preferences'].includes(section.key)">
          <aside class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <component :is="getIcon(section.iconName)" class="w-5 h-5 text-primary" />
              {{ section.title }}
            </h3>

            <div v-if="section.key === 'education'">
              <div class="border-y py-4 space-y-8">
                <div v-for="(edu, index) in userData.educations" :key="index"
                  class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ edu.degree }}</h4>
                    <p class="text-sm text-gray-600">Diplôme</p>
                  </div>
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ edu.date }}</h4>
                    <p class="text-sm text-gray-600">Date d'obtention</p>
                  </div>
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ edu.field }}</h4>
                    <p class="text-sm text-gray-600">Domaine d'étude</p>
                  </div>
                </div>
              </div>
              <div class="border-y py-4 space-y-8">
                <div v-for="(exp, index) in userData.experiences" :key="index"
                  class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ exp.company }}</h4>
                    <p class="text-sm text-gray-600">Entreprise</p>
                  </div>
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ exp.duration }}</h4>
                    <p class="text-sm text-gray-600">Durée</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="section.key === 'skills'">
              <div class="border-y py-4 space-y-8">
                <div v-for="(sw, index) in userData.softwares" :key="index"
                  class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ sw.name }}</h4>
                    <p class="text-sm text-gray-600">Logiciel</p>
                  </div>
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ sw.mastery }}</h4>
                    <p class="text-sm text-gray-600">Maîtrise</p>
                  </div>
                </div>
              </div>
              <div class="border-y py-4 space-y-8">
                <div v-for="(lg, index) in userData.langues" :key="index" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ lg.langue }}</h4>
                    <p class="text-sm text-gray-600">Langue</p>
                  </div>
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ lg.read }}</h4>
                    <p class="text-sm text-gray-600">Lecture</p>
                  </div>
                  <div>
                    <h4 class="text-md font-bold text-gray-900">{{ lg.write }}</h4>
                    <p class="text-sm text-gray-600">Écriture</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button @click="openModal(section.key)" type="button"
                class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary">
                <IconEdit class="mr-1" /> Éditer {{ section.title }}
              </button>
            </div>
          </aside>
        </div>

        <!-- Documents -->
        <aside v-if="section.key === 'documents'" class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <component :is="getIcon(section.iconName)" class="w-5 h-5 text-primary" />
            {{ section.title }}
          </h3>

          <div class="border-y py-4 space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div v-for="doc in userData.documents" :key="doc.name"
                class="bg-bgClr p-4 rounded-lg shadow flex flex-col justify-between">
                <div class="flex items-center gap-3">
                  <IconFile class="w-6 h-6 text-gray-400" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ doc.name }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ doc.size }}</p>
                  </div>
                  <span :class="doc.status === 'Actif'
                    ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-50'"
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
                    {{ doc.status }}
                  </span>
                </div>
                <div class="mt-4 flex justify-end gap-2">
                  <NuxtLink to="#"
                    class="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-secondary">
                    <IconEdit class="w-4 h-4 mr-1" /> Éditer
                  </NuxtLink>
                  <button type="button"
                    class="inline-flex items-center rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-700">
                    <IconTrash class="w-4 h-4 mr-1" /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button @click="openModal('documents')" type="button"
              class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary">
              <IconPlus class="mr-1" /> Ajouter un document
            </button>
          </div>
        </aside>
      </div>
    </section>

    <!-- Préférences professionnelles -->
    <section class="mt-8 space-y-8 pl-4 border-l-2">
      <div class="md:flex md:items-center md:justify-between">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <IconSettings class="w-5 h-5 text-primary" /> Préférences professionnelles
        </h3>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h4 class="text-md font-bold text-gray-900">{{ userData.preferences.sectors.join(', ') }}</h4>
            <p class="text-sm text-gray-600">Secteurs d'activité</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">{{ userData.preferences.profils.join(', ') }}</h4>
            <p class="text-sm text-gray-600">Profils recherchés</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">{{ userData.preferences.typesContrats.join(', ') }}</h4>
            <p class="text-sm text-gray-600">Types de contrats</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">{{ userData.preferences.places.join(', ') }}</h4>
            <p class="text-sm text-gray-600">Nombre de poste</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">{{ userData.preferences.locations.join(', ') }}</h4>
            <p class="text-sm text-gray-600">Lieux de travail</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">{{ userData.preferences.companies.join(', ') }}</h4>
            <p class="text-sm text-gray-600">Recruteurs</p>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
          <button @click="openModal('preferences')" type="button"
            class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary"> 
            <IconFilterEdit class="mr-1" /> Mettre à jour
          </button>
        </div>
    </section>

    <DynamicProfileModal />
  </main>
</template>

<script setup lang="ts">
import { IconFile, IconEdit, IconTrash, IconPlus, IconListDetails, IconSettings, IconEye, IconFilterEdit } from '@tabler/icons-vue'
import { useProfileContent } from '~/composables/useProfileContent'

const { sections, openModal, userData, getIcon } = useProfileContent()

useHead({
  title: 'Profil',
  meta: [{ name: 'description', content: 'Vos infos personnel et de candidature sur SuitOps Hire' }]
})
</script>