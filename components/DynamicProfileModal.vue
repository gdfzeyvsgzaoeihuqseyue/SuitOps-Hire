<template>
  <div v-if="isModalOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4 border-b pb-2 sticky top-0 bg-white z-10">
          <h3 class="text-primary text-lg font-semibold flex items-center gap-2">
            <component :is="getIcon(activeSection?.iconName)" class="w-5 h-5" />
            Modifier {{ activeSection?.title.toLowerCase() }}
          </h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer la fenêtre">
            <IconX class="w-5 h-5 transform transition duration-300 ease-in-out hover:rotate-90 hover:text-critique" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Modaux généraux avec grille -->
          <div v-if="['general', 'contact'].includes(activeSection?.key as any)" class="space-y-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div v-for="item in activeSection?.items" :key="item.key" class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ item.label }}
                </label>

                <template v-if="item.inputType === 'select' || item.inputType === 'multi-select'">
                  <select v-model="formData[item.key]" :multiple="item.multiple"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                    <option v-for="option in item.options" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </template>

                <input v-else v-model="formData[item.key]" :type="item.inputType || 'text'"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
              </div>
            </div>
          </div>

          <!-- Formations et expériences -->
          <div v-if="activeSection?.key === 'education'" class="space-y-4 overflow-y-auto max-h-96">
            <div class="border-b pb-4">
              <h4 class="font-medium mb-4">Formations</h4>
              <div class="space-y-4">
                <div v-for="(edu, index) in formData.educations" :key="index"
                  class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 border rounded-xl shadow-sm">
                  <div class="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input v-model="edu.degree" placeholder="Diplôme" class="input-field w-full" />
                    <input v-model="edu.date" type="date" class="input-field w-full" />
                    <input v-model="edu.field" placeholder="Domaine" class="input-field w-full" />
                  </div>

                  <div class="col-span-12 lg:col-span-2 flex justify-end">
                    <button type="button" @click="removeEducation(index)"
                      class="text-red-500 hover:text-red-700 transition duration-300 ease-in-out">
                      <IconTrash class="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" @click="addEducation" class="btn-add mt-2">
                + Ajouter une formation
              </button>
            </div>

            <div class="border-b pb-4">
              <h4 class="font-medium mb-4">Expériences</h4>
              <div class="space-y-4">
                <div v-for="(exp, index) in formData.experiences" :key="index"
                  class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 border rounded-xl shadow-sm">
                  <div class="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input v-model="exp.company" placeholder="Entreprise" class="input-field w-full" />
                    <input v-model="exp.duration" placeholder="Durée" class="input-field w-full" />
                  </div>

                  <div class="col-span-12 lg:col-span-2 flex justify-end">
                    <button type="button" @click="removeExperience(index)"
                      class="text-red-500 hover:text-red-700 transition duration-300 ease-in-out">
                      <IconTrash class="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" @click="addExperience" class="btn-add mt-2">
                + Ajouter une expérience
              </button>
            </div>
          </div>

          <!-- Informatique et langues -->
          <div v-if="activeSection?.key === 'skills'" class="space-y-4 overflow-y-auto max-h-96">
            <div class="border-b pb-4">
              <h4 class="font-medium mb-4">Logiciels</h4>
              <div class="space-y-4">
                <div v-for="(sw, index) in formData.softwares" :key="index"
                  class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 border rounded-xl shadow-sm bg-white">
                  <div class="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input v-model="sw.name" placeholder="Nom du logiciel" class="input-field w-full" />
                    <select v-model="sw.mastery" class="input-field w-full">
                      <option value="Débutant">Débutant</option>
                      <option value="Moyen">Moyen</option>
                      <option value="Avancé">Avancé</option>
                    </select>
                  </div>

                  <div class="col-span-12 lg:col-span-2 flex justify-end">
                    <button type="button" @click="removeSoftware(index)"
                      class="text-red-500 hover:text-red-700 transition duration-300 ease-in-out">
                      <IconTrash class="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
              <button type="button" @click="addSoftware" class="btn-add mt-2">
                + Ajouter un logiciel
              </button>
            </div>

            <div class="border-b pb-4">
              <h4 class="font-medium mb-4">Langues</h4>
              <div class="space-y-4">
                <div v-for="(lg, index) in formData.langues" :key="index"
                  class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 border rounded-xl shadow-sm bg-white">
                  <div class="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input v-model="lg.langue" placeholder="Langue" class="input-field w-full" />

                    <select v-model="lg.read" class="input-field w-full">
                      <option>Faible</option>
                      <option>Moyen</option>
                      <option>Élevé</option>
                    </select>

                    <select v-model="lg.write" class="input-field w-full">
                      <option>Faible</option>
                      <option>Moyen</option>
                      <option>Élevé</option>
                    </select>
                  </div>

                  <div class="col-span-12 lg:col-span-2 flex justify-end">
                    <button type="button" @click="removeLangue(index)"
                      class="text-red-500 hover:text-red-700 transition duration-300 ease-in-out">
                      <IconTrash class="w-6 h-6" />
                    </button>
                  </div>
                </div>

              </div>
              <button type="button" @click="addLangue" class="btn-add mt-2">
                + Ajouter une langue
              </button>
            </div>
          </div>

          <!-- Documents -->
          <div v-if="activeSection?.key === 'documents'" class="space-y-4">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Type de document
              </label>
              <select v-model="documentType" class="input-field" @change="resetFileInput">
                <option value="CV">CV</option>
                <option value="Photo">Photo</option>
                <option value="Identité">Pièce d'identité</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Fichier
              </label>
              <input type="file" ref="fileInput" :accept="fileAccept" :multiple="allowMultiple"
                @change="handleFileUpload"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary" />
              <p class="text-xs text-gray-500 mt-1">{{ fileRequirements }}</p>
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nom du document
              </label>
              <input v-model="documentData.name" type="text" class="input-field" />
            </div>
          </div>

          <!-- Préférences professionnelles -->
          <div v-if="activeSection?.key === 'preferences'" class="space-y-4">
            <div class="grid grid-cols-1 gap-4">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Secteurs d'activité (séparés par des virgules)
                </label>
                <input v-model="formData.sectors" type="text" placeholder="Ex: Informatique, Marketing, Finance"
                  class="input-field" />
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Profils recherchés (séparés par des virgules)
                </label>
                <input v-model="formData.profils" type="text" placeholder="Ex: Développeur, Designer, Manager"
                  class="input-field" />
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Types de contrats
                </label>
                <select v-model="formData.typesContrats" multiple
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-auto min-h-[42px]">
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="STAGE">Stage</option>
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de postes
                </label>
                <div class="flex gap-2">
                  <select v-model="preferencesPlaceComparator" class="input-field inline-block">
                    <option value="au plus">inférieur à</option>
                    <option value="">Égal à</option>
                    <option value="au moins">supérieur à</option>
                  </select>
                  <input v-model="preferencesPlaceValue" type="number" min="0" class="input-field w-24" />
                </div>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Lieux de travail (séparés par des virgules)
                </label>
                <input v-model="formData.locations" type="text" placeholder="Ex: Cotonou, Porto-Novo, Remote"
                  class="input-field" />
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Entreprises préférées (séparées par des virgules)
                </label>
                <input v-model="formData.companies" type="text"
                  placeholder="Ex: HODD GLOBAL, Ministère de la santé" class="input-field" />
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center">
              <IconArrowLeft class="w-5 h-5 mr-1" /> Annuler
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-secondary flex items-center">
              <component :is="activeSection?.key === 'documents' ? IconUpload : IconDeviceFloppy"
                class="w-5 h-5 mr-1" />
              {{ activeSection?.key === 'documents' ? 'Téléverser' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

   <!-- Notification de succès/erreur -->
  <div v-if="showNotification" class="fixed bottom-4 right-4 z-50">
    <div :class="['px-4 py-3 rounded shadow-lg flex items-center', notificationType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
      <component :is="notificationType === 'success' ? IconCircleCheck : IconXboxX" class="w-5 h-5 mr-2" />
      <span>{{ notificationMessage }}</span>
      <button @click="showNotification = false" class="ml-4">
        <IconX class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue'
import { useProfileContent } from '~/composables/useProfileContent'
import { IconX, IconArrowLeft, IconDeviceFloppy, IconUpload, IconTrash, IconBookmarkEdit, IconCircleCheck, IconXboxX } from '@tabler/icons-vue'

const { isModalOpen, activeSection, closeModal, userData, getIcon } = useProfileContent()
const formData = reactive<Record<string, any>>({})
const documentData = reactive({
  file: null as File | null,
  name: ''
})
const uploadedFiles = ref<File[]>([])

// Notification state
const showNotification = ref(false)
const notificationType = ref<'success' | 'error'>('success')
const notificationMessage = ref('')

const showSuccessMessage = (message: string) => {
  notificationType.value = 'success'
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => showNotification.value = false, 5000)
}

const showErrorMessage = (message: string) => {
  notificationType.value = 'error'
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => showNotification.value = false, 5000)
}


