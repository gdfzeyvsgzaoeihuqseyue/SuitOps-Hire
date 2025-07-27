<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" @click="closeModal"></div>

    <div
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto z-50 transform transition-all sm:p-8 relative">
      <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">Important : Postuler sur PGS HIRE</h3>

      <div class="text-gray-700 text-center mb-6">
        <p class="mb-3">
          Actuellement, il n'est pas encore possible de postuler à une offre ici.
        </p>
        <p class="font-semibold text-primary">
          Vous allez être redirigé automatiquement.
        </p>
        <p class="text-sm text-gray-500 mt-2">
          Redirection dans <span class="font-bold">{{ countdown }}</span> secondes...
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <button @click="redirectToPGS"
          class="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 w-full">
          <IconExternalLink class="w-5 h-5 mr-2" />
          Rediriger maintenant
        </button>
        <button @click="closeModal"
          class="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 w-full">
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { IconExternalLink } from '@tabler/icons-vue';

const props = defineProps<{
  targetUrl: string; 
}>();

const emit = defineEmits(['close']);

const isOpen = ref(false);
const countdown = ref(10);
let timer: ReturnType<typeof setInterval> | null = null;

const openModal = () => {
  isOpen.value = true;
  countdown.value = 10; // Reset countdown each time modal opens
  startCountdown();
};

const closeModal = () => {
  isOpen.value = false;
  stopCountdown();
  emit('close'); // Emit event to parent if needed
};

const startCountdown = () => {
  stopCountdown(); // Clear any existing timer
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      stopCountdown();
      redirectToPGS();
    }
  }, 1000);
};

const stopCountdown = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const redirectToPGS = () => {
  if (props.targetUrl) {
    window.location.href = props.targetUrl;

    // Si nouvel ongle
    // window.open(props.targetUrl, '_blank');
    // closeModal();
  }
};

// Expose openModal to parent component
defineExpose({
  openModal
});

// Clean up timer when component is unmounted
onUnmounted(() => {
  stopCountdown();
});
</script>