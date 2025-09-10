type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerOptions {
  prefix?: string
  enabled?: boolean
  level?: LogLevel
}

const levelPriority: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 }

export function createLogger(opts: LoggerOptions = {}) {
  const prefix = opts.prefix ? `[${opts.prefix}]` : ''
  const enabled = opts.enabled !== false
  const minLevel = opts.level || 'debug'

  function should(level: LogLevel) {
    return enabled && levelPriority[level] >= levelPriority[minLevel]
  }

  function fmt(args: any[]) {
    return prefix ? [prefix, ...args] : args
  }

  return {
    debug: (...a: any[]) => { if (should('debug')) console.debug(...fmt(a)) },
    info: (...a: any[]) => { if (should('info')) console.info(...fmt(a)) },
    warn: (...a: any[]) => { if (should('warn')) console.warn(...fmt(a)) },
    error: (...a: any[]) => { if (should('error')) console.error(...fmt(a)) },
  }
}

export const logger = createLogger({ prefix: 'app', level: 'debug' })
