import { NotificationService, type NotificationConfig } from './notification-service'
import { logger } from './logger'

export interface NotificationTemplate {
  id: string
  type: 'sms' | 'email' | 'push'
  status: 'new' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled'
  subject?: string
  message: string
  enabled: boolean
  templateId?: string
}

export interface NotificationHistory {
  id: string
  orderId: string
  type: 'sms' | 'email' | 'push'
  status: string
  recipient: string
  message: string
  sentAt: string
  delivered: boolean
  error?: string | undefined
  messageId?: string | undefined
  provider?: string | undefined
  attempts?: number | undefined
}

export interface NotificationSettings {
  sms: { enabled: boolean; phone: string; statuses: string[] }
  email: { enabled: boolean; address: string; statuses: string[] }
  push: { enabled: boolean; statuses: string[] }
  providers: {
    sms: { primary: string; fallback?: string | undefined; config: any; fallbackConfig?: any }
    email: { primary: string; fallback?: string | undefined; config: any; fallbackConfig?: any }
  }
  retryAttempts: number
  retryDelay: number
}

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'sms_new',
    type: 'sms',
    status: 'new',
    message: 'Заказ №{orderNumber} получен! Мы свяжемся с вами для подтверждения. Dym.kz',
    enabled: true
  },
  {
    id: 'sms_confirmed',
    type: 'sms',
    status: 'confirmed',
    message: 'Заказ №{orderNumber} подтвержден! Готовим ваш кальян. Время доставки: {deliveryTime}. Dym.kz',
    enabled: true
  },
  {
    id: 'sms_delivering',
    type: 'sms',
    status: 'delivering',
    message: 'Курьер в пути! Заказ №{orderNumber} будет доставлен в течение 30 минут. Dym.kz',
    enabled: true
  },
  {
    id: 'sms_completed',
    type: 'sms',
    status: 'completed',
    message: 'Заказ №{orderNumber} доставлен! Спасибо за выбор Dym.kz! Оцените нас: dym.kz/review',
    enabled: true
  },
  {
    id: 'email_new',
    type: 'email',
    status: 'new',
    subject: 'Заказ №{orderNumber} получен - Dym.kz',
    message: `<h2>Спасибо за заказ!</h2><p>Ваш заказ №{orderNumber} успешно получен и передан в обработку.</p>` +
      `<p><strong>Детали заказа:</strong></p><ul><li>Номер заказа: {orderNumber}</li><li>Сумма: {total} ₸</li><li>Адрес доставки: {address}</li></ul>` +
      `<p>Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p><p>С уважением,<br>Команда Dym.kz</p>`,
    enabled: true
  },
  {
    id: 'email_confirmed',
    type: 'email',
    status: 'confirmed',
    subject: 'Заказ №{orderNumber} подтвержден - Dym.kz',
    message: `<h2>Заказ подтвержден!</h2><p>Отличные новости! Ваш заказ №{orderNumber} подтвержден и принят в работу.</p>` +
      `<p><strong>Время доставки:</strong> {deliveryTime}</p><p><strong>Адрес доставки:</strong> {address}</p>` +
      `<p>Мы уже начали готовить ваш кальян. Скоро курьер отправится к вам!</p><p>С уважением,<br>Команда Dym.kz</p>`,
    enabled: true
  }
]

export function buildNotificationServiceConfig(settings: NotificationSettings): NotificationConfig {
  const sms: NotificationConfig['sms'] = {
    enabled: settings.sms.enabled,
    provider: settings.providers.sms.primary,
    config: settings.providers.sms.config
  }
  if (settings.providers.sms.fallback) sms.fallbackProvider = settings.providers.sms.fallback
  if (settings.providers.sms.fallbackConfig) sms.fallbackConfig = settings.providers.sms.fallbackConfig

  const email: NotificationConfig['email'] = {
    enabled: settings.email.enabled,
    provider: settings.providers.email.primary,
    config: settings.providers.email.config
  }
  if (settings.providers.email.fallback) email.fallbackProvider = settings.providers.email.fallback
  if (settings.providers.email.fallbackConfig) email.fallbackConfig = settings.providers.email.fallbackConfig

  return {
    sms,
    email,
    retryAttempts: settings.retryAttempts,
    retryDelay: settings.retryDelay
  }
}

