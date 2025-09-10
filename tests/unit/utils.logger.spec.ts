import { describe, it, expect } from 'vitest'
import { createLogger } from '~/utils/logger'

describe('logger', () => {
  it('respects level filtering', () => {
    const calls: any[] = []
    const original = console.debug
    ;(console as any).debug = (...a: any[]) => calls.push(a)
    const logger = createLogger({ prefix: 't', level: 'info' })
    logger.debug('hidden')
    logger.info('shown')
    ;(console as any).debug = original
    expect(calls.length).toBe(0)
  })
})
