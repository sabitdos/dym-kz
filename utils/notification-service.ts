import { SMSProviderFactory, type SMSProvider } from "./sms-providers"
import { EmailProviderFactory, type EmailProvider } from "./email-providers"

export interface NotificationConfig {
  sms: {
    enabled: boolean
    provider: string
    config: any
    fallbackProvider?: string
    fallbackConfig?: any
  }
  email: {
    enabled: boolean
    provider: string
    config: any
    fallbackProvider?: string
    fallbackConfig?: any
  }
  retryAttempts: number
  retryDelay: number
}

export interface NotificationResult {
  type: "sms" | "email"
  success: boolean
  messageId?: string
  error?: string
  attempts: number
  provider: string
}

export class NotificationService {
  private config: NotificationConfig
  private smsProvider?: SMSProvider
  private emailProvider?: EmailProvider
  private smsFallbackProvider?: SMSProvider
  private emailFallbackProvider?: EmailProvider

  constructor(config: NotificationConfig) {
    this.config = config
    this.initializeProviders()
  }

  private initializeProviders() {
    try {
      // Инициализация SMS провайдеров
      if (this.config.sms.enabled) {
        this.smsProvider = SMSProviderFactory.create(this.config.sms.provider, this.config.sms.config)

        if (this.config.sms.fallbackProvider) {
          this.smsFallbackProvider = SMSProviderFactory.create(
            this.config.sms.fallbackProvider,
            this.config.sms.fallbackConfig,
          )
        }
      }

      // Инициализация Email провайдеров
      if (this.config.email.enabled) {
        this.emailProvider = EmailProviderFactory.create(this.config.email.provider, this.config.email.config)

        if (this.config.email.fallbackProvider) {
          this.emailFallbackProvider = EmailProviderFactory.create(
            this.config.email.fallbackProvider,
            this.config.email.fallbackConfig,
          )
        }
      }
    } catch (error) {
      console.error("Error initializing notification providers:", error)
    }
  }

