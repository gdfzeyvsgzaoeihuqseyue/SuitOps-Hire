export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const authStore = useAuthStore()
  await authStore.initAuth()

  const isAuthenticated = authStore.isAuthenticated

  const isPublic =
    to.path === '/' ||
    to.path.startsWith('/auth') ||
    to.path.startsWith('/offer')

  // Redirige les utilisateurs non connectés vers la page de login s’ils accèdent à une page protégée
  if (!isPublic && !isAuthenticated) {
    return navigateTo('/auth/login')
  }

  // Redirige les utilisateurs déjà connectés loin des pages du dossier /auth
  if (to.path.startsWith('/auth') && isAuthenticated) {
    return navigateTo('/')
  }
})
