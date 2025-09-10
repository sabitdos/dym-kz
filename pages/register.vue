<template>
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
		<div class="w-full max-w-md">
			<div class="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
				<h1 class="text-2xl font-bold mb-6 text-gray-900">Регистрация</h1>
				<form @submit.prevent="submit" class="space-y-5">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
						<input v-model="name" type="text" required class="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input v-model="email" type="email" required autocomplete="email" class="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
						<input v-model="password" type="password" required minlength="6" autocomplete="new-password" class="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Повторите пароль</label>
						<input v-model="password2" type="password" required minlength="6" autocomplete="new-password" class="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500" />
					</div>
					<div class="flex items-center text-xs text-gray-500">
						Нажимая «Создать аккаунт», вы соглашаетесь с условиями сервиса.
					</div>
					<button :disabled="loading" class="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium shadow hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-60 disabled:cursor-not-allowed transition">
						{{ loading ? 'Создание...' : 'Создать аккаунт' }}
					</button>
					<p v-if="error" class="text-sm text-red-600">{{ error }}</p>
					<p class="text-sm text-gray-600">Уже есть аккаунт? <NuxtLink to="/login" class="text-purple-600 hover:text-purple-700">Войти</NuxtLink></p>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { navigateTo, useHead } from '#imports'

useHead({ title: 'Регистрация - Dym.kz' })

const name = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
const error = ref('')
const auth = useAuthStore()

async function submit() {
	error.value = ''
	if (password.value !== password2.value) { error.value = 'Пароли не совпадают'; return }
	loading.value = true
	try {
		const ok = await auth.register(email.value, password.value, name.value.trim())
		if (ok) navigateTo('/')
	} catch (e: any) {
		error.value = e?.message || 'Ошибка регистрации'
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
</style>
