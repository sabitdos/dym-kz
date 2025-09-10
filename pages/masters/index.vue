<template>
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-2xl font-bold mb-6">Кальянные мастера</h1>
		<div v-if="loading" class="text-gray-500">Загрузка...</div>
		<div v-else>
			<div v-if="masters.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<NuxtLink v-for="m in masters" :key="m.$id" :to="`/masters/${m.$id}`" class="block border rounded-lg p-4 hover:shadow bg-white">
					<div class="flex items-center gap-4">
						<img :src="m.avatar || '/placeholder-user.jpg'" class="w-14 h-14 rounded-full object-cover" />
						<div>
							<p class="font-semibold">{{ m.name }}</p>
							<p class="text-sm text-gray-500">⭐ {{ m.rating?.toFixed?.(1) || '—' }} · {{ m.total_reviews || 0 }} отзывов</p>
							<div class="mt-1 flex flex-wrap gap-1">
								<span v-for="s in (m.specialties || []).slice(0,3)" :key="s" class="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{{ s }}</span>
							</div>
						</div>
					</div>
				</NuxtLink>
			</div>
			<p v-else class="text-gray-400">Мастера пока не добавлены.</p>
		</div>
	</div>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Databases } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'
import type { Master } from '~/types'

const loading = ref(true)
const masters = ref<Master[]>([])

async function loadMasters(){
	try {
		const db = new Databases(useAppwriteClient())
		const res = await db.listDocuments(getDatabaseId(), (getCollections() as any).MASTERS, [])
		masters.value = res.documents as any
	} finally { loading.value = false }
}

onMounted(loadMasters)
</script>

<style scoped>
</style>

