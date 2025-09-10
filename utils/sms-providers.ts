/**
 * SMS провайдеры для Казахстана
 */

export interface SMSProvider {
  name: string
  send(phone: string, message: string): Promise<SMSResponse>
  getBalance?(): Promise<number>
  validatePhone?(phone: string): boolean
}

export interface SMSResponse {
  success: boolean
  messageId?: string
  error?: string
  cost?: number
  status?: "sent" | "delivered" | "failed"
}

export class SMSRuProvider implements SMSProvider {
  name = "SMS.RU"
  private apiKey: string
  private baseUrl = "https://sms.ru/sms"
  constructor(apiKey: string) { this.apiKey = apiKey }
  async send(phone: string, message: string): Promise<SMSResponse> {
    try {
      const formData = new FormData()
      formData.append("api_id", this.apiKey)
      formData.append("to", this.formatPhone(phone))
      formData.append("msg", message)
      formData.append("json", "1")
      formData.append("from", "Dym.kz")
      const response = await fetch(`${this.baseUrl}/send`, { method: "POST", body: formData })
      const data = await response.json()
      if (data.status === "OK") {
        return { success: true, messageId: data.sms?.[phone]?.sms_id, cost: data.sms?.[phone]?.cost, status: "sent" }
      }
      return { success: false, error: this.getErrorMessage(data.status_code) }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      return { success: false, error: `Ошибка отправки SMS: ${msg}` }
    }
  }
  async getBalance(): Promise<number> {
    try {
      const response = await fetch(`https://sms.ru/my/balance?api_id=${this.apiKey}&json=1`)
      const data = await response.json(); return data.balance || 0
    } catch (error) { console.error("Error getting SMS balance:", error); return 0 }
  }
  validatePhone(phone: string): boolean { return /^(\+7|7|8)?[0-9]{10}$/.test(phone.replace(/\s+/g, "")) }
  private formatPhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, ""); if (cleaned.startsWith("8")) cleaned = "7" + cleaned.slice(1)
    if (cleaned.startsWith("77")) return cleaned; if (cleaned.startsWith("7") && cleaned.length === 11) return cleaned; return "7" + cleaned }
  private getErrorMessage(code: number): string {
    const errors: Record<number,string> = {100:"Неверный api_id",101:"Не хватает средств на лицевом счету",102:"Неправильно указан получатель",103:"Нет текста сообщения",104:"Имя отправителя не согласовано с администрацией",105:"Сообщение слишком длинное",106:"Будет превышен или уже превышен дневной лимит на отправку сообщений",107:"На этот номер нельзя отправлять сообщения",108:"Параметр time указан неправильно",109:"Вы добавили этот номер в стоп-лист",110:"Используется GET, где необходимо использовать POST",150:"Ошибка в базе данных",200:"Неправильный api_id",201:"Неправильный login",202:"Неправильный пароль"};
    return errors[code] || `Неизвестная ошибка (код: ${code})` }
}

export class BeelineKZProvider implements SMSProvider {
  name = "Beeline KZ"; private username: string; private password: string; private baseUrl = "https://sms.beeline.kz/api"
  constructor(username: string, password: string) { this.username = username; this.password = password }
  async send(phone: string, message: string): Promise<SMSResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/send`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}` }, body: JSON.stringify({ phone: this.formatPhone(phone), message, sender: "Dym.kz" }) })
      const data = await response.json(); if (data.success) return { success: true, messageId: data.message_id, status: "sent" }
      return { success: false, error: data.error || "Ошибка отправки SMS" }
    } catch (error: unknown) { const msg = error instanceof Error ? error.message : String(error); return { success: false, error: `Ошибка отправки SMS: ${msg}` } }
  }
  validatePhone(phone: string): boolean { return /^(\+7|7|8)?[0-9]{10}$/.test(phone.replace(/\s+/g, "")) }
  private formatPhone(phone: string): string { let cleaned = phone.replace(/\D/g, ""); if (cleaned.startsWith("8")) cleaned = "7" + cleaned.slice(1); return "+" + cleaned }
}

export class TwilioProvider implements SMSProvider {
  name = "Twilio"; private accountSid: string; private authToken: string; private fromNumber: string
  constructor(accountSid: string, authToken: string, fromNumber: string) { this.accountSid = accountSid; this.authToken = authToken; this.fromNumber = fromNumber }
  async send(phone: string, message: string): Promise<SMSResponse> {
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, { method: "POST", headers: { Authorization: `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ From: this.fromNumber, To: this.formatPhone(phone), Body: message }) })
      const data = await response.json(); if (response.ok) return { success: true, messageId: data.sid, status: data.status === "queued" ? "sent" : data.status }
      return { success: false, error: data.message || "Ошибка отправки SMS" }
    } catch (error: unknown) { const msg = error instanceof Error ? error.message : String(error); return { success: false, error: `Ошибка отправки SMS: ${msg}` } }
  }
  validatePhone(phone: string): boolean { return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s+/g, "")) }
  private formatPhone(phone: string): string { let cleaned = phone.replace(/\D/g, ""); if (cleaned.startsWith("8")) cleaned = "7" + cleaned.slice(1); if (!cleaned.startsWith("+")) cleaned = "+" + cleaned; return cleaned }
}

export class SMSProviderFactory { static create(provider: string, config: any): SMSProvider { switch (provider) { case "sms.ru": return new SMSRuProvider(config.apiKey); case "beeline": return new BeelineKZProvider(config.username, config.password); case "twilio": return new TwilioProvider(config.accountSid, config.authToken, config.fromNumber); default: throw new Error(`Неподдерживаемый SMS провайдер: ${provider}`) } } }
