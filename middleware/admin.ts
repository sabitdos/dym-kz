import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) {
    try { await auth.ensureLoaded() } catch {}
  }
  if (!auth.isAuthenticated) {
    return navigateTo('/login?redirect=' + encodeURIComponent(to.fullPath))
  }
  if (!auth.isAdmin) {
    return navigateTo('/')
  }
})
