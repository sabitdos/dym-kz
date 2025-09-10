<template>
	<div class="container mx-auto px-4 py-12" v-if="ready">
		<div class="max-w-3xl mx-auto space-y-10">
			<div class="flex items-center gap-6">
				<div class="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center text-3xl font-bold">
					{{ initials }}
				</div>
				<div>
					  <h1 class="text-3xl font-bold">{{ userName || 'Профиль' }}</h1>
					  <p class="text-gray-500 text-sm mt-1">{{ auth.user?.email }}</p>
					<div class="mt-2 flex items-center gap-2 text-xs">
									<span class="px-2 py-1 rounded-full bg-gray-100 text-gray-600">
										ID: {{ auth.user?.$id?.slice(0,8) }}
									</span>
					</div>
				</div>
			</div>

			<div class="grid md:grid-cols-2 gap-8">
				<div class="p-6 bg-white border rounded-xl shadow-sm">
					<h2 class="font-semibold mb-4">Основное</h2>
					<ul class="space-y-2 text-sm">
						<li class="flex justify-between"><span class="text-gray-500">Имя</span><span>{{ userName || '—' }}</span></li>
						<li class="flex justify-between"><span class="text-gray-500">Email</span><span>{{ auth.user?.email || '—' }}</span></li>
						<li class="flex justify-between"><span class="text-gray-500">ID</span><span class="font-mono text-xs">{{ auth.user?.$id }}</span></li>
					</ul>
				</div>
				<div class="p-6 bg-white border rounded-xl shadow-sm">
					<h2 class="font-semibold mb-4">Безопасность</h2>
					<div class="space-y-3 text-sm">
						<p class="text-sm text-gray-600">Для смены пароля обратитесь в поддержку — функционал подтверждения email пока отключён.</p>
					</div>
				</div>
			</div>

			<div class="p-6 bg-white border rounded-xl shadow-sm">
				<h2 class="font-semibold mb-4">Сеанс</h2>
				<button @click="logout" class="px-5 py-2.5 rounded bg-red-600 text-white text-sm hover:bg-red-700">Выйти</button>
			</div>
		</div>
	</div>
	<div v-else class="container mx-auto px-4 py-24 text-center text-gray-500">Загрузка...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useHead, navigateTo } from '#imports'

useHead({ title: 'Профиль - Dym.kz' })

const auth = useAuthStore()
const ready = ref(false)
const userName = computed(() => auth.user?.name || '')
const initials = computed(() => (userName.value || auth.user?.email || '?').trim().split(/\s+/).map((p: string)=>p[0]).slice(0,2).join('').toUpperCase())

async function init() {
	if (!auth.user) {
		try { await auth.getCurrentUser() } catch {}
	}
	if (!auth.user) return navigateTo('/login')
	ready.value = true
}

async function logout() {
	try { await auth.logout() } finally { navigateTo('/') }
}

onMounted(init)
</script>

<style scoped>
</style>