export function createNotificationService(settings: NotificationSettings) {
  const cfg = buildNotificationServiceConfig(settings)
  return new NotificationService(cfg)
}

export function replaceTemplateVariables(template: string, data: any): string {
  return template
    .replace(/{orderNumber}/g, data.orderNumber || '')
    .replace(/{total}/g, data.total?.toLocaleString() || '')
    .replace(/{address}/g, data.address || '')
    .replace(/{deliveryTime}/g, data.deliveryTime || '')
    .replace(/{phone}/g, data.phone || '')
    .replace(/{cancelReason}/g, data.cancelReason || 'Не указана')
    .replace(/{bonusPoints}/g, data.bonusPoints || '0')
    .replace(/{trackingUrl}/g, (typeof window !== 'undefined') ? `${window.location.origin}/orders` : '/orders')
    .replace(/{reviewUrl}/g, (typeof window !== 'undefined') ? `${window.location.origin}/review` : '/review')
}

export function getStatusLabel(status: string): string {
  const labels: Record<string,string> = {
    new: 'Новый заказ',
    confirmed: 'Заказ подтвержден',
    preparing: 'Готовится',
    delivering: 'Доставляется',
    completed: 'Доставлен',
    cancelled: 'Отменен'
  }
  return labels[status] ?? status
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

async function sendBrowserPush(orderId: string, template: NotificationTemplate, orderData: any): Promise<NotificationHistory> {
  const message = replaceTemplateVariables(template.message, orderData)
  const notification: NotificationHistory = {
    id: generateId(),
    orderId,
    type: 'push',
    status: template.status,
    recipient: 'browser',
    message,
    sentAt: new Date().toISOString(),
    delivered: true,
    provider: 'browser'
  }

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(`Dym.kz - ${getStatusLabel(template.status)}`, {
      body: message.replace(/<[^>]*>/g, '').substring(0, 100),
      icon: '/favicon.ico'
    })
  }

  return notification
}

export interface SendParams {
  orderId: string
  status: string
  orderData: any
  recipient?: { phone?: string; email?: string } | undefined
  settings: NotificationSettings
  service: NotificationService
}

export async function prepareAndSendNotifications(params: SendParams): Promise<NotificationHistory[]> {
  const { orderId, status, orderData, recipient, settings, service } = params
  const results: NotificationHistory[] = []

  try {
    // SMS
    if (settings.sms.enabled && settings.sms.statuses.includes(status)) {
      const phone = recipient?.phone || settings.sms.phone
      if (phone) {
        const template = notificationTemplates.find(t => t.type === 'sms' && t.status === status && t.enabled)
        if (template) {
          const message = replaceTemplateVariables(template.message, orderData)
          const result = await service.sendSMS(phone, message)
          results.push({
            id: generateId(),
            orderId,
            type: 'sms',
            status,
            recipient: phone,
            message,
            sentAt: new Date().toISOString(),
            delivered: result.success,
            error: result.error,
            messageId: result.messageId,
            provider: result.provider,
            attempts: result.attempts
          })
        }
      }
    }

    // Email
    if (settings.email.enabled && settings.email.statuses.includes(status)) {
      const email = recipient?.email || settings.email.address
      if (email) {
        const template = notificationTemplates.find(t => t.type === 'email' && t.status === status && t.enabled)
        if (template) {
          const subject = replaceTemplateVariables(template.subject || '', orderData)
            .replace(/<[^>]*>/g, '')
          const html = replaceTemplateVariables(template.message, orderData)
          const text = html.replace(/<[^>]*>/g, '')
          const result = await service.sendEmail(email, subject, html, text)
          results.push({
            id: generateId(),
            orderId,
            type: 'email',
            status,
            recipient: email,
            message: template.message,
            sentAt: new Date().toISOString(),
            delivered: result.success,
            error: result.error,
            messageId: result.messageId,
            provider: result.provider,
            attempts: result.attempts
          })
        }
      }
    }

    // Push
    if (settings.push.enabled && settings.push.statuses.includes(status)) {
      const template = notificationTemplates.find(t => t.type === 'push' && t.status === status && t.enabled)
      if (template) {
        const pushNotification = await sendBrowserPush(orderId, template, orderData)
        results.push(pushNotification)
      }
    }
  } catch (e: unknown) {
    logger.error('[notifications] send error', e)
    throw e
  }

  return results
}
