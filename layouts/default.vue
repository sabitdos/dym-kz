<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />
    <main class="flex-1 pb-20 md:pb-0">
      <slot />
    </main>
    <AppFooter class="mt-auto" />
    <CartSidebar />
    <NotificationToast />
  <AgeGate />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useNotificationsStore } from '~/stores/notifications'
import { useHead } from '@unhead/vue'
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import CartSidebar from '~/components/CartSidebar.vue'
import NotificationToast from '~/components/NotificationToast.vue'
import AgeGate from '~/components/AgeGate.vue'

const cartStore = useCartStore()
const notificationsStore = useNotificationsStore()

useHead({
  title: 'Dym.kz - Доставка кальянов',
  meta: [
    { name: 'description', content: 'Быстрая доставка кальянов в Алматы' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  htmlAttrs: {
    lang: 'ru'
  }
})

// Initialize stores on client side only
onMounted(() => {
  cartStore.loadFromStorage()
  notificationsStore.loadSettings()
  notificationsStore.loadHistory()

  // Request notification permission on first visit
  if (process.client && 'Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
      notificationsStore.requestNotificationPermission()
    }, 3000)
  }
})
</script>
