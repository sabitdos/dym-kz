<template>
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
		<div class="w-full max-w-md">
			<div class="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
				<h1 class="text-2xl font-bold mb-6 text-gray-900">Вход</h1>
				<form @submit.prevent="submit" class="space-y-5">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input v-model="email" type="email" required autocomplete="email" class="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
						<input v-model="password" type="password" required autocomplete="current-password" class="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500" />
					</div>
					<div class="flex items-center justify-between text-sm">
						<NuxtLink to="/register" class="text-purple-600 hover:text-purple-700">Создать аккаунт</NuxtLink>
						<NuxtLink to="/reset" class="text-gray-500 hover:text-gray-700">Забыли пароль?</NuxtLink>
					</div>
					<button :disabled="loading" class="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium shadow hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-60 disabled:cursor-not-allowed transition">
						{{ loading ? 'Вход...' : 'Войти' }}
					</button>
					<p v-if="error" class="text-sm text-red-600">{{ error }}</p>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { navigateTo, useHead } from '#imports'

useHead({ title: 'Вход - Dym.kz' })

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const auth = useAuthStore()

async function submit() {
	error.value = ''
	loading.value = true
	try {
		await auth.login(email.value, password.value)
		navigateTo('/')
	} catch (e: any) {
		error.value = e?.message || 'Ошибка входа'
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
</style>
