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

  // Si le mode bêta est actif bloquer /blog
  if (isBetaMode && normalizedPath.startsWith('/nothing')) {
    const err = createError({
      statusCode: 403,
      statusMessage: 'Accès Interdit',
      fatal: true,
    })

    if (process.server) throw err
    return abortNavigation(err)
  }

  // Autres routes privées
  if (isBetaMode) {
    const privateRoutes = ['/other'].map(r => withoutTrailingSlash(r))
    if (privateRoutes.includes(normalizedPath)) {
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
