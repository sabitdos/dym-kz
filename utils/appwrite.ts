import { Client, Databases, Account } from 'appwrite'
import { tryUseNuxtApp } from '#imports'
import { getPublicConfig, readString } from '~/utils/config'
import type { CollectionsIds } from '~/types/appwrite'

export const useAppwriteClient = () => {
  const nuxtApp = tryUseNuxtApp()
  if (nuxtApp?.$appwriteClient) return nuxtApp.$appwriteClient as Client
  const pub = getPublicConfig()
  const endpoint = readString(pub.appwriteEndpoint || pub.appwrite?.endpoint)
  const project = readString(pub.appwriteProjectId || pub.appwrite?.project)
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
  const pub = getPublicConfig()
  return readString(pub.appwriteDatabaseId, 'main')
}

export const getCollections = (): CollectionsIds => {
  const pub: any = getPublicConfig() as any
  const c = pub.appwriteCollections || {}
  return {
    HOOKAHS: readString(c.hookahs, 'hookahs'),
    TOBACCOS: readString(c.tobacco, 'tobaccos'),
    COALS: readString(c.coals, 'coals'),
    ORDERS: readString(c.orders, 'orders'),
    USERS: readString(c.users, 'users'),
    MASTERS: readString(c.masters, 'masters'),
    MASTER_REVIEWS: readString(c.masterReviews, 'master_reviews'),
    BOOKINGS: readString(c.bookings, 'master_bookings'),
  }
}

export const getBuckets = () => {
  const pub: any = getPublicConfig() as any
  return { DATA: readString(pub.appwriteBuckets?.data) }
}
