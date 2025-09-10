import { logger } from './logger'

export async function withTiming<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  try {
    return await fn()
  } finally {
    const ms = Math.round(performance.now() - start)
    logger.debug(`[metric] ${label} ${ms}ms`)
  }
}

export function markSSR(label: string) {
  if (process.server) {
    logger.debug(`[ssr] ${label}`)
  }
}
