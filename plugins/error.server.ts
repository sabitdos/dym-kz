import { logger } from '~/utils/logger'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('app:error', (err) => {
    logger.error('[server-error] app:error', err)
  })

  process.on('unhandledRejection', (reason) => {
    logger.error('[server-error] unhandledRejection', reason)
  })

  process.on('uncaughtException', (err) => {
    logger.error('[server-error] uncaughtException', err)
  })
})
