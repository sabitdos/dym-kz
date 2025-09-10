<template>
  <header class="bg-gray-200/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Left: Hamburger (mobile) + Logo -->
        <div class="flex items-center space-x-3">
          <button @click="ui.toggleMobileMenu" class="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400" aria-label="Меню">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">D</span>
            </div>
            <span class="text-xl font-bold text-gray-800">Dym.kz</span>
          </NuxtLink>
        </div>
        <!-- Navigation (desktop) -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink to="/catalog" class="text-gray-700 hover:text-gray-900 transition-colors">Каталог</NuxtLink>
          <NuxtLink to="/order" class="text-gray-700 hover:text-gray-900 transition-colors">Заказать</NuxtLink>
          <NuxtLink to="/masters" class="text-gray-700 hover:text-gray-900 transition-colors">Мастера</NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 hover:text-gray-900 transition-colors">О нас</NuxtLink>
        </nav>
        <!-- Right cluster -->
        <div class="flex items-center space-x-4">
          <!-- City & Language selectors only desktop -->
          <div class="hidden md:flex items-center space-x-3">
            <CitySelector />
            <LanguageSelector />
          </div>
          <!-- Cart Button -->
          <ClientOnly>
            <button @click="toggleCart" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/></svg>
              <span v-if="cartStore.itemsCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">{{ cartStore.itemsCount }}</span>
            </button>
          </ClientOnly>
          <!-- Cart Link (desktop) -->
          <NuxtLink to="/cart" class="hidden sm:flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
            <span class="text-sm">Корзина</span>
            <ClientOnly><span v-if="cartStore.itemsCount > 0" class="text-sm font-medium">({{ cartStore.itemsCount }})</span></ClientOnly>
          </NuxtLink>
          <!-- Auth (desktop) -->
          <div class="hidden md:flex items-center space-x-2" v-if="!authStore.user">
            <NuxtLink to="/login" class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">Войти</NuxtLink>
            <NuxtLink to="/register" class="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-colors">Регистрация</NuxtLink>
          </div>
          <div class="hidden md:flex items-center space-x-2" v-else>
            <NuxtLink to="/profile" class="flex items-center space-x-2">
              <img :src="authStore.user?.prefs?.avatar || '/placeholder-user.jpg'" class="w-8 h-8 rounded-full object-cover" />
              <span class="text-sm font-medium text-gray-700">{{ authStore.user?.name || authStore.user?.email }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <ClientOnly><MobileMenu /></ClientOnly>
  </header>
</template>

<script setup lang="ts">
import { } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useCartSidebar } from '~/composables/useCartSidebar'
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'
import MobileMenu from '~/components/MobileMenu.vue'
import CitySelector from '~/components/CitySelector.vue'
import LanguageSelector from '~/components/LanguageSelector.vue'

const ui = useUiStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { toggle: toggleCart } = useCartSidebar()
</script>
