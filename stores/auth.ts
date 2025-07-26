import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    // Simuler une requête API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simuler un utilisateur connecté
    user.value = {
      id: '1',
      email,
      firstName: 'Elisée',
      lastName: 'ATONDE'
    }

    // Stocker dans localStorage
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  // Restaurer la session au chargement
  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth
  }
})
  