watch(() => activeSection.value, (section) => {
  if (!section) return

  // Sections "general" et "contact"
  if (section.items) {
    section.items.forEach(item => {
      const keys = item.key.split('.')
      const raw = keys.reduce((acc, k) => acc?.[k], userData.value as any)
      formData[item.key] = raw ?? ''
    })
  }

  // Section Éducation / Expériences
  if (section.key === 'education') {
    formData.educations = [...userData.value.educations]
    formData.experiences = [...userData.value.experiences]
  }

  // Section Logiciels / Langues
  if (section.key === 'skills') {
    formData.softwares = [...userData.value.softwares]
    formData.langues = [...userData.value.langues]
  }

  // Section préférences
  if (section.key === 'preferences') {
    const preferences = userData.value.preferences
    formData.sectors = preferences.sectors.join(', ')
    formData.profils = preferences.profils.join(', ')
    formData.typesContrats = preferences.typesContrats.join(', ')
    formData.locations = preferences.locations.join(', ')
    formData.companies = preferences.companies.join(', ')

    const [comp, val] = preferences.places[0].split(' ')
    preferencesPlaceComparator.value = comp
    preferencesPlaceValue.value = parseInt(val)
  }
})

const documentType = ref('CV')
const fileInput = ref<HTMLInputElement>()
const preferencesPlaceComparator = ref('=')
const preferencesPlaceValue = ref(1)

