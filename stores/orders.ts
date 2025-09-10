import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Databases, Query, type Models } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'
import { useAsyncResource } from '~/composables/useAsyncResource'
import type { Order } from '~/types/appwrite'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<(Models.Document & Order)[]>([])
  const resource = useAsyncResource<(Models.Document & Order)[]>(async () => {
    const client = useAppwriteClient()
    const db = new Databases(client)
    const dbId = getDatabaseId()
    const cols = getCollections()
    const res = await db.listDocuments(dbId, cols.ORDERS || 'orders', [Query.limit(100)]) as Models.DocumentList<Models.Document & Order>
    return res.documents as (Models.Document & Order)[]
  })

  async function fetchAll() {
    if (resource.loaded.value || resource.loading.value) return
    const list = await resource.load()
    if (list) orders.value = list
  }

  return { orders, loading: resource.loading, loaded: resource.loaded, error: resource.error, fetchAll, reload: async () => { resource.reset(); orders.value = []; await fetchAll() } }
})
