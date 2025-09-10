import { logger } from '~/utils/logger'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // Global Vue error handler
  if (process.client) {
    window.addEventListener('error', (event) => {
      logger.error('[global-error] uncaught', event.error || event.message)
    })

    window.addEventListener('unhandledrejection', (event) => {
      logger.error('[global-error] unhandled promise rejection', event.reason)
    })
  }
})