const fileAccept = computed(() => {
  switch (documentType.value) {
    case 'CV': return '.pdf'
    case 'Photo': return 'image/*'
    case 'Identité': return 'image/*'
    default: return '*'
  }
})

const fileRequirements = computed(() => {
  const requirements: string[] = []
  switch (documentType.value) {
    case 'CV':
      requirements.push('PDF uniquement', 'Max 5 Mo')
      break
    case 'Photo':
      requirements.push('Image uniquement', 'Max 10 Mo')
      break
    case 'Identité':
      requirements.push('Image uniquement', 'Max 2 Mo')
      break
    default:
      requirements.push('Max 10 Mo pour tous les fichiers', 'Max 5 fichiers')
  }
  return requirements.join(' • ')
})

const allowMultiple = computed(() => documentType.value === 'Autre')

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const files = Array.from(input.files)

  // Règles selon le type de document
  if (documentType.value === 'CV') {
    const file = files[0]
    if (file.type !== 'application/pdf') {
      alert('Seuls les fichiers PDF sont autorisés pour le CV.')
      input.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier dépasse 5 Mo.')
      input.value = ''
      return
    }
  } else if (documentType.value === 'Photo') {
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Seuls les images sont autorisés pour la photo.')
      input.value = ''
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier dépasse 10 Mo.')
      input.value = ''
      return
    }
  } else if (documentType.value === 'Identité') {
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Seuls les images sont autorisés pour la pièce d\'identité.')
      input.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Le fichier dépasse 2 Mo.')
      input.value = ''
      return
    }
  } else {
    if (files.length > 5) {
      alert('Maximum 5 fichiers autorisés.')
      input.value = ''
      return
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > 10 * 1024 * 1024) {
      alert('La taille totale des fichiers ne doit pas dépasser 10 Mo.')
      input.value = ''
      return
    }
  }

  uploadedFiles.value = files
}

const resetFileInput = () => {
  if (fileInput.value) fileInput.value.value = ''
}


const handleSubmit = () => {
  try {
    if (activeSection.value?.key === 'preferences') {
      // Pour les types de contrats, on gère directement le tableau si c'est déjà un tableau
      const typesContrats = Array.isArray(formData.typesContrats)
        ? formData.typesContrats
        : formData.typesContrats.split(',').map(s => s.trim()).filter(Boolean)

      userData.value.preferences = {
        sectors: formData.sectors.split(',').map(s => s.trim()).filter(Boolean),
        profils: formData.profils.split(',').map(s => s.trim()).filter(Boolean),
        typesContrats: typesContrats,
        places: [`${preferencesPlaceComparator.value} ${preferencesPlaceValue.value}`],
        locations: formData.locations.split(',').map(s => s.trim()).filter(Boolean),
        companies: formData.companies.split(',').map(s => s.trim()).filter(Boolean)
      }
    } else if (activeSection.value?.key === 'documents') {
      if (!documentData.file || !documentData.name) {
        throw new Error('Veuillez sélectionner un fichier et donner un nom au document')
      }
      
      userData.value.documents.push({
        name: documentData.name,
        size: `${(documentData.file.size / 1024).toFixed(1)} Ko`,
        status: 'Actif'
      })
    } else {
      // Mettre à jour les données imbriquées
      Object.entries(formData).forEach(([key, value]) => {
        const keys = key.split('.')
        let obj = userData as any
        for (let i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]]
        }
        obj[keys[keys.length - 1]] = value
      })
    }

    showSuccessMessage(`${activeSection.value?.title} enregistré avec succès !`)
    closeModal()
  } catch (error) {
    showErrorMessage(error.message || `Une erreur est survenue lors de l'enregistrement de ${activeSection.value?.title}`)
  }
}

// Méthodes d'ajout pour les sections dynamiques
const addEducation = () => formData.educations.push({ degree: '', date: '', field: '' })
const addExperience = () => formData.experiences.push({ company: '', duration: '' })
const addSoftware = () => formData.softwares.push({ name: '', mastery: 'Moyen' })
const addLangue = () => formData.langues.push({ langue: '', read: 'Moyen', write: 'Moyen' })

// Méthodes de suppression
const removeEducation = (i: number) => formData.educations.splice(i, 1)
const removeExperience = (i: number) => formData.experiences.splice(i, 1)
const removeSoftware = (i: number) => formData.softwares.splice(i, 1)
const removeLangue = (i: number) => formData.langues.splice(i, 1)
</script>

<style scoped>
.input-field {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary;
}

.btn-add {
  @apply text-primary hover:text-secondary text-sm flex items-center gap-1;
}
</style>
