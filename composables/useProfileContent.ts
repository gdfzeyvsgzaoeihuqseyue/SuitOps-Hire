import { ref, reactive } from 'vue'
import { IconUser, IconMail, IconBriefcase, IconGlobe, IconFileText, IconSettings } from '@tabler/icons-vue'

interface UserData {
  lastName: string
  firstName: string
  email: string
  gender: string
  birthDate: string
  birthPlace: string
  phone1: string
  phone2: string
  country: string
  state: string
  town: string
  city: string
  marital: string
  child: number
  educations: { degree: string, date: string, field: string }[]
  experiences: { company: string, duration: string }[]
  softwares: { name: string, mastery: string }[]
  langues: { langue: string, read: string, write: string }[]
  documents: { name: string, size: string, status: string }[]
  preferences: { sectors: string[], profils: string[], typesContrats: string[], places: string[], locations: string[], companies: string[] }
}

interface ContentItem {
  label: string
  value: string | number
  key: string
  inputType?: 'text' | 'email' | 'number' | 'date' | 'tel' | 'select' | 'multi-select'
  options?: { value: string; label: string }[]
  multiple?: boolean
}

interface ContentSection {
  key: string
  title: string
  Icon: any
  gridCols: number
  hasEditor: boolean
  items?: ContentItem[]
  educations?: UserData['educations']
  experiences?: UserData['experiences']
  softwares?: UserData['softwares']
  langues?: UserData['langues']
  documents?: UserData['documents']
  customForm?: boolean
}

