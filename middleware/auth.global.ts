import { defineNuxtRouteMiddleware } from '#app'
import { useAuthStore } from '~/stores/auth'

// Preload current user on first navigation so isAuthenticated is accurate.
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!(auth as any).initialized?.value) {
    try { await (auth as any).ensureLoaded?.() } catch {}
  }
})
