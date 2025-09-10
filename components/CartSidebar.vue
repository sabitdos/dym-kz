<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-hidden"
    @click="close"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    <div
      class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
      @click.stop
    >
      <div class="flex h-full flex-col">
        <div class="flex items-center justify-between border-b p-4">
          <h2 class="text-lg font-semibold">Корзина</h2>
          <button
            @click="close"
            class="rounded-full p-2 hover:bg-gray-100"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cartItems.length === 0" class="text-center py-8">
            <ShoppingCart class="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p class="text-gray-500">Корзина пуста</p>
          </div>

          <div v-else class="space-y-4">
            <CartItem
              v-for="item in cartItems"
              :key="item.id"
              :item="item"
            />
          </div>
        </div>

        <div v-if="cartItems.length > 0" class="border-t p-4">
          <div class="mb-4">
            <div class="flex justify-between text-lg font-semibold">
              <span>Итого:</span>
              <span>{{ totalPrice }} ₸</span>
            </div>
          </div>
          <button
            @click="goToCheckout"
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, ShoppingCart } from 'lucide-vue-next'
import { useCartSidebar } from '~/composables/useCartSidebar'
import { useCartStore } from '~/stores/cart'
import CartItem from '~/components/CartItem.vue'
import { computed } from 'vue'
import { navigateTo } from '#app'

const { isOpen, close } = useCartSidebar()
const cartStore = useCartStore()

const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)

const goToCheckout = () => {
  close()
  navigateTo('/checkout')
}
</script>