export const useProfileContent = () => {
  const isModalOpen = useState('isModalOpen', () => ref(false))
  const activeSection = useState<ContentSection | null>('activeSection', () => ref(null))

  const userData = useState<UserData>('userData', () => reactive({
    lastName: 'ATONDE',
    firstName: 'Elisée',
    email: 'elisee.atonde@example.com',
    gender: 'Masculin',
    birthDate: '01 Janvier 1990',
    birthPlace: 'Porto-Novo',
    phone1: '+229 0102030405',
    phone2: '',
    country: 'Bénin',
    state: '',
    town: '',
    city: 'Porto-Novo',
    marital: 'Célibataire',
    child: 0,
    educations: [
      { degree: 'Licence Informatique', date: '13 mai 2025', field: 'Système logiciel' },
    ],
    experiences: [
      { company: 'HODD Global', duration: '3 mois' },
    ],
    softwares: [
      { name: 'Microsoft Word', mastery: 'Moyen' },
      { name: 'Photoshop', mastery: 'Avancé' },
    ],
    langues: [
      { langue: 'Français', read: 'Élevé', write: 'Moyen' },
      { langue: 'Anglais', read: 'Moyen', write: 'Faible' },
    ],
    documents: [
      { name: 'CV_Jean_Dupont.pdf', size: '1.2 Mo', status: 'Actif' },
      { name: 'Lettre_Motivation.pdf', size: '856 Ko', status: 'Expiré' },
      { name: 'Diplome_Universite.pdf', size: '2.1 Mo', status: 'Actif' }
    ],

    preferences: {
      sectors: ['Informatique'],
      profils: ['Développeur'],
      typesContrats: ['CDI'],
      places: ['au moins 2'],
      locations: ['Cotonou'],
      companies: ['HODD GLOBAL', 'Ministère de la santé']
    }
  }))

  const sections = useState<ContentSection[]>('sections', () => ref([
    {
      key: 'general',
      title: 'Informations générales',
      Icon: 'IconUser',
      gridCols: 2,
      hasEditor: true,
      items: [
        { label: 'Nom', value: userData.value.lastName, key: 'lastName', inputType: 'text' },
        { label: 'Prénoms', value: userData.value.firstName, key: 'firstName', inputType: 'text' },
        { label: 'Email', value: userData.value.email, key: 'email', inputType: 'email' },
        {
          label: 'Sexe', value: userData.value.gender, key: 'gender', inputType: 'select',
          options: [
            { value: 'Masculin', label: 'Masculin' },
            { value: 'Féminin', label: 'Féminin' }
          ]
        },
        { label: 'Date de naissance', value: userData.value.birthDate, key: 'birthDate', inputType: 'date' },
        { label: 'Lieu de naissance', value: userData.value.birthPlace, key: 'birthPlace', inputType: 'text' },
      ],
    },
    {
      key: 'contact',
      title: 'Contacts et résidences',
      Icon: 'IconMail',
      gridCols: 3,
      hasEditor: true,
      items: [
        { label: 'Téléphone 1', value: userData.value.phone1 || '–', key: 'phone1', inputType: 'tel' },
        { label: 'Téléphone 2', value: userData.value.phone2 || '–', key: 'phone2', inputType: 'tel' },
        { label: 'Pays', value: userData.value.country || '–', key: 'country', inputType: 'text' },
        { label: 'Département', value: userData.value.state || '–', key: 'state', inputType: 'text' },
        { label: 'Commune', value: userData.value.town || '–', key: 'town', inputType: 'text' },
        { label: 'Ville', value: userData.value.city || '–', key: 'city', inputType: 'text' },
        {
          label: 'Situation matrimoniale', value: userData.value.marital || '–', key: 'marital', inputType: 'select',
          options: [
            { value: 'Célibataire', label: 'Célibataire' },
            { value: 'Union Libre', label: 'Union Libre' },
            { value: 'Marié(e)', label: 'Marié(e)' },
            { value: 'Divorcé(e)', label: 'Divorcé(e)' },
            { value: 'Veuf(ve)', label: 'Veuf(ve)' }
          ]
        },
        { label: 'Nombre d\'enfants', value: userData.value.child || '–', key: 'child', inputType: 'number' },
      ],
    },
    {
      key: 'education',
      title: 'Formations, diplômes et expériences',
      Icon: 'IconBriefcase',
      gridCols: 2,
      hasEditor: true,
      educations: userData.value.educations || [],
      experiences: userData.value.experiences || [],
    },
    {
      key: 'skills',
      title: 'Informatique et langues',
      Icon: 'IconGlobe',
      gridCols: 2,
      hasEditor: true,
      softwares: userData.value.softwares || [],
      langues: userData.value.langues || [],
    },
    {
      key: 'documents',
      title: 'Documents',
      Icon: 'IconFileText',
      gridCols: 3,
      hasEditor: true,
      documents: userData.value.documents || [],
    },
    {
      key: 'preferences',
      title: 'Préférences professionnelles',
      Icon: 'IconSettings',
      gridCols: 3,
      hasEditor: true,
      items: [
        {
          label: 'Secteurs d\'activité',
          value: userData.value.preferences.sectors.join(', '),
          key: 'preferences.sectors',
          inputType: 'multi-select',
          options: [
            { value: 'Informatique', label: 'Informatique' },
            { value: 'Santé', label: 'Santé' },
            { value: 'Éducation', label: 'Éducation' }
          ],
          multiple: true
        },
        {
          label: 'Profils recherchés',
          value: userData.value.preferences.profils.join(', '),
          key: 'preferences.profils',
          inputType: 'multi-select',
          options: [
            { value: 'Développeur', label: 'Développeur' },
            { value: 'Designer', label: 'Designer' },
            { value: 'Manager', label: 'Manager' }
          ],
          multiple: true
        },
        {
          label: 'Types de contrats',
          value: userData.value.preferences.typesContrats.join(', '),
          key: 'preferences.typesContrats',
          inputType: 'multi-select',
          options: [
            { value: 'CDI', label: 'CDI' },
            { value: 'CDD', label: 'CDD' },
            { value: 'Freelance', label: 'Freelance' }
          ],
          multiple: true
        },
        {
          label: 'Lieux de travail',
          value: userData.value.preferences.locations.join(', '),
          key: 'preferences.locations',
          inputType: 'multi-select',
          options: [
            { value: 'Cotonou', label: 'Cotonou' },
            { value: 'Porto-Novo', label: 'Porto-Novo' },
            { value: 'Remote', label: 'Remote' }
          ],
          multiple: true
        },
        {
          label: 'Recruteurs',
          value: userData.value.preferences.companies.join(', '),
          key: 'preferences.companies',
          inputType: 'multi-select',
          options: [
            { value: 'HODD GLOBAL', label: 'HODD GLOBAL' },
            { value: 'Ministère de la santé', label: 'Ministère de la santé' }
          ],
          multiple: true
        }
      ]
    }
  ]))

  const icons = {
    IconUser,
    IconMail,
    IconBriefcase,
    IconGlobe,
    IconFileText,
    IconSettings
  }

  const getIcon = (iconName: string) => icons[iconName as keyof typeof icons]

  const openModal = (sectionKey: string) => {
    activeSection.value = sections.value.find(s => s.key === sectionKey) || null
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
    activeSection.value = null
  }

  return { userData, sections, getIcon, isModalOpen, activeSection, openModal, closeModal }
}
