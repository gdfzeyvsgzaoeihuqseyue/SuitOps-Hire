<template>
  <div>
    <!-- Bouton flottant -->
    <button @click="showModal = true"
      class="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
      aria-label="Ouvrir le menu d'aide et de feedback">
      <IconMessageCircle class="h-4 w-4" />
    </button>

    <!-- Modale -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button @click="showModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 rounded-full">
          <IconX class="h-6 w-6 transform transition duration-300 ease-in-out hover:rotate-90 hover:text-red-600" />
        </button>
        <h2 class="text-2xl font-bold mb-6 text-center">Besoin d'aide ou de nous contacter ?</h2>
        <div class="space-y-4">
          <!-- Assistant IA PGS -->
          <button @click="openChatbot"
            class="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/4712/4712139.png" alt="NOAH AI" class="h-6 w-6 mr-3" />
              <span>Discuter avec NOAH AI BOT</span>
            </div>
          </button>

          <!-- ChatGPT Externe -->
          <a :href="chatgptUrl" target="_blank" rel="noopener noreferrer"
            class="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="flex items-center">
              <IconBrandOpenai class="h-6 w-6 text-primary mr-3" />
              <span>Demander à ChatGPT</span>
            </div>
            <IconExternalLink class="h-4 w-4 text-gray-400" />
          </a>

          <a :href="testimonyUrl" target="_blank" @click="showModal = false"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconStar class="h-6 w-6 text-primary mr-3" />
            <span>Donner un avis / Témoignage</span>
          </a>
          <NuxtLink to="/privacy" @click="showModal = false"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconFileText class="h-6 w-6 text-primary mr-3" />
            <span>Confidentialité</span>
          </NuxtLink>
          <NuxtLink to="/terms" @click="showModal = false"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconFileDescription class="h-6 w-6 text-primary mr-3" />
            <span>Conditions Générales d'Utilisation</span>
          </NuxtLink>
          <a href="https://pgsdocs.netlify.app" target="_blank" @click="showModal = false"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconBook class="h-6 w-6 text-primary mr-3" />
            <span>Documentation</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconBrandOpenai, IconMessageCircle, IconX, IconStar, IconFileText, IconFileDescription, IconBook } from '@tabler/icons-vue';

const showModal = ref(false);
const chatbotStore = useChatbotStore();

// URL ChatGPT
const chatgptUrl = computed(() => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pageTitle = typeof document !== 'undefined' ? document.title : '';

  const customText = `Peux-tu analyser et résumer le contenu de cette page web ? Voici les informations :
Titre de la page : ${pageTitle}
URL : ${currentUrl}

Merci de me donner un résumé clair et concis des informations principales présentées sur cette page.`;

  return `https://chatgpt.com/?q=${encodeURIComponent(customText)}`;
});

const openChatbot = () => {
  showModal.value = false;
  chatbotStore.toggleChatbot();
};

// Avis
const testimonyUrl = computed(() => {
  const pgsUrl = "https://progestionsoft.netlify.app/submit-testimony";
  const params = new URLSearchParams({
    platform: 'hire',
  });
  return `${pgsUrl}?${params.toString()}`;
});
</script>
