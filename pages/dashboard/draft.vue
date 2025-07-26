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
        <img src="https://api.dicebear.com/9.x/initials/svg?seed=Elisee+Atonde" alt="Photo de profil"
          class="w-24 h-24 rounded-full object-cover" />
        <div class="ml-6">
          <h3 class="text-xl font-bold text-gray-900">Elisée ATONDE</h3>
          <div class="text-gray-600">
            <p>elisee.atonde@example.com</p>
            <p>+229 0102030405</p>
          </div>
        </div>
      </div>
      <div class="mt-6 space-y-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y py-2">
        <div>
          <p class="text-sm font-medium text-gray-500">Naissance</p>
          <p class="mt-1 text-gray-900">01 Janvier 1990 à Porto-Novo</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Adresse</p>
          <p class="mt-1 text-gray-900">Porto-Novo, Bénin</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Situation matrimoniale</p>
          <p class="mt-1 text-gray-900">Célibataire avec 0 enfants</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Diplôme</p>
          <p class="mt-1 text-gray-900">Licence en Informatique en Système logiciel</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">3 mois à HODD</p>
          <p class="mt-1 text-gray-900">Expérience</p>
        </div>
      </div>
    </section>

    <hr class="my-8 border-gray-200" />

    <!-- Contenus -->
    <section class="mt-8 space-y-8 pl-4 border-l-2">
      <div class="md:flex md:items-center md:justify-between">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <IconListDetails class="w-5 h-5 text-primary" />
          Informations de formulaire
        </h3>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Informations générales -->
        <aside class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <IconUser class="w-5 h-5 text-primary" /> Informations générales
          </h3>

          <div class="border-y py-4 space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 class="text-md font-bold text-gray-900">ATONDE</h4>
                <p class="text-sm text-gray-600">Nom</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">Elisée</h4>
                <p class="text-sm text-gray-600">Prénoms</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">elisee.atonde@e...</h4>
                <p class="text-sm text-gray-600">Email</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">Masculin</h4>
                <p class="text-sm text-gray-600">Sexe</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">01 Janvier 1990</h4>
                <p class="text-sm text-gray-600">Date de naissance</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">Porto-Novo</h4>
                <p class="text-sm text-gray-600">Lieu de naissance</p>
              </div>
            </div>
          </div>

          <!-- Modals -->
          <ModalGeneralInfo v-model="showEditModalGeneralInfo" :initial-data="userData"
            @save="data => handleUpdate('general', data)" />

          <!-- Bouton -->
          <div class="mt-4 flex justify-end">
            <button type="button" @click="showEditModalGeneralInfo = true"
              class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary">
              <IconEdit class="mr-1" /> Editer Informations générales
            </button>
          </div>
        </aside>

        <!--  Contacts et résidences -->
        <aside class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <IconMail class="w-5 h-5 text-primary" /> Contacts et résidences
          </h3>

          <div class="border-y py-4 space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <h4 class="text-md font-bold text-gray-900">+229 0102030405</h4>
                <p class="text-sm text-gray-600">Téléphone 1</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">Non renseigné</h4>
                <p class="text-sm text-gray-600">Téléphone 2</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">Bénin</h4>
                <p class="text-sm text-gray-600">Pays</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">Non renseigné</h4>
                <p class="text-sm text-gray-600">Département</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">Non renseigné</h4>
                <p class="text-sm text-gray-600">Commune</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">Porto-Novo</h4>
                <p class="text-sm text-gray-600">Ville</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">Célibataire</h4>
                <p class="text-sm text-gray-600">Situation matrimoniale</p>
              </div>
              <div>
                <h4 class="text-md font-bold text-gray-900">0</h4>
                <p class="text-sm text-gray-600">Nombre d'enfants</p>
              </div>
            </div>
          </div>

          <!-- Modals -->
          <ModalContacts v-model="showEditModalContacts" :initial-data="userData"
            @save="data => handleUpdate('contact', data)" />

          <!-- Bouton -->
          <div class="mt-4 flex justify-end">
            <button type="button" @click="showEditModalContacts = true"
              class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary">
              <IconEdit class="mr-1" /> Editer Contacts et résidences
            </button>
          </div>
        </aside>
      </div>

      <!-- Formations, diplômes et expériences -->
      <aside class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <IconBriefcase class="w-5 h-5 text-primary" /> Formations, diplômes et expériences
        </h3>

        <!-- Formations et diplômes -->
        <div class="border-y py-4 space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h4 class="text-md font-bold text-gray-900">Licence en Informatique</h4>
              <p class="text-sm text-gray-600">Dernier diplôme</p>
            </div>
            <div>
              <h4 class="text-md font-bold text-gray-900">13 mai 2025</h4>
              <p class="text-sm text-gray-600">Date d'obtention</p>
            </div>
            <div>
              <h4 class="text-md font-bold text-gray-900">Système logiciel</h4>
              <p class="text-sm text-gray-600">Domaine d'étude</p>
            </div>
          </div>
        </div>

        <!-- Expériences professionnelles -->
        <div class="border-y py-4 space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 class="text-md font-bold text-gray-900">HODD Global</h4>
              <p class="text-sm text-gray-600">Structure</p>
            </div>
            <div>
              <h4 class="text-md font-bold text-gray-900">3 mois</h4>
              <p class="text-sm text-gray-600">Durée (mois)</p>
            </div>
          </div>
        </div>

        <!-- Bouton -->
        <div class="mt-4 flex justify-end">
          <button type="button"
            class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary">
            <IconEdit class="mr-1" /> Editer Formations, diplômes et expériences
          </button>
        </div>
      </aside>

      <!-- Informatique et langues -->
      <aside class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <IconGlobe class="w-5 h-5 text-primary" /> Informatique et langues
        </h3>

        <!-- Informatique -->
        <div class="border-y py-4 space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 class="text-md font-bold text-gray-900">Microsoft Word</h4>
              <p class="text-sm text-gray-600">Logiciel</p>
            </div>
            <div>
              <h4 class="text-md font-bold text-gray-900">Moyen</h4>
              <p class="text-sm text-gray-600">Maîtrise</p>
            </div>
          </div>
        </div>

        <!-- Langues -->
        <div class="border-y py-4 space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h4 class="text-md font-bold text-gray-900">Français</h4>
              <p class="text-sm text-gray-600">Langue</p>
            </div>
            <div>
              <h4 class="text-md font-bold text-gray-900">Élevé</h4>
              <p class="text-sm text-gray-600">Lire</p>
            </div>
            <div>
              <h4 class="text-md font-bold text-gray-900">Élevé</h4>
              <p class="text-sm text-gray-600">Écrit</p>
            </div>
          </div>
        </div>

        <!-- Bouton -->
        <div class="mt-4 flex justify-end">
          <button type="button"
            class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary">
            <IconEdit class="mr-1" /> Editer Informatique et langues
          </button>
        </div>
      </aside>

      <!-- Documents -->
      <aside class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <IconFileText class="w-5 h-5 text-primary" /> Documents
        </h3>

        <div class="border-y py-4 space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div v-for="doc in documents" :key="doc.name"
              class="bg-bgClr p-4 rounded-lg shadow flex flex-col justify-between">
              <div class="flex items-center gap-3">
                <IconFile class="w-6 h-6 text-gray-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ doc.name }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ doc.size }}</p>
                </div>
                <span :class="doc.status === 'Actif' ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-50'"
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

        <!-- Bouton -->
        <div class="mt-4 flex justify-end">
          <button type="button"
            class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary">
            <IconPlus class="mr-1" /> Ajouter un document
          </button>
        </div>
      </aside>
    </section>

    <hr class="my-8 border-gray-200" />

    <!-- Section Préférences professionnelles -->
    <section class="mt-8 space-y-8">
      <div class="md:flex md:items-center md:justify-between">
        <div>
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <IconListDetails class="w-5 h-5 text-primary" />
            Préférences professionnelles
          </h3>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
          <button type="button"
            class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Mettre à jour
          </button>
        </div>
      </div>

      <div class=" bg-white p-6 rounded-lg shadow">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h4 class="text-md font-bold text-gray-900">Développement logiciel</h4>
            <p class="text-sm text-gray-600">Secteur d'activité</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">Licence</h4>
            <p class="text-sm text-gray-600">Profil</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">CDI</h4>
            <p class="text-sm text-gray-600">Type de contrat</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">au moins 4</h4>
            <p class="text-sm text-gray-600">Nombre de poste</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">Cotonou</h4>
            <p class="text-sm text-gray-600">Lieu de travail</p>
          </div>
          <div>
            <h4 class="text-md font-bold text-gray-900">HODD Global</h4>
            <p class="text-sm text-gray-600">Récruteur</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconUser, IconMail, IconBriefcase, IconFileText, IconFile, IconEdit, IconTrash, IconPlus, IconListDetails, IconEye, IconGlobe } from '@tabler/icons-vue'

