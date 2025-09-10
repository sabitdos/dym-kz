import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Databases, Query, type Models } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'
import { useAsyncResource } from '~/composables/useAsyncResource'
import type { UserProfile } from '~/types/appwrite'

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<(Models.Document & UserProfile)[]>([])
  const resource = useAsyncResource<(Models.Document & UserProfile)[]>(async () => {
    const client = useAppwriteClient()
    const db = new Databases(client)
    const dbId = getDatabaseId()
    const cols = getCollections()
    const res = await db.listDocuments(dbId, cols.USERS || 'users', [Query.limit(200)]) as Models.DocumentList<Models.Document & UserProfile>
    return res.documents as (Models.Document & UserProfile)[]
  })

  async function fetchAll() {
    if (resource.loaded.value || resource.loading.value) return
    const list = await resource.load()
    if (list) customers.value = list
  }

  return { customers, loading: resource.loading, loaded: resource.loaded, error: resource.error, fetchAll, reload: async () => { resource.reset(); customers.value = []; await fetchAll() } }
})
