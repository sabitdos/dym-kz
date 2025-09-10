import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Databases, Query, type Models } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'
import { useAsyncResource } from '~/composables/useAsyncResource'
import type { Hookah } from '~/types/appwrite'

export const useHookahsStore = defineStore('hookahs', () => {
  const items = ref<(Models.Document & Hookah)[]>([])
  const resource = useAsyncResource<(Models.Document & Hookah)[]>(async () => {
    const client = useAppwriteClient()
    const db = new Databases(client)
    const dbId = getDatabaseId()
    const cols = getCollections()
    const res = await db.listDocuments(dbId, cols.HOOKAHS || 'hookahs', [Query.limit(200)]) as Models.DocumentList<Models.Document & Hookah>
    return res.documents as (Models.Document & Hookah)[]
  }, { label: 'load-hookahs', metrics: true })

  async function fetchAll() {
    if (resource.loaded.value || resource.loading.value) return
    const list = await resource.load()
    if (list) items.value = list
  }

  return { items, loading: resource.loading, loaded: resource.loaded, error: resource.error, fetchAll, reload: async () => { resource.reset(); items.value = []; await fetchAll() } }
})
