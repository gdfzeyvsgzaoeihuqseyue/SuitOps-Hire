<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <NuxtLink to="/" class="flex justify-center">
        <img src="/img/logoDeskCol.png" alt="PGS Hire" class="h-12 w-auto" />
      </NuxtLink>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Définir un nouveau mot de passe
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form v-if="!resetComplete" class="space-y-6" @submit.prevent="handleResetPassword">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <div class="mt-1">
              <input id="password" v-model="password" name="password" type="password" required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le nouveau mot de passe
            </label>
            <div class="mt-1">
              <input id="confirmPassword" v-model="confirmPassword" name="confirmPassword" type="password" required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
            </div>
          </div>

          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Réinitialiser le mot de passe
            </button>
          </div>
        </form>

        <!-- Message de confirmation -->
        <div v-else class="text-center">
          <IconCheck class="mx-auto h-12 w-12 text-green-500" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Mot de passe réinitialisé</h3>
          <p class="mt-1 text-sm text-gray-500">
            Votre mot de passe a été réinitialisé avec succès
          </p>
          <div class="mt-6">
            <NuxtLink to="/auth/login"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Se connecter
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconCheck } from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const token = route.query.token

const password = ref('')
const confirmPassword = ref('')
const resetComplete = ref(false)

const handleResetPassword = () => {
  if (password.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas')
    return
  }

  // TODO: Implement actual password reset logic with token
  console.log('Password reset with token:', token)
  console.log('New password:', password.value)

  resetComplete.value = true
  setTimeout(() => {
    router.push('/auth/login')
  }, 3000)
}

// SEO
useHead({
  title: 'Réinitialisation du mot de passe',
  meta: [{ name: 'description', content: 'Définissez votre nouveau mot de passe PGS Hire' }]
})
</script>
