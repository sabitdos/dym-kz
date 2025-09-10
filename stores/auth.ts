import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Models } from 'appwrite'
import { useAppwrite } from '~/composables/useAppwrite'
import { getDatabaseId, getCollections } from '~/utils/appwrite'
import { getPublicConfig } from '~/utils/config'
import type { UserProfile } from '~/types/appwrite'
import { logger } from '~/utils/logger'

export const useAuthStore = defineStore('auth', () => {
  const { databases, account } = useAppwrite()
  const pub = getPublicConfig()

  type AccountUser = Models.User<Models.Preferences>
  const user = ref<(AccountUser & Partial<UserProfile>) | null>(null)
  const isLoading = ref(false)
  const initialized = ref(false)
  const isAuthenticated = computed(() => !!user.value)

  const adminEmails = (pub.adminEmails ? String(pub.adminEmails) : '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)

  const isAdmin = computed(() => {
    const u: any = user.value
    if (!u) return false
    if (u.role === 'admin' || u.isAdmin === true) return true
    if (u.prefs && (u.prefs.role === 'admin' || u.prefs.isAdmin === true)) return true
    if (u.email && adminEmails.includes(String(u.email).toLowerCase())) return true
    return false
  })

  const assignUser = (val: any) => {
    user.value = val as any
  }

  const getCurrentUser = async () => {
    if (isLoading.value) return
    try {
      isLoading.value = true
      const accountData = await account.get()
      const dbId = getDatabaseId()
      const cols = getCollections()
      try {
        const userData = await databases.getDocument(dbId, cols.USERS, accountData.$id)
        assignUser(userData)
      } catch {
        assignUser(accountData)
      }
      if (process.client) {
        logger.debug('loaded user', {
          id: user.value?.$id,
            email: user.value?.email,
          admin: isAdmin.value
        })
        if (!adminEmails.length) logger.warn('adminEmails not configured in runtime config')
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
        if (user.value?.email?.toLowerCase() === email.toLowerCase()) return true
        try { await account.deleteSession('current') } catch {}
      } else {
        try {
          await getCurrentUser()
          if (isAuthenticated.value && user.value?.email?.toLowerCase() === email.toLowerCase()) return true
        } catch {}
      }

      const acc: any = account as any
      const createSession = async () => {
        if (typeof acc.createEmailPasswordSession === 'function') return acc.createEmailPasswordSession({ email, password })
        if (typeof acc.createEmailSession === 'function') return acc.createEmailSession(email, password)
        if (typeof acc.createSession === 'function') return acc.createSession(email, password)
        throw new Error('No compatible Appwrite session creation method found.')
      }

      try { await createSession() } catch (e: any) {
        const msg = String(e?.message || '').toLowerCase()
        if (msg.includes('session is active') || msg.includes('already') || e?.code === 409) {
          // continue
        } else if (e?.code === 401) {
          logger.warn('login invalid credentials')
          return false
        } else {
          logger.error('login error (create session)', e)
          return false
        }
      }

      await getCurrentUser()
      return !!isAuthenticated.value
    } catch (err) {
      logger.error('login error (outer)', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      isLoading.value = true
      await account.create('unique()', email, password, name)
      return await login(email, password)
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession('current')
      user.value = null
      initialized.value = true
      return true
    } catch (error) {
      logger.error('logout error', error)
      return false
    }
  }

  const ensureLoaded = async () => {
    if (!initialized.value) {
      try { await getCurrentUser() } catch {}
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
    requireAdmin
  }
})