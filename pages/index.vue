<template>
  <main>
    <section class="relative isolate">
      <div class="absolute inset-x-0 top-0 h-[800px] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary to-primary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] transition-all duration-700 ease-out">
        </div>
      </div>

      <div
        class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 flex flex-col lg:flex-row lg:px-8 lg:py-24 lg:gap-12 lg:items-center">
        <div
          class="order-2 lg:order-1 mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8 text-center lg:text-left">
          <h1 class="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-body">
            Trouvez votre <span class="text-primary">prochain emploi</span> avec
            <span class="underline decoration-primary">SuitOps Hire</span>
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Une plateforme moderne et performante qui connecte les talents aux meilleures opportunités
            professionnelles.
          </p>
          <div class="flex flex-col mt-8 items-center lg:items-start">
            <div class="flex flex-wrap gap-x-4 gap-y-4 items-center justify-center lg:justify-start">
              <NuxtLink to="/offer"
                class="btnStyle bg-primary text-white hover:bg-secondary focus-visible:outline-primary transform hover:-translate-y-0.5 transition-all duration-200">
                Voir les offres
              </NuxtLink>

              <NuxtLink to="/dashboard"
                class="btnStyle bg-secondary text-white hover:bg-primary focus-visible:outline-secondary transform hover:-translate-y-0.5 transition-all duration-200">
                Mon espace candidat <span aria-hidden="true">→</span>
              </NuxtLink>

              <a href="https://web.pgs.ctrlengine.com/offers" target="_blank" rel="noopener noreferrer"
                class="btnStyle inline-block border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors focus-visible:outline-gray-800 transform hover:-translate-y-0.5 duration-200">
                Je suis recruteur
              </a>
            </div>
          </div>
        </div>

        <div
          class="order-1 lg:order-2 mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:basis-2/3 lg:flex-none overflow-hidden justify-center">
          <div class="w-full flex-none">
            <img :src="sharedFiles.paths.general.indexHero" alt="SuitOps Hire"
              class="w-full h-auto rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 object-contain max-h-[500px] sm:max-h-full">
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div v-if="jobsStore.isLoading" class="text-center py-8">
          <p class="text-gray-600">Chargement des statistiques...</p>
        </div>
        <div v-else-if="jobsStore.error" class="text-center py-8 text-critique">
          <p>Erreur de chargement des statistiques. Veuillez réessayer plus tard.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 justify-center items-stretch">
          <div v-for="stat in dynamicStatistics" :key="stat.label"
            class="flex flex-col items-center justify-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white shadow-sm min-h-[200px]">
            <div class="text-5xl lg:text-6xl font-bold text-primary mb-4 counter">{{ stat.value }}</div>
            <p class="text-lg font-medium text-gray-700 text-center leading-relaxed">{{ stat.label }}</p>
            <p v-if="stat.note" class="mt-2 text-center text-sm text-gray-500 italic">{{ stat.note }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base font-semibold leading-7 text-primary">
            Recherche d'emploi simplifiée
          </h2>
          <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tout ce dont vous avez besoin pour propulser votre carrière
          </p>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Des outils puissants et intuitifs pour vous accompagner dans votre recherche et décrocher le poste idéal.
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <template v-for="feature in features" :key="feature.title">
              <div
                class="flex flex-col p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <component :is="feature.icon" class="h-6 w-6 flex-none text-primary" /> {{ feature.title }}
                </dt>
                <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p class="flex-auto">{{ feature.description }}</p>
                </dd>
              </div>
            </template>
          </dl>
        </div>
      </div>
    </section>


    <section class="bg-gray-50 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base font-semibold leading-7 text-primary">Pourquoi nous choisir</h2>
          <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Les avantages de SuitOps Hire
          </p>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Découvrez pourquoi les entreprises et les candidats nous font confiance pour leurs besoins en recrutement.
          </p>
        </div>

        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div class="grid grid-cols-1 gap-y-8 gap-x-6 lg:grid-cols-3">
            <template v-for="benefit in benefits" :key="benefit.title">
              <div class="relative group">
                <div
                  class="absolute -inset-0.5 bg-gradient-to-r from-primary/60 to-secondary/60 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200">
                </div>
                <div
                  class="relative px-7 py-6 bg-white ring-1 ring-gray-900/5 rounded-xl leading-none flex items-top justify-start space-x-6 h-full">
                  <component :is="benefit.icon" class="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div class="space-y-2">
                    <p class="text-slate-800 font-medium text-lg leading-snug">{{ benefit.title }}</p>
                    <p
                      class="text-slate-600 group-hover:text-slate-700 transition duration-200 text-base leading-relaxed">
                      {{ benefit.description }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useJobsStore } from '~/stores/jobs';
import { storeToRefs } from 'pinia';
import { IconSearch, IconEyeStar, IconBellStar, IconCircleCheck, IconBolt, IconLock } from '@tabler/icons-vue'
import { useSharedFiles } from '~/stores/sharedFiles';

const sharedFiles = useSharedFiles();
const jobsStore = useJobsStore();
const { jobs, isLoading, error } = storeToRefs(jobsStore);

// Fonction pour formater les grands nombres
const formatNumber = (num) => {
  if (num < 10) {
    return num.toString();
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
  }
  if (num >= 10) {
    if (num < 100) {
      return num.toString() + '+';
    }
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k+';
  }
  return num.toString();
};

// Calcul des statistiques réelles
const totalJobs = computed(() => jobs.value.length);

const uniqueCompanies = computed(() => {
  const companyIds = new Set();
  jobs.value.forEach(job => {
    if (job.company && job.company.id) {
      companyIds.add(job.company.id);
    }
  });
  return companyIds.size;
});

// Estimation des carrières lancées
const estimatedCareersLaunched = computed(() => {
  const baseValue = jobs.value.length;
  const multiplier = 5;
  return Math.floor(baseValue * multiplier);
});

// Définir les statistiques dynamiques
const dynamicStatistics = computed(() => [
  { value: formatNumber(totalJobs.value), label: "Opportunités d'emploi" },
  { value: formatNumber(uniqueCompanies.value), label: "Employeurs de renom" },
  {
    value: formatNumber(estimatedCareersLaunched.value),
    label: "Carrières lancées",
    note: "Estimation basée sur l'activité de la plateforme."
  },
]);

// Au montage du composant, déclenchez la récupération des jobs si ce n'est pas déjà fait
onMounted(() => {
  if (jobs.value.length === 0 && !isLoading.value && !error.value) {
    jobsStore.fetchJobs();
  }
});


// Data for sections (features and benefits remain as is)
const features = [
  {
    icon: IconSearch,
    title: "Recherche d'offres intuitive",
    description: "Parcourez et postulez à des milliers d'offres d'emploi attractives en quelques clics, parfaitement adaptées à vos compétences et aspirations professionnelles.",
  },
  {
    icon: IconEyeStar,
    title: "Suivi détaillé des candidatures",
    description: "Suivez en temps réel l'évolution de vos candidatures, organisez vos entretiens et recevez des retours constructifs pour progresser sereinement dans votre parcours professionnel.",
  },
  {
    icon: IconBellStar,
    title: "Alertes d'emploi personnalisées",
    description: "Activez des alertes personnalisées basées sur vos critères pour ne manquer aucune nouvelle opportunité et concentrez-vous sur l'essentiel : décrocher le poste de vos rêves.",
  },
]

const benefits = [
  {
    icon: IconCircleCheck,
    title: "Simplicité et Ergonomie",
    description: "Profitez d'une interface intuitive et de processus optimisés, conçus pour une expérience utilisateur fluide et agréable à chaque étape.",
  },
  {
    icon: IconBolt,
    title: "Performance et Rapidité",
    description: "Bénéficiez d'outils performants et réactifs qui accélèrent votre processus de recherche ou de recrutement, vous faisant gagner un temps précieux.",
  },
  {
    icon: IconLock,
    title: "Sécurité et Confidentialité",
    description: "Vos données sont notre priorité. Nous garantissons une protection des informations et une confidentialité absolue pour tous nos utilisateurs.",
  },
]

// SEO
useSeoMeta({
  title: 'SuitOps Hire - Trouvez votre prochain emploi au Bénin et au-delà',
  ogTitle: 'SuitOps Hire - Votre Partenaire Carrière',
  description: 'SuitOps Hire : La plateforme moderne et performante qui connecte les talents aux meilleures opportunités professionnelles au Bénin. Trouvez, postulez, et propulsez votre carrière.',
})
</script>

<style scoped>
.btnStyle {
  @apply font-semibold rounded-md text-sm px-3.5 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 shadow-sm;
}

.counter {
  @apply relative;
}

.counter::after {
  content: '';
  @apply absolute bottom-0 left-1/2 w-12 h-1 bg-primary rounded-full transform -translate-x-1/2 transition-all duration-300;
}

.counter:hover::after {
  @apply w-16;
}

/* Custom animations for better visual feedback */
@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInSlideUp {
  animation: fadeInSlideUp 0.5s ease-out forwards;
}
</style>
