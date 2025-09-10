<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
		<div class="w-full max-w-sm bg-white border rounded-xl p-8 shadow">
			<h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
			<form @submit.prevent="submit" class="space-y-5">
				<div>
					<label class="block text-sm font-medium mb-1">Email</label>
					<input v-model="email" type="email" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Пароль</label>
					<input v-model="password" type="password" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500" />
				</div>
				<button :disabled="loading" class="w-full py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60">{{ loading ? 'Вход...' : 'Войти' }}</button>
				<p v-if="error" class="text-sm text-red-600">{{ error }}</p>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#imports'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const auth = useAuthStore()

async function submit() {
	loading.value = true
	error.value = ''
	try {
		await auth.login(email.value, password.value)
		navigateTo('/admin/dashboard')
	} catch (e: any) {
		error.value = e?.message || 'Ошибка входа'
	} finally {
		loading.value = false
	}
}
</script>
