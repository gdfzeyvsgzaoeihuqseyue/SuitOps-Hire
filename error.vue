<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Contenu -->
    <main class="flex-grow flex flex-col md:flex-row px-24">
      <div class="md:w-1/3 flex items-center justify-center p-8">
        <img src="https://raw.githubusercontent.com/ProGestionSoft/Files/main/General/PriseBreak.png" alt="Break"
          class="w-full h-auto max-h-[70vh] object-contain">
      </div>

      <div class="md:w-2/3 flex flex-col items-center justify-center p-8 md:p-12">
        <div class="w-full max-w-2xl space-y-8">
          <img src="https://raw.githubusercontent.com/ProGestionSoft/Files/main/General/404.png" alt="404"
            class="w-64 h-auto mx-auto">

          <div class="text-center space-y-4">
            <h2 class="text-5xl font-bold text-gray-800">Oops!</h2>
            <p class="text-xl text-gray-600">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button @click="$router.push('/')"
              class="px-8 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition w-full sm:w-auto text-center">
              Retourner à l'accueil
            </button>
            <button @click="router.go(-1)"
              class="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto text-center">
              Page précédente
            </button>
          </div>
        </div>
      </div>
    </main>

    <div class="my-8 text-center px-4">
      <p class="text-sm text-gray-500 max-w-2xl mx-auto">
        Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre support technique.
      </p>
    </div>

    <!-- Footer Section -->
    <footer class="p-8 border-t border-gray-200 bg-gray-50">
      <div class="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
        <div>
          <img src="/img/logoDeskCol.png" alt="Logo" class="w-12 h-auto max-h-[70vh] object-contain">
        </div>

        <div>
          <p>&copy; {{ new Date().getFullYear() }} SUITOPS Hire. Tous droits réservés.</p>
        </div>

        <div class="flex space-x-6">
          <a v-for="item in socialLinks" :key="item.name" :href="item.href"
            class="text-gray-500 hover:text-gray-700 transition">
            <span class="sr-only">{{ item.name }}</span>
            <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { IconBrandGithub, IconBrandFacebook, IconBrandYoutube } from '@tabler/icons-vue'

const router = useRouter()

const socialLinks = [
  { name: 'Githube', href: '#', icon: IconBrandGithub },
  { name: 'Facebook', href: '#', icon: IconBrandFacebook },
  { name: 'YouTube', href: '#', icon: IconBrandYoutube }
]
</script>
