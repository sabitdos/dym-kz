<template>
	<div class="min-h-screen flex bg-gray-100 text-gray-800">
		<!-- Sidebar -->
		<aside class="w-64 hidden md:flex flex-col border-r bg-white">
			<div class="h-16 flex items-center px-4 border-b font-bold text-purple-600 text-lg">Dym Admin</div>
			<nav class="flex-1 overflow-y-auto py-4 space-y-1">
				<NuxtLink v-for="item in menu" :key="item.to" :to="item.to" class="group flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700" :class="{ 'bg-purple-600 text-white hover:bg-purple-600': route.path===item.to }">
					<span class="w-2 h-2 rounded-full" :class="route.path===item.to ? 'bg-white' : 'bg-purple-400 group-hover:bg-purple-600'" />
					{{ item.label }}
				</NuxtLink>
			</nav>
			<div class="p-4 border-t text-xs text-gray-500">© {{ new Date().getFullYear() }} Dym.kz</div>
		</aside>
		<!-- Content -->
		<div class="flex-1 flex flex-col min-w-0">
			<!-- Top bar -->
			<header class="h-16 bg-white border-b flex items-center justify-between px-4 gap-4">
				<div class="flex items-center gap-3">
					<button class="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border" @click="mobileOpen = !mobileOpen">
						<span class="i-lucide-menu" />
					</button>
					<h1 class="font-semibold" v-if="pageTitle">{{ pageTitle }}</h1>
				</div>
				<div class="flex items-center gap-3">
					<span v-if="auth.user" class="text-sm">{{ auth.user?.name || auth.user?.email }}</span>
					<span v-if="auth.isAdmin" class="px-2 py-0.5 text-[11px] rounded bg-purple-600 text-white font-medium">ADMIN</span>
					<button class="text-xs px-3 py-1.5 rounded border hover:bg-gray-50" @click="logout">Выйти</button>
				</div>
			</header>
			<main class="flex-1 overflow-y-auto p-4 md:p-8">
				<slot />
			</main>
		</div>
		<!-- Mobile drawer -->
		<transition name="fade">
			<div v-if="mobileOpen" class="fixed inset-0 z-40 flex md:hidden">
				<div class="w-64 bg-white border-r flex flex-col" @click.stop>
					<div class="h-14 flex items-center px-4 border-b font-bold text-purple-600">Dym Admin</div>
					<nav class="flex-1 overflow-y-auto py-4 space-y-1">
						<NuxtLink v-for="item in menu" :key="item.to" :to="item.to" class="block px-4 py-2 text-sm font-medium hover:bg-purple-50" @click="mobileOpen=false">{{ item.label }}</NuxtLink>
					</nav>
				</div>
				<div class="flex-1 bg-black/40" @click="mobileOpen=false" />
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)

const menu = computed(() => [
	{ to: '/admin/dashboard', label: 'Дашборд' },
	{ to: '/admin/orders', label: 'Заказы' },
	{ to: '/admin/customers', label: 'Клиенты' },
	{ to: '/admin/inventory', label: 'Склад' },
	{ to: '/admin/notifications', label: 'Уведомления' },
])

const pageTitle = computed(() => menu.value.find(i => i.to === route.path)?.label)

async function logout() {
	await auth.logout()
	router.push('/')
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{transition:opacity .15s}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
