<template>
  <main>
    <!-- Hero Section -->
    <section class="relative isolate">
      <!-- Background -->
      <div class="absolute inset-x-0 top-0 h-[800px] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary to-primary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]">
        </div>
      </div>

      <!-- Texte -->
      <div class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-16 lg:gap-12 lg:items-center">
        <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <h1 class="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Trouvez votre <span class="text-primary">prochain emploi</span> avec
            <span class="underline decoration-primary">PGS Hire</span>
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Une plateforme moderne et performante qui connecte les talents aux meilleures opportunités
            professionnelles.
          </p>
          <div class="flex flex-col mt-6">
            <div class="flex flex-wrap gap-x-6 gap-y-4 items-center">
              <NuxtLink to="/offer"
                class="btnStyle bg-primary text-white hover:bg-secondary focus-visible:outline-primary">
                Voir les offres
              </NuxtLink>

              <NuxtLink to="/dashboard"
                class="btnStyle bg-secondary text-white hover:bg-primary focus-visible:outline-primary">
                Mon espace candidat <span aria-hidden="true">→</span>
              </NuxtLink>

              <a href="https://web.suitops.com/candidate" target="_blank" rel="noopener noreferrer"
                class="btnStyle inline-block border border-gray-800 hover:bg-gray-800 hover:text-white transition-colors focus-visible:outline-gray-800">
                Je suis recruteur
              </a>
            </div>
          </div>
        </div>

        <!-- Image -->
        <div class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:basis-2/3 lg:flex-none overflow-hidden">
          <div class="max-w-full flex-none">
            <img src="https://pgsdocs.netlify.app/img/docs/postule.png" alt="App screenshot"
              class="w-full h-auto rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 object-contain">
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 justify-center items-center">
          <div
            class="flex flex-col items-center justify-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl min-h-[200px] min-w-[250px]">
            <div class="text-5xl lg:text-6xl font-bold text-primary mb-4 counter">500+</div>
            <p class="text-lg font-medium text-gray-600 text-center">Employeurs de renom</p>
          </div>
          <div
            class="flex flex-col items-center justify-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl min-h-[200px] min-w-[250px]">
            <div class="text-5xl lg:text-6xl font-bold text-primary mb-4 counter">2000+</div>
            <p class="text-lg font-medium text-gray-600 text-center">Opportunités d'emploi</p>
          </div>
          <div
            class="flex flex-col items-center justify-center p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl min-h-[200px] min-w-[250px]">
            <div class="text-5xl lg:text-6xl font-bold text-primary mb-4 counter">15k+</div>
            <p class="text-lg font-medium text-gray-600 text-center">Carrières lancées</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-50 py-24 sm:py-32">
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
        <!-- Contenu -->
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <template v-for="feature in features" :key="feature.title">
              <div class="flex flex-col">
                <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <component :is="feature.icon" class="h-5 w-5 flex-none text-primary" />
                  {{ feature.title }}
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


    <!-- Benefices Section -->
    <section class="bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base font-semibold leading-7 text-primary">Pourquoi nous choisir</h2>
          <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Les avantages de PGS Hire
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
                  class="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200">
                </div>
                <div
                  class="relative px-7 py-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                  <component :is="benefit.icon" class="w-8 h-8 text-primary" />
                  <div class="space-y-2">
                    <p class="text-slate-800 font-medium leading-4">{{ benefit.title }}</p>
                    <p class="text-slate-600 group-hover:text-slate-700 transition duration-200">{{ benefit.description
                      }}</p>
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
import { IconSearch, IconEyeStar, IconBellStar, IconCircleCheck, IconBolt, IconLock } from '@tabler/icons-vue'

const features = [
  {
    icon: IconSearch,
    title: "Recherche d'offres",
    description: "Parcourez et postulez à des offres d'emploi attractives en quelques clics, adaptées à vos compétences et aspirations.",
  },
  {
    icon: IconEyeStar,
    title: "Suivi de vos candidatures",
    description: "Suivez l'évolution de vos candidatures, organisez vos entretiens et recevez des retours pour progresser dans votre parcours professionnel.",
  },
  {
    icon: IconBellStar,
    title: "Alertes personnalisées",
    description: "Activez des alertes personnalisées pour ne manquer aucune opportunité et concentrez-vous sur l'essentiel : décrocher le poste de vos rêves.",
  },
]

const benefits = [
  {
    icon: IconCircleCheck,
    title: "Simplicité d'utilisation",
    description: "Interface intuitive et processus optimisés pour une expérience utilisateur fluide."
  },
  {
    icon: IconBolt,
    title: "Performance",
    description: "Des outils performants pour accélérer votre processus de recrutement."
  },
  {
    icon: IconLock,
    title: "Sécurité",
    description: "Protection des données et confidentialité garanties pour tous les utilisateurs."
  }
]

// SEO
useHead({
  title: 'Acceuil',
  meta: [{ name: 'description', content: 'Plateforme moderne de recrutement intégrée à PGS' }]
})
</script>

<style scoped>
.btnStyle {
  @apply font-semibold rounded-md text-sm px-3.5 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 shadow-sm
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
</style>