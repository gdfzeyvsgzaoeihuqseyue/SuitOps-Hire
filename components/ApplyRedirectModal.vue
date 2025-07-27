<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative">
      <button
        @click="close"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        aria-label="Fermer"
      >
        ✕
      </button>
      <h2 class="text-xl font-semibold text-gray-800 mb-4">
        Redirection en cours...
      </h2>
      <p class="text-gray-600 mb-4">
        Vous allez être redirigé vers PGS HIRE pour postuler.
        <br />
        Redirection dans <strong>{{ countdown }}</strong> secondes.
      </p>
      <div class="flex justify-end gap-2">
        <button
          @click="redirectNow"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
        >
          Rediriger maintenant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const props = defineProps<{
  visible: boolean;
  redirectUrl: string;
}>();

const emits = defineEmits(["close"]);

const countdown = ref(10);
let timer: ReturnType<typeof setInterval> | null = null;;

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) startCountdown();
    else resetCountdown();
  }
);

function startCountdown() {
  resetCountdown();
  timer = setInterval(() => {
    if (countdown.value <= 1) {
      redirectNow();
    } else {
      countdown.value -= 1;
    }
  }, 1000);
}

function resetCountdown() {
  countdown.value = 10;
  if (timer) clearInterval(timer);
}

function redirectNow() {
  window.location.href = props.redirectUrl;
}

function close() {
  resetCountdown();
  emits("close");
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
