<template>
  <div class="mobile-app">
    <!-- Mobile Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50 safe-area-top">
      <div class="flex items-center justify-between px-4 h-14">
        <button 
          v-if="showBackButton"
          @click="$router.go(-1)"
          class="p-2 -ml-2"
        >
          <ArrowLeftIcon class="w-6 h-6" />
        </button>
        
        <h1 class="font-semibold text-lg flex-1 text-center">{{ pageTitle }}</h1>
        
        <button 
          @click="toggleCart"
          class="relative p-2 -mr-2"
        >
          <ShoppingCartIcon class="w-6 h-6" />
          <span 
            v-if="cartStore.itemsCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ cartStore.itemsCount }}
          </span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
  <main class="flex-1 overflow-auto">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="bg-white border-t safe-area-bottom">
      <div class="flex">
        <NuxtLink 
          to="/"
          class="flex-1 flex flex-col items-center py-2 text-xs"
          :class="$route.path === '/' ? 'text-purple-600' : 'text-gray-600'"
        >
          <HomeIcon class="w-6 h-6 mb-1" />
          <span>Главная</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/catalog"
          class="flex-1 flex flex-col items-center py-2 text-xs"
          :class="$route.path.startsWith('/catalog') ? 'text-purple-600' : 'text-gray-600'"
        >
          <SearchIcon class="w-6 h-6 mb-1" />
          <span>Каталог</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/orders"
          class="flex-1 flex flex-col items-center py-2 text-xs"
          :class="$route.path.startsWith('/orders') ? 'text-purple-600' : 'text-gray-600'"
        >
          <ClockIcon class="w-6 h-6 mb-1" />
          <span>Заказы</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/profile"
          class="flex-1 flex flex-col items-center py-2 text-xs"
          :class="$route.path.startsWith('/profile') ? 'text-purple-600' : 'text-gray-600'"
        >
          <UserIcon class="w-6 h-6 mb-1" />
          <span>Профиль</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, ShoppingCartIcon, HomeIcon, SearchIcon, ClockIcon, UserIcon } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useRoute } from '#app'
import { useCartSidebar } from '~/composables/useCartSidebar'
import { computed } from 'vue'

const cartStore = useCartStore()
const route = useRoute()
const { toggle: toggleCart } = useCartSidebar()

const pageTitle = computed(() => {
  const titles = {
    '/': 'Dym.kz',
    '/catalog': 'Каталог',
    '/orders': 'Мои заказы',
    '/profile': 'Профиль'
  }
  return titles[route.path] || 'Dym.kz'
})

const showBackButton = computed(() => {
  const mainRoutes = ['/', '/catalog', '/orders', '/profile']
  return !mainRoutes.includes(route.path)
})
</script>

<style scoped>
.mobile-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
