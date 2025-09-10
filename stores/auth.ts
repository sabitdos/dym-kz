import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Models } from "appwrite"
import { useAppwrite } from "~/composables/useAppwrite"
import { useRuntimeConfig } from '#imports'
import { getDatabaseId, getCollections } from "~/utils/appwrite"

type User = Models.User<Models.Preferences>

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig()
  const { databases, account } = useAppwrite()
  
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const initialized = ref(false)
  const isAuthenticated = computed(() => !!user.value)
  // Simple admin detection: by custom preference flag or email domain list
  const adminEmails = (config.public as any).adminEmails ? String((config.public as any).adminEmails).split(',').map((e:string)=>e.trim().toLowerCase()).filter(Boolean) : []
  const isAdmin = computed(() => {
    const u: any = user.value
    if (!u) return false
    // preference flag (if profile document has role / isAdmin field)
    if (u.role === 'admin' || u.isAdmin === true) return true
    if (u.prefs && (u.prefs.role === 'admin' || u.prefs.isAdmin === true)) return true
    if (u.email && adminEmails.includes(String(u.email).toLowerCase())) return true
    return false
  })

  const getCurrentUser = async () => {
    // Avoid parallel calls
    if (isLoading.value) {
      return
    }
    try {
      isLoading.value = true
      const accountData = await account.get()
      const dbId = getDatabaseId()
      const cols: any = getCollections()
      try {
        const userData = await databases.getDocument(
          dbId,
          cols.USERS,
          accountData.$id
        )
        user.value = userData as any
      } catch {
        // fallback: use account data when profile doc is not present
        user.value = accountData as any
      }
      if (process.client) {
        console.debug('[auth] loaded user', { id: user.value?.$id, email: user.value?.email, admin: isAdmin.value })
        if (!adminEmails.length) console.warn('[auth] adminEmails not configured in runtime config')
      }
    } catch {
      user.value = null
    } finally {
      initialized.value = true
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      if (isAuthenticated.value) {
        // уже есть активная сессия, проверим пользователя
        if (user.value?.email?.toLowerCase() === email.toLowerCase()) {
          return true
        } else {
          // другая учетка – выйдем и создадим новую сессию
          try { await account.deleteSession('current') } catch {}
        }
      } else {
        // Попробуем получить текущего (вдруг сессия уже есть но store пуст)
        try { await getCurrentUser(); if (isAuthenticated.value && user.value?.email?.toLowerCase() === email.toLowerCase()) return true } catch {}
      }

      const acc: any = account as any
      const createSession = async () => {
        if (typeof acc.createEmailPasswordSession === 'function') {
          return acc.createEmailPasswordSession({ email, password })
        } else if (typeof acc.createEmailSession === 'function') {
          return acc.createEmailSession(email, password)
        } else if (typeof acc.createSession === 'function') {
          return acc.createSession(email, password)
        } else {
          throw new Error('No compatible Appwrite session creation method found.')
        }
      }

      try {
        await createSession()
      } catch (e: any) {
        const msg = String(e?.message || '').toLowerCase()
        // Если сессия уже существует – считаем успехом
        if (msg.includes('session is active') || msg.includes('already') || e?.code === 409) {
          // просто продолжим
        } else if (e?.code === 401) {
          console.error('Login invalid credentials')
          return false
        } else {
          console.error('Login error (create session):', e)
          return false
        }
      }

      await getCurrentUser()
      return !!isAuthenticated.value
    } catch (err) {
      console.error('Login error (outer):', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      isLoading.value = true
      await account.create("unique()", email, password, name)
      return await login(email, password)
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession("current")
      user.value = null
      initialized.value = true
      return true
    } catch (error) {
      console.error("Logout error:", error)
      return false
    }
  }

  const ensureLoaded = async () => {
    if (!initialized.value) {
      try { await getCurrentUser() } catch { /* swallow */ }
    }
  }

  const requireAdmin = async () => {
    await ensureLoaded()
    if (!isAdmin.value) throw new Error('Not admin')
    return true
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
  isAdmin,
    initialized: computed(() => initialized.value),
    isLoading: computed(() => isLoading.value),
    login,
    register,
    logout,
    getCurrentUser,
    ensureLoaded,
  requireAdmin,
  }
})