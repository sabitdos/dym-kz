import { useNuxtApp, useRuntimeConfig } from "#imports"
import { Client, Account, Databases } from 'appwrite'

export const useAppwrite = () => {
  const { $appwrite } = useNuxtApp()

  if ($appwrite) return $appwrite as any

  // Fallback for SSR or when plugin not yet initialized
  const cfg: any = useRuntimeConfig().public
  const endpoint = String(cfg.appwriteEndpoint || cfg.appwrite?.endpoint || '')
  const project = String(cfg.appwriteProjectId || cfg.appwrite?.project || '')
  if (process.client && !(window as any).__APPWRITE_COMPOSABLE_LOGGED__) {
    console.debug('[Appwrite] composable init', { endpoint, project })
    ;(window as any).__APPWRITE_COMPOSABLE_LOGGED__ = true
  }
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
  const account = new Account(client)
  const databases = new Databases(client)
  return { client, account, databases }
}
