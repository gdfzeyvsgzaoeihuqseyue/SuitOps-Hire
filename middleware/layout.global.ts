export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/dashboard')) {
    to.meta.layout = 'dashboard'
  } else if (to.path.startsWith('/offer')) {
    to.meta.layout = 'offer'
  } else {
    to.meta.layout = 'default'
  }
})
