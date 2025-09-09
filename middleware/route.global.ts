import { useRuntimeConfig } from '#app';
import { withoutTrailingSlash } from 'ufo';

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const isBetaMode = config.public.betaMode;

  // Dossier privé
  if (isBetaMode && to.path.startsWith('/dashboard')) {
    return navigateTo('/maintenance');
  }

  // Routes privées
  const privateRoutes = [
    '/blog'
  ].map(route => withoutTrailingSlash(route));

  // Normalisation du chemin
  const normalizedPath = withoutTrailingSlash(to.path);

  // Si le mode bêta est activé
  if (isBetaMode) {
    const isPrivate = privateRoutes.includes(normalizedPath);

    if (isPrivate) {
      throw createError({
        statusCode: 403,
        statusMessage: "Accès Interdit",
        fatal: true,
      });
    }
  }
});
