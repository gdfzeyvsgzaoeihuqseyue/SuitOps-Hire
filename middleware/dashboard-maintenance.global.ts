export default defineNuxtRouteMiddleware((to) => {
  // Vérifie si l'utilisateur accède à une page du dashboard
  if (to.path.startsWith('/ssdashboard')) {
    // Redirection vers la page de maintenance
    return navigateTo('/maintenance');
  }
});
