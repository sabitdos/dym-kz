import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Databases, Query, type Models } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'
import type { Master } from '~/types/index'
import { useAsyncResource } from '~/composables/useAsyncResource'

export const useMastersStore = defineStore('masters', () => {
	const masters = ref<Master[]>([])
	const error = ref('')
	const resource = useAsyncResource<Master[]>(async () => {
		const client = useAppwriteClient()
		const db = new Databases(client)
		const dbId = getDatabaseId()
		const cols = getCollections()
		const res = await db.listDocuments(dbId, cols.MASTERS || 'masters', [Query.limit(100)]) as Models.DocumentList<Models.Document & Master>
		return res.documents as (Models.Document & Master)[]
	})

	async function fetchMasters() {
		if (resource.loaded.value || resource.loading.value) return
		const list = await resource.load()
		if (list) masters.value = list
		else error.value = resource.error.value || ''
	}

	return {
		masters,
		loading: resource.loading,
		loaded: resource.loaded,
		error,
		fetchMasters,
		reload: async () => { resource.reset(); masters.value = []; await fetchMasters() }
	}
})
