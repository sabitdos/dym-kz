<template>
	<div>
		<!-- Если пользователь не админ, контент всё равно будет перехвачен глобальным middleware; добавим защиту на случай прямой загрузки -->
		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
			<div v-for="k in kpis" :key="k.label" class="bg-white border rounded-xl p-5 flex flex-col">
				<span class="text-xs uppercase tracking-wide text-gray-500 font-medium">{{ k.label }}</span>
				<span class="mt-2 text-2xl font-bold">{{ k.value ?? '—' }}</span>
				<span class="mt-1 text-xs" :class="k.trend>0 ? 'text-green-600':'text-red-600'" v-if="k.trend !== undefined">{{ k.trend>0? '+'+k.trend : k.trend }}% за 7д</span>
			</div>
		</div>
		<div class="grid gap-8 md:grid-cols-3">
			<div class="md:col-span-2 bg-white border rounded-xl p-6">
				<div class="flex items-center justify-between mb-4">
					<h2 class="font-semibold">Динамика заказов</h2>
					<select v-model="range" class="text-sm border rounded px-2 py-1">
						<option value="7">7д</option>
						<option value="30">30д</option>
						<option value="90">90д</option>
					</select>
				</div>
				<div class="h-56 flex items-center justify-center text-gray-400 text-sm">Chart placeholder</div>
			</div>
			<div class="bg-white border rounded-xl p-6">
				<h2 class="font-semibold mb-4">Топ клиенты</h2>
				<ul class="divide-y text-sm">
					<li v-for="c in topCustomers" :key="c.id" class="flex items-center justify-between py-2">
						<span class="truncate max-w-[60%]">{{ c.name }}</span>
						<span class="font-medium">{{ c.total }} ₸</span>
					</li>
					<li v-if="!topCustomers.length" class="py-4 text-gray-400 text-center">Нет данных</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Databases, Query } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'
import { definePageMeta } from '#imports'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'admin' })

interface KPI { label: string; value?: any; trend?: number }

const kpis = ref<KPI[]>([
	{ label: 'Заказы', value: null },
	{ label: 'Клиенты', value: null },
	{ label: 'Выручка', value: null },
	{ label: 'Средний чек', value: null }
])
const range = ref('7')
const topCustomers = ref<{id:string; name:string; total:number}[]>([])

async function loadData(){
	try {
		const auth = useAuthStore()
		if (!(auth as any).initialized?.value) {
			try { await (auth as any).ensureLoaded?.() } catch {}
		}
		if (!(auth as any).isAdmin?.value) {
			console.warn('[dashboard] not admin; abort data load')
			return
		}
		const db = new Databases(useAppwriteClient())
		const cols: any = getCollections()
		const dbId = getDatabaseId()
		// Basic counts (fallback if queries fail)
		const orders = await db.listDocuments(dbId, cols.ORDERS, [Query.limit(1)])
		kpis.value[0].value = orders.total
		const users = await db.listDocuments(dbId, cols.USERS, [Query.limit(1)])
		kpis.value[1].value = users.total
		// For revenue, sum field total_price via listing first 50 (placeholder)
		const ordersList = await db.listDocuments(dbId, cols.ORDERS, [Query.limit(50)])
		const revenue = ordersList.documents.reduce((s:any,o:any)=> s + (o.total_price||0), 0)
		kpis.value[2].value = revenue.toLocaleString('ru-RU') + ' ₸'
		kpis.value[3].value = ordersList.documents.length ? Math.round(revenue / ordersList.documents.length) + ' ₸' : '—'
		// top customers (naive)
		const customerMap: Record<string,{id:string; name:string; total:number}> = {}
		for (const o of ordersList.documents){
			const id = o.user_id || 'unknown'
			if(!customerMap[id]) customerMap[id] = { id, name: o.customer?.firstName? (o.customer.firstName + ' ' + (o.customer.lastName||'')) : id, total:0 }
			customerMap[id].total += (o.total_price||0)
		}
		topCustomers.value = Object.values(customerMap).sort((a,b)=>b.total-a.total).slice(0,5)
	} catch (e){
		console.warn('Dashboard load error', e)
	}
}

onMounted(loadData)
</script>
