<template>
  <div class="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900">
        Réinitialiser votre mot de passe
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Ou
        <NuxtLink to="/auth/login" class="font-medium text-primary hover:text-secondary">
          retourner à la page de connexion
        </NuxtLink>
      </p>
      <span v-if="config.public.betaMode"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
        BETA
      </span>      
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form v-if="!emailSent" class="space-y-6" @submit.prevent="handleForgotPassword">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
            </div>
          </div>

          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Envoyer les instructions
            </button>
          </div>
        </form>

        <!-- Message de confirmation -->
        <div v-else class="text-center">
          <IconMailCheck class="mx-auto h-12 w-12 text-green-500" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Email envoyé</h3>
          <p class="mt-1 text-sm text-gray-500">
            Les instructions de réinitialisation ont été envoyées à {{ email }}
          </p>
          <div class="mt-6">
            <NuxtLink to="/auth/login"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Retour à la connexion
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconMailCheck } from '@tabler/icons-vue'

const config = useRuntimeConfig();
const email = ref('')
const emailSent = ref(false)

const handleForgotPassword = () => {
  // TODO: Implement actual password reset logic
  console.log('Password reset requested for:', email.value)
  emailSent.value = true
}

// SEO
useHead({
  title: 'Mot de passe oublié',
  meta: [{ name: 'description', content: 'Réinitialisez votre mot de passe SuitOps Hire' }]
})
</script>
