<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-6">Клиенты</h1>
		<div class="flex items-center gap-3 mb-4">
			<input v-model="q" type="text" placeholder="Поиск по имени или email" class="border rounded px-3 py-2 w-72" />
		</div>
		<div v-if="loading" class="text-gray-500">Загрузка...</div>
		<div v-else>
			<div class="overflow-x-auto bg-white border rounded-lg">
				<table class="min-w-full text-sm">
					<thead>
						<tr class="bg-gray-50 text-left">
							<th class="px-4 py-3">Имя</th>
							<th class="px-4 py-3">Email</th>
							<th class="px-4 py-3">Телефон</th>
							<th class="px-4 py-3">Заказы</th>
							<th class="px-4 py-3">Баллы</th>
							<th class="px-4 py-3">Действия</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="c in filtered" :key="c.$id" class="border-t">
							<td class="px-4 py-3 font-medium">{{ c.name }}</td>
							<td class="px-4 py-3">{{ c.email }}</td>
							<td class="px-4 py-3">{{ c.phone || '—' }}</td>
							<td class="px-4 py-3">{{ c.orders_count || 0 }}</td>
							<td class="px-4 py-3">{{ c.loyalty_points || 0 }}</td>
							<td class="px-4 py-3">
								<NuxtLink :to="`/admin/orders?user=${c.$id}`" class="text-purple-600 hover:underline">Заказы</NuxtLink>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div v-if="!filtered.length" class="text-gray-400 mt-4">Клиенты не найдены.</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User } from '~/types'
import { Databases } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'

const loading = ref(true)
const q = ref('')
const customers = ref<User[]>([])

const filtered = computed(() => {
	if (!q.value.trim()) return customers.value
	const s = q.value.toLowerCase()
	return customers.value.filter(c => (c.name||'').toLowerCase().includes(s) || (c.email||'').toLowerCase().includes(s))
})

async function load(){
	try {
		const db = new Databases(useAppwriteClient())
		const res = await db.listDocuments(getDatabaseId(), (getCollections() as any).USERS, [])
		customers.value = res.documents as any
	} finally { loading.value = false }
}

onMounted(load)
</script>

<style scoped>
</style>

