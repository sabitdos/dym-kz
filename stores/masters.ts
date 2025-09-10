import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Databases, Query } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'
import type { Master } from '~/types/index'

export const useMastersStore = defineStore('masters', () => {
	const masters = ref<Master[]>([])
	const loading = ref(false)
	const error = ref('')
	const loaded = ref(false)

	async function fetchMasters() {
		if (loading.value || loaded.value) return
		loading.value = true
		error.value = ''
		try {
			const client = useAppwriteClient()
			const db = new Databases(client)
			const dbId = getDatabaseId()
			const cols: any = getCollections()
			const res: any = await db.listDocuments(dbId, cols.MASTERS, [Query.limit(100)])
			masters.value = res.documents as Master[]
			loaded.value = true
		} catch (e: any) {
			error.value = e?.message || 'Ошибка загрузки мастеров'
		} finally {
			loading.value = false
		}
	}

	return { masters, loading, error, loaded, fetchMasters }
})
