import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { useRuntimeConfig } from '#imports'
import { logger } from '~/utils/logger'
import {
  notificationTemplates,
  type NotificationHistory,
  type NotificationSettings,
  prepareAndSendNotifications,
  createNotificationService,
  getStatusLabel
} from '~/utils/notifications'

export const useNotificationsStore = defineStore("notifications", () => {
  const config = useRuntimeConfig()

  const settings = ref<NotificationSettings>({
    sms: {
      enabled: true,
      phone: "",
      statuses: ["confirmed", "delivering", "completed"],
    },
    email: {
      enabled: true,
      address: "",
      statuses: ["new", "confirmed", "preparing", "delivering", "completed", "cancelled"],
    },
    push: {
      enabled: true,
      statuses: ["confirmed", "delivering", "completed"],
    },
    providers: {
      sms: {
        primary: "sms.ru",
        fallback: "twilio",
        config: {
          apiKey: config.smsRuApiKey || "",
        },
        fallbackConfig: {
          accountSid: config.twilioAccountSid || "",
          authToken: config.twilioAuthToken || "",
          fromNumber: config.twilioFromNumber || "",
        },
      },
      email: {
        primary: "resend",
        fallback: "sendgrid",
        config: {
          apiKey: config.resendApiKey || "",
          fromEmail: config.public.fromEmail || "noreply@dym.kz",
          fromName: "Dym.kz",
        },
        fallbackConfig: {
          apiKey: config.sendgridApiKey || "",
          fromEmail: config.public.fromEmail || "noreply@dym.kz",
          fromName: "Dym.kz",
        },
      },
    },
    retryAttempts: 3,
    retryDelay: 1000,
  })

  const history = ref<NotificationHistory[]>([])
  const isLoading = ref(false)
  const notificationService = ref<ReturnType<typeof createNotificationService> | null>(null)
  const templates = notificationTemplates

  // Computed
  const smsHistory = computed(() => history.value.filter((n) => n.type === "sms"))
  const emailHistory = computed(() => history.value.filter((n) => n.type === "email"))
  const pushHistory = computed(() => history.value.filter((n) => n.type === "push"))
  const unreadCount = computed(() => history.value.filter((n) => !n.delivered).length)

  // Initialize notification service
  const initializeService = () => {
  notificationService.value = createNotificationService(settings.value)
  }

  // Actions
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    saveSettings()
    initializeService()
  }

  const sendNotification = async (orderId: string, status: string, orderData: any, recipient?: { phone?: string; email?: string }) => {
    if (!notificationService.value) initializeService()
    isLoading.value = true
    try {
      const notifications = await prepareAndSendNotifications({
        orderId,
        status,
        orderData,
        recipient,
        settings: settings.value,
        service: notificationService.value as any
      })
      history.value.unshift(...notifications)
      saveHistory()
      return notifications
    } catch (e: unknown) {
      logger.error('[notifications] send failed', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Push + template helpers moved to utils/notifications

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!process.client || !("Notification" in window)) {
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission === "denied") {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  const clearHistory = () => {
    history.value = []
    saveHistory()
  }

  const markAsRead = (notificationId: string) => {
    const notification = history.value.find((n) => n.id === notificationId)
    if (notification) {
      notification.delivered = true
      saveHistory()
    }
  }

  // Provider info methods
  const getSMSProviderInfo = () => {
    return (
      notificationService.value?.getSMSProviderInfo() || {
        primary: "Не настроен",
        fallback: "Не настроен",
        enabled: false,
      }
    )
  }

  const getEmailProviderInfo = () => {
    return (
      notificationService.value?.getEmailProviderInfo() || {
        primary: "Не настроен",
        fallback: "Не настроен",
        enabled: false,
      }
    )
  }

  const getSMSBalance = async (): Promise<number | null> => {
    if (!notificationService.value) {
      return null
    }
    return await notificationService.value.getSMSBalance()
  }

  // Storage functions
  const saveSettings = () => {
    if (process.client) {
      localStorage.setItem("dym-notification-settings", JSON.stringify(settings.value))
    }
  }

  const loadSettings = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem("dym-notification-settings")
        if (stored) {
          settings.value = { ...settings.value, ...JSON.parse(stored) }
        }
      } catch (error) {
        logger.error('[notifications] load settings failed', error)
      }
    }
  }

  const saveHistory = () => {
    if (process.client) {
      localStorage.setItem("dym-notification-history", JSON.stringify(history.value))
    }
  }

  const loadHistory = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem("dym-notification-history")
        if (stored) {
          history.value = JSON.parse(stored) as NotificationHistory[]
        }
      } catch (error) {
        logger.error('[notifications] load history failed', error)
      }
    }
  }

  // Initialize
  if (process.client) {
    loadSettings()
    loadHistory()
    initializeService()
  }

  return {
    // State
    settings: readonly(settings),
    history: readonly(history),
    isLoading: readonly(isLoading),
    templates,

    // Getters
    smsHistory,
    emailHistory,
    pushHistory,
    unreadCount,

    // Actions
    updateSettings,
    sendNotification,
    requestNotificationPermission,
    clearHistory,
    markAsRead,
    loadSettings,
    loadHistory,
    getStatusLabel,
    getSMSProviderInfo,
    getEmailProviderInfo,
    getSMSBalance,
    initializeService,
  }
})
