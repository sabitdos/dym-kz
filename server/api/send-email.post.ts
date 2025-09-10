import { EmailProviderFactory } from "~/utils/email-providers"
import { defineEventHandler, readBody, createError } from "h3"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { provider, config, to, subject, html, text } = body

    // Валидация входных данных
    if (!provider || !config || !to || !subject || !html) {
      throw createError({
        statusCode: 400,
        statusMessage: "Отсутствуют обязательные параметры",
      })
    }

    // Создание провайдера
    const emailProvider = EmailProviderFactory.create(provider, config)

    // Отправка Email
    const result = await emailProvider.send(to, subject, html, text)

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
      statusMessage: message || "Ошибка отправки Email",
    })
  }
})