const documents = [
  { name: 'CV_Jean_Dupont.pdf', size: '1.2 Mo', status: 'Actif' },
  { name: 'Lettre_Motivation.pdf', size: '856 Ko', status: 'Expiré' },
  { name: 'Diplome_Universite.pdf', size: '2.1 Mo', status: 'Actif' }
]

// SEO
useHead({
  title: 'Profil',
  meta: [{ name: 'description', content: 'Vos infos personnel et de candidature sur PGS Hire' }]
})





// Etats d'ouverture des Modals
const showEditModalGeneralInfo = ref(false)
const showEditModalContacts = ref(false)

// Donnée utilisateur
const userData = ref({
  lastName: 'ATONDE',
  firstName: 'Elisée',
  email: 'elisee.atonde@example.com',
  gender: 'Masculin',
  birthDate: '1990-01-01',
  birthPlace: 'Porto-Novo',
  phone1: '+229 0102030405',
  phone2: '',
  country: 'Bénin',
  state: '',
  town: '',
  city: 'Porto-Novo',
  marital: 'single',
  child: '0',
  diplome: 'Master Informatique',
  experience: '5 ans',
  logiciels: ['Photoshop', 'Excel'],
  langues: ['Français', 'Anglais'],
  documents: [],
  preferences: {
    secteurs: ['Informatique'],
    profils: ['Développeur'],
    typesContrats: ['CDI'],
    lieux: ['Cotonou'],
    recruteurs: ['Startups', 'PME']
  }
})

// Fonction de sauvegarde
function handleUpdate(key : any, newData : any) {
  userData.value[key] = newData
}

// function handleUpdate(section, newData) {
//   switch (section) {
//     case 'general':
//       Object.assign(userData.value, newData)
//       break
//     case 'contacts':
//       userData.value.phone1 = newData.phone1
//       userData.value.adresse = newData.adresse
//       break
//     case 'education':
//       userData.value.diplome = newData.diplome
//       userData.value.experience = newData.experience
//       break
//     case 'skills':
//       userData.value.logiciels = newData.logiciels
//       userData.value.langues = newData.langues
//       break
//     case 'documents':
//       userData.value.documents = newData.documents
//       break
//     case 'preferences':
//       userData.value.preferences = newData
//       break
//   }
// }

</script>