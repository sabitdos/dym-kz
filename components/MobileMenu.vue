<template>
  <transition name="fade">
    <div v-if="ui.mobileMenuOpen" class="fixed inset-0 z-[100] flex">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50" @click="close" />
      <!-- Drawer -->
      <aside class="ml-auto h-full w-72 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div class="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">D</span>
            </div>
            <span class="font-semibold text-gray-800 dark:text-gray-100">Dym.kz</span>
          </div>
          <button @click="close" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1 space-y-6">
          <!-- User Profile / Auth -->
          <section>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Профиль</h3>
            <div v-if="auth.user" class="flex items-center space-x-3">
              <img :src="auth.user?.prefs?.avatar || '/placeholder-user.jpg'" class="w-10 h-10 rounded-full object-cover" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ auth.user.name || auth.user.email }}</p>
                <NuxtLink to="/profile" class="text-xs text-sky-600 hover:underline">Личный кабинет</NuxtLink>
              </div>
              <button @click="logout" class="text-xs text-red-600 hover:underline">Выйти</button>
            </div>
            <div v-else class="flex items-center space-x-2">
              <NuxtLink to="/login" class="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-md">Войти</NuxtLink>
              <NuxtLink to="/register" class="px-3 py-1.5 text-sm border border-gray-300 rounded-md">Регистрация</NuxtLink>
            </div>
          </section>
          <!-- City Selector -->
          <section>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Город</h3>
            <CitySelector />
          </section>
          <!-- Language Selector -->
          <section>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Язык</h3>
            <LanguageSelector />
          </section>
          <!-- Navigation -->
          <section>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Навигация</h3>
            <nav class="flex flex-col space-y-2">
              <NuxtLink @click="close" to="/catalog" class="text-sm py-1 hover:text-sky-600">Каталог</NuxtLink>
              <NuxtLink @click="close" to="/order" class="text-sm py-1 hover:text-sky-600">Заказать</NuxtLink>
              <NuxtLink @click="close" to="/masters" class="text-sm py-1 hover:text-sky-600">Мастера</NuxtLink>
              <NuxtLink @click="close" to="/about" class="text-sm py-1 hover:text-sky-600">О нас</NuxtLink>
            </nav>
          </section>
          <!-- Cart Quick -->
          <section>
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Корзина</h3>
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">Товаров: <span class="font-medium">{{ cart.itemsCount }}</span></div>
              <NuxtLink @click="close" to="/cart" class="text-sm text-sky-600 hover:underline">Открыть</NuxtLink>
            </div>
          </section>
        </div>
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
          © {{ new Date().getFullYear() }} Dym.kz
        </div>
      </aside>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useUiStore } from '~/stores/ui'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import CitySelector from '~/components/CitySelector.vue'
import LanguageSelector from '~/components/LanguageSelector.vue'

const ui = useUiStore()
const cart = useCartStore()
const auth = useAuthStore()

function close() { ui.closeMobileMenu() }
async function logout() { try { await auth.logout(); close() } catch (e) { console.error(e) } }

watch(() => ui.mobileMenuOpen, (v: boolean) => {
  if (typeof window !== 'undefined') {
    const el = document.documentElement
    if (v) el.classList.add('overflow-hidden')
    else el.classList.remove('overflow-hidden')
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
