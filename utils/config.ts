import { useRuntimeConfig } from '#imports'

export interface PublicRuntimeShape {
  appwriteEndpoint?: string
  appwriteProjectId?: string
  appwriteDatabaseId?: string
  adminEmails?: string
  appwrite?: {
    endpoint?: string
    project?: string
    databaseId?: string
  }
}

export function getPublicConfig(): PublicRuntimeShape {
  const cfg = useRuntimeConfig()
  return (cfg.public || {}) as PublicRuntimeShape
}

export function readString(v: unknown, fallback = ''): string {
  return typeof v === 'string' && v.trim().length ? v : fallback
}
