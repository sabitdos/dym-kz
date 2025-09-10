import { defineEventHandler, readBody, createError } from "h3"
import { SMSProviderFactory } from "~/utils/sms-providers"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { provider, config, phone, message } = body

    // Валидация входных данных
    if (!provider || !config || !phone || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: "Отсутствуют обязательные параметры",
      })
    }

    // Создание провайдера
    const smsProvider = SMSProviderFactory.create(provider, config)

    // Отправка SMS
    const result = await smsProvider.send(phone, message)

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      status: result.status,
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as any).message : undefined
    throw createError({
      statusCode: 500,
      statusMessage: message || "Ошибка отправки SMS",
    })
  }
})
