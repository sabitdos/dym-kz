<template>
	<div ref="rootEl">
		<div v-if="!ready" class="animate-pulse space-y-4">
			<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
				<div v-for="n in 4" :key="n" class="bg-white border rounded-xl p-5 h-28">
					<div class="h-3 w-20 bg-gray-200 rounded" />
					<div class="h-6 w-16 bg-gray-300 rounded mt-4" />
				</div>
			</div>
			<div class="grid gap-8 md:grid-cols-3">
				<div class="md:col-span-2 bg-white border rounded-xl p-6 h-64" />
				<div class="bg-white border rounded-xl p-6 h-64" />
			</div>
		</div>
		<template v-else>
			<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
				<component
					v-for="k in kpis"
					:is="'AdminKpiCard'"
					:key="k.label"
					:label="k.label"
					:value="k.value"
					:trend="k.trend"
				/>
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
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Databases, Query } from 'appwrite'
import { useAppwriteClient, getDatabaseId, getCollections } from '~/utils/appwrite'
import { definePageMeta } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { useDeferredRender } from '~/composables/useDeferredRender'
import { withTiming } from '~/utils/metrics'

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

const { target: rootEl, render: ready } = useDeferredRender({ rootMargin: '0px 0px -20% 0px' })

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
		const orders = await withTiming('orders-count', () => db.listDocuments(dbId, cols.ORDERS, [Query.limit(1)]))
		kpis.value[0].value = orders.total
		const users = await withTiming('users-count', () => db.listDocuments(dbId, cols.USERS, [Query.limit(1)]))
		kpis.value[1].value = users.total
		// For revenue, sum field total_price via listing first 50 (placeholder)
		const ordersList = await withTiming('orders-list', () => db.listDocuments(dbId, cols.ORDERS, [Query.limit(50)]))
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
onMounted(() => { if (ready.value) loadData() })
watch(ready, (v: boolean) => { if (v) loadData() })
</script>
