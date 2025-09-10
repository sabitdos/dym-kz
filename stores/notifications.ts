import { defineStore } from "pinia"
import { ref, computed, readonly } from "vue"
import { NotificationService, type NotificationConfig } from "~/utils/notification-service"
import { useRuntimeConfig } from "#imports"

export interface NotificationTemplate {
  id: string
  type: "sms" | "email" | "push"
  status: "new" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled"
  subject?: string
  message: string
  enabled: boolean
  templateId?: string
}

export interface NotificationHistory {
  id: string
  orderId: string
  type: "sms" | "email" | "push"
  status: string
  recipient: string
  message: string
  sentAt: string
  delivered: boolean
  error?: string
  messageId?: string
  provider?: string
  attempts?: number
}

export interface NotificationSettings {
  sms: {
    enabled: boolean
    phone: string
    statuses: string[]
  }
  email: {
    enabled: boolean
    address: string
    statuses: string[]
  }
  push: {
    enabled: boolean
    statuses: string[]
  }
  providers: {
    sms: {
      primary: string
      fallback?: string
      config: any
      fallbackConfig?: any
    }
    email: {
      primary: string
      fallback?: string
      config: any
      fallbackConfig?: any
    }
  }
  retryAttempts: number
  retryDelay: number
}

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
  const notificationService = ref<NotificationService | null>(null)

  // Templates
  const templates: NotificationTemplate[] = [
    {
      id: "sms_new",
      type: "sms",
      status: "new",
      message: "Заказ №{orderNumber} получен! Мы свяжемся с вами для подтверждения. Dym.kz",
      enabled: true,
    },
    {
      id: "sms_confirmed",
      type: "sms",
      status: "confirmed",
      message: "Заказ №{orderNumber} подтвержден! Готовим ваш кальян. Время доставки: {deliveryTime}. Dym.kz",
      enabled: true,
    },
    {
      id: "sms_delivering",
      type: "sms",
      status: "delivering",
      message: "Курьер в пути! Заказ №{orderNumber} будет доставлен в течение 30 минут. Dym.kz",
      enabled: true,
    },
    {
      id: "sms_completed",
      type: "sms",
      status: "completed",
      message: "Заказ №{orderNumber} доставлен! Спасибо за выбор Dym.kz! Оцените нас: dym.kz/review",
      enabled: true,
    },
    {
      id: "email_new",
      type: "email",
      status: "new",
      subject: "Заказ №{orderNumber} получен - Dym.kz",
      message: `
        <h2>Спасибо за заказ!</h2>
        <p>Ваш заказ №{orderNumber} успешно получен и передан в обработку.</p>
        <p><strong>Детали заказа:</strong></p>
        <ul>
          <li>Номер заказа: {orderNumber}</li>
          <li>Сумма: {total} ₸</li>
          <li>Адрес доставки: {address}</li>
        </ul>
        <p>Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
        <p>С уважением,<br>Команда Dym.kz</p>
      `,
      enabled: true,
    },
    {
      id: "email_confirmed",
      type: "email",
      status: "confirmed",
      subject: "Заказ №{orderNumber} подтвержден - Dym.kz",
      message: `
        <h2>Заказ подтвержден!</h2>
        <p>Отличные новости! Ваш заказ №{orderNumber} подтвержден и принят в работу.</p>
        <p><strong>Время доставки:</strong> {deliveryTime}</p>
        <p><strong>Адрес доставки:</strong> {address}</p>
        <p>Мы уже начали готовить ваш кальян. Скоро курьер отправится к вам!</p>
        <p>С уважением,<br>Команда Dym.kz</p>
      `,
      enabled: true,
    },
  ]

  // Computed
  const smsHistory = computed(() => history.value.filter((n) => n.type === "sms"))
  const emailHistory = computed(() => history.value.filter((n) => n.type === "email"))
  const pushHistory = computed(() => history.value.filter((n) => n.type === "push"))
  const unreadCount = computed(() => history.value.filter((n) => !n.delivered).length)

  // Initialize notification service
  const initializeService = () => {
    const serviceConfig: NotificationConfig = {
      sms: {
        enabled: settings.value.sms.enabled,
        provider: settings.value.providers.sms.primary,
        config: settings.value.providers.sms.config,
        fallbackProvider: settings.value.providers.sms.fallback,
        fallbackConfig: settings.value.providers.sms.fallbackConfig,
      },
      email: {
        enabled: settings.value.email.enabled,
        provider: settings.value.providers.email.primary,
        config: settings.value.providers.email.config,
        fallbackProvider: settings.value.providers.email.fallback,
        fallbackConfig: settings.value.providers.email.fallbackConfig,
      },
      retryAttempts: settings.value.retryAttempts,
      retryDelay: settings.value.retryDelay,
    }

    notificationService.value = new NotificationService(serviceConfig)
  }

  // Actions
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    saveSettings()
    initializeService()
  }

  const sendNotification = async (
    orderId: string,
    status: string,
    orderData: any,
    recipient?: { phone?: string; email?: string },
  ) => {
    if (!notificationService.value) {
      initializeService()
    }

    isLoading.value = true

    try {
      const notifications: NotificationHistory[] = []

      // SMS Notification
      if (settings.value.sms.enabled && settings.value.sms.statuses.includes(status)) {
        const phone = recipient?.phone || settings.value.sms.phone
        if (phone) {
          const template = templates.find((t) => t.type === "sms" && t.status === status && t.enabled)
          if (template) {
            const message = replaceTemplateVariables(template.message, orderData)
            const result = await notificationService.value!.sendSMS(phone, message)

            notifications.push({
              id: generateId(),
              orderId,
              type: "sms",
              status,
              recipient: phone,
              message,
              sentAt: new Date().toISOString(),
              delivered: result.success,
              error: result.error,
              messageId: result.messageId,
              provider: result.provider,
              attempts: result.attempts,
            })
          }
        }
      }

      // Email Notification
      if (settings.value.email.enabled && settings.value.email.statuses.includes(status)) {
        const email = recipient?.email || settings.value.email.address
        if (email) {
          const template = templates.find((t) => t.type === "email" && t.status === status && t.enabled)
          if (template) {
            const subject = replaceTemplateVariables(template.subject || "", orderData)
            const html = replaceTemplateVariables(template.message, orderData)
            const text = html.replace(/<[^>]*>/g, "")

            const result = await notificationService.value!.sendEmail(email, subject, html, text)

            notifications.push({
              id: generateId(),
              orderId,
              type: "email",
              status,
              recipient: email,
              message: template.message,
              sentAt: new Date().toISOString(),
              delivered: result.success,
              error: result.error,
              messageId: result.messageId,
              provider: result.provider,
              attempts: result.attempts,
            })
          }
        }
      }

      // Push Notification
      if (settings.value.push.enabled && settings.value.push.statuses.includes(status)) {
        const template = templates.find((t) => t.type === "push" && t.status === status)
        if (template) {
          const notification = await sendPushNotification(orderId, template, orderData)
          notifications.push(notification)
        }
      }

      // Add to history
      history.value.unshift(...notifications)
      saveHistory()

      return notifications
    } catch (error) {
      console.error("Error sending notifications:", error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const sendPushNotification = async (
    orderId: string,
    template: NotificationTemplate,
    orderData: any,
  ): Promise<NotificationHistory> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const message = replaceTemplateVariables(template.message, orderData)

    const notification: NotificationHistory = {
      id: generateId(),
      orderId,
      type: "push",
      status: template.status,
      recipient: "browser",
      message,
      sentAt: new Date().toISOString(),
      delivered: true,
      provider: "browser",
    }

    // Show browser notification if supported
    if (process.client && "Notification" in window && Notification.permission === "granted") {
      new Notification(`Dym.kz - ${getStatusLabel(template.status)}`, {
        body: message.replace(/<[^>]*>/g, "").substring(0, 100),
        icon: "/favicon.ico",
      })
    }

    return notification
  }

  const replaceTemplateVariables = (template: string, data: any): string => {
    return template
      .replace(/{orderNumber}/g, data.orderNumber || "")
      .replace(/{total}/g, data.total?.toLocaleString() || "")
      .replace(/{address}/g, data.address || "")
      .replace(/{deliveryTime}/g, data.deliveryTime || "")
      .replace(/{phone}/g, data.phone || "")
      .replace(/{cancelReason}/g, data.cancelReason || "Не указана")
      .replace(/{bonusPoints}/g, data.bonusPoints || "0")
      .replace(/{trackingUrl}/g, process.client ? `${window.location.origin}/orders` : "/orders")
      .replace(/{reviewUrl}/g, process.client ? `${window.location.origin}/review` : "/review")
  }

  const getStatusLabel = (status: string): string => {
    const labels: Record<string,string> = {
      new: "Новый заказ",
      confirmed: "Заказ подтвержден",
      preparing: "Готовится",
      delivering: "Доставляется",
      completed: "Доставлен",
      cancelled: "Отменен",
    }
    return labels[status] ?? status
  }

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
        console.error("Error loading notification settings:", error)
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
          history.value = JSON.parse(stored)
        }
      } catch (error) {
        console.error("Error loading notification history:", error)
      }
    }
  }

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
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
