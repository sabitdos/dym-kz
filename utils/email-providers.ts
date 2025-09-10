/**
 * Email провайдеры для отправки уведомлений
 */

export interface EmailProvider {
  name: string
  send(to: string, subject: string, html: string, text?: string): Promise<EmailResponse>
  sendTemplate?(templateId: string, to: string, variables: any): Promise<EmailResponse>
}

export interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
  status?: "sent" | "delivered" | "failed" | "bounced"
}

// SendGrid провайдер
export class SendGridProvider implements EmailProvider {
  name = "SendGrid"
  private apiKey: string
  private fromEmail: string
  private fromName: string

  constructor(apiKey: string, fromEmail: string, fromName = "Dym.kz") {
    this.apiKey = apiKey
    this.fromEmail = fromEmail
    this.fromName = fromName
  }

  async send(to: string, subject: string, html: string, text?: string): Promise<EmailResponse> {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
              subject: subject,
            },
          ],
          from: {
            email: this.fromEmail,
            name: this.fromName,
          },
          content: [
            {
              type: "text/html",
              value: html,
            },
            ...(text
              ? [
                  {
                    type: "text/plain",
                    value: text,
                  },
                ]
              : []),
          ],
        }),
      })

      if (response.ok) {
        const messageId = response.headers.get("X-Message-Id")
        return {
          success: true,
          messageId: messageId || undefined,
          status: "sent",
        }
      } else {
        const error = await response.json()
        return {
          success: false,
          error: error.errors?.[0]?.message || "Ошибка отправки email",
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        error: `Ошибка отправки email: ${msg}`,
      }
    }
  }

  async sendTemplate(templateId: string, to: string, variables: any): Promise<EmailResponse> {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
              dynamic_template_data: variables,
            },
          ],
          from: {
            email: this.fromEmail,
            name: this.fromName,
          },
          template_id: templateId,
        }),
      })

      if (response.ok) {
        const messageId = response.headers.get("X-Message-Id")
        return {
          success: true,
          messageId: messageId || undefined,
          status: "sent",
        }
      } else {
        const error = await response.json()
        return {
          success: false,
          error: error.errors?.[0]?.message || "Ошибка отправки email",
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        error: `Ошибка отправки email: ${msg}`,
      }
    }
  }
}

// Mailgun провайдер
export class MailgunProvider implements EmailProvider {
  name = "Mailgun"
  private apiKey: string
  private domain: string
  private fromEmail: string
  private fromName: string

  constructor(apiKey: string, domain: string, fromEmail: string, fromName = "Dym.kz") {
    this.apiKey = apiKey
    this.domain = domain
    this.fromEmail = fromEmail
    this.fromName = fromName
  }

  async send(to: string, subject: string, html: string, text?: string): Promise<EmailResponse> {
    try {
      const formData = new FormData()
      formData.append("from", `${this.fromName} <${this.fromEmail}>`)
      formData.append("to", to)
      formData.append("subject", subject)
      formData.append("html", html)
      if (text) {
        formData.append("text", text)
      }

      const response = await fetch(`https://api.mailgun.net/v3/${this.domain}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${this.apiKey}`)}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          messageId: data.id,
          status: "sent",
        }
      } else {
        return {
          success: false,
          error: data.message || "Ошибка отправки email",
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        error: `Ошибка отправки email: ${msg}`,
      }
    }
  }
}

// Resend провайдер (современный и простой)
export class ResendProvider implements EmailProvider {
  name = "Resend"
  private apiKey: string
  private fromEmail: string
  private fromName: string

  constructor(apiKey: string, fromEmail: string, fromName = "Dym.kz") {
    this.apiKey = apiKey
    this.fromEmail = fromEmail
    this.fromName = fromName
  }

  async send(to: string, subject: string, html: string, text?: string): Promise<EmailResponse> {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: [to],
          subject: subject,
          html: html,
          ...(text && { text }),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          messageId: data.id,
          status: "sent",
        }
      } else {
        return {
          success: false,
          error: data.message || "Ошибка отправки email",
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        error: `Ошибка отправки email: ${msg}`,
      }
    }
  }
}

// SMTP провайдер (универсальный)
export class SMTPProvider implements EmailProvider {
  name = "SMTP"
  private config: {
    host: string
    port: number
    secure: boolean
    username: string
    password: string
    fromEmail: string
    fromName: string
  }

  constructor(config: any) {
    this.config = config
  }

  async send(to: string, subject: string, html: string, text?: string): Promise<EmailResponse> {
    try {
      // В реальном приложении здесь будет использоваться nodemailer или аналогичная библиотека
      // Для демонстрации используем fetch к вашему серверному API
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "smtp",
          config: this.config,
          to,
          subject,
          html,
          text,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          messageId: data.messageId,
          status: "sent",
        }
      } else {
        return {
          success: false,
          error: data.error || "Ошибка отправки email",
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        error: `Ошибка отправки email: ${msg}`,
      }
    }
  }
}

// Фабрика для создания Email провайдеров
export class EmailProviderFactory {
  static create(provider: string, config: any): EmailProvider {
    switch (provider) {
      case "sendgrid":
        return new SendGridProvider(config.apiKey, config.fromEmail, config.fromName)
      case "mailgun":
        return new MailgunProvider(config.apiKey, config.domain, config.fromEmail, config.fromName)
      case "resend":
        return new ResendProvider(config.apiKey, config.fromEmail, config.fromName)
      case "smtp":
        return new SMTPProvider(config)
      default:
        throw new Error(`Неподдерживаемый Email провайдер: ${provider}`)
    }
  }
}
