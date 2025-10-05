<template>
  <div class="bg-gray-50 flex flex-col justify-center sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900">
        Connectez-vous à votre compte
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Ou
        <NuxtLink to="/auth/signup" class="font-medium text-primary hover:text-secondary">
          créez un nouveau compte
        </NuxtLink>
      </p>
      <span v-if="config.public.betaMode"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
        BETA
      </span>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Message d'erreur -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {{ error }}
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
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
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div class="mt-1">
              <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div class="text-sm">
              <NuxtLink to="/auth/forgot-password" class="font-medium text-primary hover:text-secondary">
                Mot de passe oublié ?
              </NuxtLink>
            </div>
          </div>

          <div>
            <button type="submit" :disabled="isLoading"
              class="flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <IconLoader2 v-if="isLoading" class="animate-spin h-5 w-5 mr-2" />
              {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <button
                class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50">
                <span class="sr-only">Se connecter avec Google</span>
                <IconBrandGoogle class="h-5 w-5" />
              </button>
            </div>

            <div>
              <button
                class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50">
                <span class="sr-only">Se connecter avec LinkedIn</span>
                <IconBrandLinkedin class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IconBrandGoogle, IconBrandLinkedin, IconLoader2 } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig();
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''

    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la connexion"
  } finally {
    isLoading.value = false
  }
}

// SEO
useHead({
  title: 'Connexion',
  meta: [{ name: 'description', content: 'Connectez-vous à votre compte SuitOps Hire' }]
})
</script>
