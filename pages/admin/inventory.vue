<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-6">Склад</h1>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<section class="bg-white border rounded-lg">
				<header class="px-4 py-3 border-b font-semibold">Табаки</header>
				<div class="p-4">
					<div v-if="loadingT" class="text-gray-500">Загрузка...</div>
					<table v-else class="min-w-full text-sm">
						<thead>
							<tr class="bg-gray-50 text-left">
								<th class="px-3 py-2">Название</th>
								<th class="px-3 py-2">Бренд</th>
								<th class="px-3 py-2">Крепость</th>
								<th class="px-3 py-2">Цена</th>
								<th class="px-3 py-2">Наличие</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="t in tobaccos" :key="t.$id" class="border-t">
								<td class="px-3 py-2">{{ t.name }}</td>
								<td class="px-3 py-2">{{ t.brand }}</td>
								<td class="px-3 py-2">{{ t.strength }}</td>
								<td class="px-3 py-2">{{ t.price }} ₸</td>
								<td class="px-3 py-2">{{ t.available ? 'Да' : 'Нет' }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
			<section class="bg-white border rounded-lg">
				<header class="px-4 py-3 border-b font-semibold">Угли</header>
				<div class="p-4">
					<div v-if="loadingC" class="text-gray-500">Загрузка...</div>
					<table v-else class="min-w-full text-sm">
						<thead>
							<tr class="bg-gray-50 text-left">
								<th class="px-3 py-2">Название</th>
								<th class="px-3 py-2">Бренд</th>
								<th class="px-3 py-2">Цена</th>
								<th class="px-3 py-2">Наличие</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="c in coals" :key="c.$id" class="border-t">
								<td class="px-3 py-2">{{ c.name }}</td>
								<td class="px-3 py-2">{{ c.brand }}</td>
								<td class="px-3 py-2">{{ c.price }} ₸</td>
								<td class="px-3 py-2">{{ c.available ? 'Да' : 'Нет' }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Databases } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'
import type { Tobacco } from '~/types'

const loadingT = ref(true)
const loadingC = ref(true)
const tobaccos = ref<any[]>([])
const coals = ref<any[]>([])

async function loadTobacco(){
	try {
		const db = new Databases(useAppwriteClient())
		const res = await db.listDocuments(getDatabaseId(), (getCollections() as any).TOBACCOS, [])
		tobaccos.value = res.documents as any
	} finally { loadingT.value = false }
}
async function loadCoals(){
	try {
		const db = new Databases(useAppwriteClient())
		const res = await db.listDocuments(getDatabaseId(), (getCollections() as any).COALS, [])
		coals.value = res.documents as any
	} finally { loadingC.value = false }
}

onMounted(() => { loadTobacco(); loadCoals() })
</script>

<style scoped>
</style>

