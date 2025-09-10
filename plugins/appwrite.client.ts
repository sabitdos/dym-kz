import { defineNuxtPlugin, useRuntimeConfig } from "#imports"
import { Client, Account, Databases } from 'appwrite'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const endpoint = (runtimeConfig.public as any).appwriteEndpoint
  const project = (runtimeConfig.public as any).appwriteProjectId

  if (process.client && !(window as any).__APPWRITE_LOGGED__) {
    console.debug('[Appwrite] init', { endpoint, project })
    ;(window as any).__APPWRITE_LOGGED__ = true
  }

  const client = new Client().setEndpoint(String(endpoint)).setProject(String(project))
  const account = new Account(client)
  const databases = new Databases(client)

  return {
    provide: {
      appwrite: {
        client,
        account,
        databases
      },
    },
  }
})
