import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
	// Only guard /admin routes, except admin login
	if (!to.path.startsWith('/admin')) return
	if (to.path === '/admin/login') return

	const auth = useAuthStore()
	// Ensure we attempted loading current user (first client nav)
	if (!(auth as any).initialized?.value) {
		try { await (auth as any).ensureLoaded?.() } catch {}
	}

	const isAuthedRef = (auth as any).isAuthenticated
	const isAdminRef = (auth as any).isAdmin
	const authed = typeof isAuthedRef === 'object' && 'value' in isAuthedRef ? isAuthedRef.value : !!isAuthedRef
	const admin = typeof isAdminRef === 'object' && 'value' in isAdminRef ? isAdminRef.value : !!isAdminRef
	if (!authed) return navigateTo('/admin/login')
	if (!admin) return navigateTo('/')
})
