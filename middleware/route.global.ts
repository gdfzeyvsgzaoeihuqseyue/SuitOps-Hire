import { useRuntimeConfig, createError, abortNavigation, navigateTo } from '#app'
import { withoutTrailingSlash } from 'ufo'

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  const isBetaMode = config.public?.betaMode
  const normalizedPath = withoutTrailingSlash(to.path)

  // Rediriger /dashboard
  if (normalizedPath === '/dashboard' || normalizedPath.startsWith('/dashboard/')) {
    return navigateTo('/maintenance')
  }

  // Autres routes privées
  if (isBetaMode) {
    const privateRoutes = ['/other'].map(r => withoutTrailingSlash(r))
    const isFolderRoute = normalizedPath.startsWith('/nothing')
    const isPrivate = privateRoutes.includes(normalizedPath)

     // Bloquer les routes interdites
    if (isFolderRoute || isPrivate) {
      const err = createError({
        statusCode: 403,
        statusMessage: 'Accès Interdit',
        fatal: true,
      })

      if (process.server) throw err
      return abortNavigation(err)
    }
  }
})
