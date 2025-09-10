import { Client, Databases, Account } from 'appwrite'
import { tryUseNuxtApp, useRuntimeConfig } from '#imports'

export const useAppwriteClient = () => {
  const nuxtApp = tryUseNuxtApp()
  if (nuxtApp?.$appwriteClient) return nuxtApp.$appwriteClient as Client
  const config = useRuntimeConfig()
  const endpoint = String((config.public as any).appwriteEndpoint || (config.public as any).appwrite?.endpoint || '')
  const project = String((config.public as any).appwriteProjectId || (config.public as any).appwriteProject || (config.public as any).appwrite?.project || '')
  return new Client().setEndpoint(endpoint).setProject(project)
}

export const useAppwriteDatabases = () => {
  const nuxtApp = tryUseNuxtApp()
  if (nuxtApp?.$appwriteDatabases) return nuxtApp.$appwriteDatabases as Databases
  return new Databases(useAppwriteClient())
}

export const useAppwriteAccount = () => {
  const nuxtApp = tryUseNuxtApp()
  if (nuxtApp?.$appwriteAccount) return nuxtApp.$appwriteAccount as Account
  return new Account(useAppwriteClient())
}

export const getDatabaseId = (): string => {
  const cfg = useRuntimeConfig()
  return String((cfg.public as any).appwriteDatabaseId || 'main')
}

export const getCollections = () => {
  const pub: any = useRuntimeConfig().public
  return {
    HOOKAHS: String(pub.appwriteCollections?.hookahs || 'hookahs'),
    TOBACCOS: String(pub.appwriteCollections?.tobacco || 'tobaccos'),
    COALS: String(pub.appwriteCollections?.coals || 'coals'),
    ORDERS: String(pub.appwriteCollections?.orders || 'orders'),
    USERS: String(pub.appwriteCollections?.users || 'users'),
    MASTERS: String(pub.appwriteCollections?.masters || 'masters'),
    MASTER_REVIEWS: String(pub.appwriteCollections?.masterReviews || 'master_reviews'),
  BOOKINGS: String(pub.appwriteCollections?.bookings || 'master_bookings'),
  }
}

export const getBuckets = () => {
  const pub: any = useRuntimeConfig().public
  return { DATA: String(pub.appwriteBuckets?.data || '') }
}