  // Унифицированное извлечение сообщения об ошибке из unknown
  private getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message
    try {
      return typeof err === "string" ? err : JSON.stringify(err)
    } catch {
      return "Unknown error"
    }
  }

  async sendSMS(phone: string, message: string): Promise<NotificationResult> {
    if (!this.config.sms.enabled || !this.smsProvider) {
      return {
        type: "sms",
        success: false,
        error: "SMS отправка отключена или провайдер не настроен",
        attempts: 0,
        provider: "none",
      }
    }

    // Валидация номера телефона
    if (!this.smsProvider.validatePhone?.(phone)) {
      return {
        type: "sms",
        success: false,
        error: "Неверный формат номера телефона",
        attempts: 0,
        provider: this.smsProvider.name,
      }
    }

    let attempts = 0
    let lastError = ""

    // Попытка отправки через основной провайдер
    for (let i = 0; i < this.config.retryAttempts; i++) {
      attempts++

      try {
        const result = await this.smsProvider.send(phone, message)

        if (result.success) {
          return {
            type: "sms",
            success: true,
            messageId: result.messageId,
            attempts,
            provider: this.smsProvider.name,
          }
        }

        lastError = result.error || "Неизвестная ошибка"

        // Если это не последняя попытка, ждем перед повтором
        if (i < this.config.retryAttempts - 1) {
          await this.delay(this.config.retryDelay * (i + 1))
        }
      } catch (error: unknown) {
        lastError = this.getErrorMessage(error)
        if (i < this.config.retryAttempts - 1) {
          await this.delay(this.config.retryDelay * (i + 1))
        }
      }
    }

    // Попытка отправки через резервный провайдер
    if (this.smsFallbackProvider) {
      try {
        const result = await this.smsFallbackProvider.send(phone, message)
        attempts++

        if (result.success) {
          return {
            type: "sms",
            success: true,
            messageId: result.messageId,
            attempts,
            provider: this.smsFallbackProvider.name + " (fallback)",
          }
        }
      } catch (error: unknown) {
        lastError = this.getErrorMessage(error)
      }
    }

    return {
      type: "sms",
      success: false,
      error: lastError,
      attempts,
      provider: this.smsProvider.name,
    }
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<NotificationResult> {
    if (!this.config.email.enabled || !this.emailProvider) {
      return {
        type: "email",
        success: false,
        error: "Email отправка отключена или провайдер не настроен",
        attempts: 0,
        provider: "none",
      }
    }

    // Валидация email адреса
    if (!this.validateEmail(to)) {
      return {
        type: "email",
        success: false,
        error: "Неверный формат email адреса",
        attempts: 0,
        provider: this.emailProvider.name,
      }
    }

    let attempts = 0
    let lastError = ""

    // Попытка отправки через основной провайдер
    for (let i = 0; i < this.config.retryAttempts; i++) {
      attempts++

      try {
        const result = await this.emailProvider.send(to, subject, html, text)

        if (result.success) {
          return {
            type: "email",
            success: true,
            messageId: result.messageId,
            attempts,
            provider: this.emailProvider.name,
          }
        }

        lastError = result.error || "Неизвестная ошибка"

        // Если это не последняя попытка, ждем перед повтором
        if (i < this.config.retryAttempts - 1) {
          await this.delay(this.config.retryDelay * (i + 1))
        }
      } catch (error: unknown) {
        lastError = this.getErrorMessage(error)
        if (i < this.config.retryAttempts - 1) {
          await this.delay(this.config.retryDelay * (i + 1))
        }
      }
    }

    // Попытка отправки через резервный провайдер
    if (this.emailFallbackProvider) {
      try {
        const result = await this.emailFallbackProvider.send(to, subject, html, text)
        attempts++

        if (result.success) {
          return {
            type: "email",
            success: true,
            messageId: result.messageId,
            attempts,
            provider: this.emailFallbackProvider.name + " (fallback)",
          }
        }
      } catch (error: unknown) {
        lastError = this.getErrorMessage(error)
      }
    }

    return {
      type: "email",
      success: false,
      error: lastError,
      attempts,
      provider: this.emailProvider.name,
    }
  }

  async sendEmailTemplate(templateId: string, to: string, variables: any): Promise<NotificationResult> {
    if (!this.config.email.enabled || !this.emailProvider) {
      return {
        type: "email",
        success: false,
        error: "Email отправка отключена или провайдер не настроен",
        attempts: 0,
        provider: "none",
      }
    }

    if (!this.emailProvider.sendTemplate) {
      return {
        type: "email",
        success: false,
        error: "Провайдер не поддерживает отправку шаблонов",
        attempts: 0,
        provider: this.emailProvider.name,
      }
    }

    let attempts = 0
    let lastError = ""

    for (let i = 0; i < this.config.retryAttempts; i++) {
      attempts++

      try {
        const result = await this.emailProvider.sendTemplate(templateId, to, variables)

        if (result.success) {
          return {
            type: "email",
            success: true,
            messageId: result.messageId,
            attempts,
            provider: this.emailProvider.name,
          }
        }

        lastError = result.error || "Неизвестная ошибка"

        if (i < this.config.retryAttempts - 1) {
          await this.delay(this.config.retryDelay * (i + 1))
        }
      } catch (error: unknown) {
        lastError = this.getErrorMessage(error)
        if (i < this.config.retryAttempts - 1) {
          await this.delay(this.config.retryDelay * (i + 1))
        }
      }
    }

    return {
      type: "email",
      success: false,
      error: lastError,
      attempts,
      provider: this.emailProvider.name,
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Методы для получения информации о провайдерах
  getSMSProviderInfo() {
    return {
      primary: this.smsProvider?.name || "Не настроен",
      fallback: this.smsFallbackProvider?.name || "Не настроен",
      enabled: this.config.sms.enabled,
    }
  }

  getEmailProviderInfo() {
    return {
      primary: this.emailProvider?.name || "Не настроен",
      fallback: this.emailFallbackProvider?.name || "Не настроен",
      enabled: this.config.email.enabled,
    }
  }

  // Метод для проверки баланса SMS (если поддерживается провайдером)
  async getSMSBalance(): Promise<number | null> {
    if (!this.smsProvider?.getBalance) {
      return null
    }

    try {
      return await this.smsProvider.getBalance()
    } catch (error: unknown) {
      console.error("Error getting SMS balance:", this.getErrorMessage(error))
      return null
    }
  }

  // Обновление конфигурации
  updateConfig(newConfig: Partial<NotificationConfig>) {
    this.config = { ...this.config, ...newConfig }
    this.initializeProviders()
  }
}
