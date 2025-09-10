<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Корзина</h1>
        <p v-if="!cartStore.isEmpty" class="text-gray-600">
          {{ cartStore.uniqueItemsCount }} {{ getItemsLabel() }}, {{ cartStore.itemsCount }} {{ getQuantityLabel() }}
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="cartStore.isEmpty" class="text-center py-16">
        <div class="text-8xl mb-6">🛒</div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Ваша корзина пуста</h2>
        <p class="text-gray-600 mb-8">Добавьте кальяны для аренды, чтобы продолжить</p>
        <NuxtLink 
          to="/catalog"
          class="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Перейти к каталогу
        </NuxtLink>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Items List -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">Товары в корзине</h2>
                <button 
                  @click="showClearConfirm = true"
                  class="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Очистить корзину
                </button>
              </div>
            </div>
            
            <div class="p-6 space-y-4">
              <CartItem 
                v-for="item in cartStore.items" 
                :key="item.id"
                :item="item"
              />
            </div>
          </div>

          <!-- Recommendations -->
          <div class="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">Рекомендуем добавить</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div v-for="hookah in recommendations" :key="hookah.id" class="border rounded-lg p-4 hover:border-purple-300 transition-colors">
                <div class="flex gap-3">
                  <img :src="hookah.image" :alt="hookah.name" class="w-16 h-16 object-cover rounded-lg" />
                  <div class="flex-1">
                    <h4 class="font-medium text-sm">{{ hookah.name }}</h4>
                    <p class="text-xs text-gray-600">{{ hookah.brand }}</p>
                    <p class="text-sm font-semibold text-purple-600">{{ hookah.price.toLocaleString() }} ₸/час</p>
                    <button 
                      @click="addRecommendation(hookah)"
                      class="mt-2 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 class="text-xl font-semibold mb-4">Итого</h2>
            
            <!-- Summary Details -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span>Товары ({{ cartStore.itemsCount }}):</span>
                <span>{{ cartStore.subtotal.toLocaleString() }} ₸</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span>Доставка:</span>
                <span>{{ cartStore.deliveryFee.toLocaleString() }} ₸</span>
              </div>
              
              <div class="border-t pt-3">
                <div class="flex justify-between text-lg font-semibold">
                  <span>К оплате:</span>
                  <span class="text-purple-600">{{ cartStore.total.toLocaleString() }} ₸</span>
                </div>
              </div>
            </div>

            <!-- Promo Code -->
            <div class="mb-6">
              <div class="flex gap-2">
                <input 
                  v-model="promoCode"
                  type="text"
                  placeholder="Промокод"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <button 
                  @click="applyPromoCode"
                  :disabled="!promoCode.trim()"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
                >
                  Применить
                </button>
              </div>
              <p v-if="promoMessage" :class="promoSuccess ? 'text-green-600' : 'text-red-600'" class="text-xs mt-1">
                {{ promoMessage }}
              </p>
            </div>

            <!-- Actions -->
            <div class="space-y-3">
              <NuxtLink 
                to="/checkout"
                class="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Оформить заказ
              </NuxtLink>
              
              <NuxtLink 
                to="/catalog"
                class="block w-full bg-gray-100 text-gray-700 text-center py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Продолжить покупки
              </NuxtLink>
            </div>

            <!-- Delivery Info -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-blue-900">Доставка</h4>
                  <p class="text-xs text-blue-700 mt-1">
                    Бесплатная доставка при заказе от 10,000 ₸
                  </p>
                  <p class="text-xs text-blue-700">
                    Время доставки: 1-2 часа
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Confirmation Modal -->
    <div v-if="showClearConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 class="text-lg font-semibold mb-4">Очистить корзину?</h3>
        <p class="text-gray-600 mb-6">Все товары будут удалены из корзины. Это действие нельзя отменить.</p>
        <div class="flex gap-3">
          <button 
            @click="clearCart"
            class="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Очистить
          </button>
          <button 
            @click="showClearConfirm = false"
            class="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '~/stores/cart'
// useHead is provided globally by Nuxt 3; remove external @vueuse/head import
import CartItem from '~/components/CartItem.vue'

// Meta
useHead({
  title: 'Корзина - Dym.kz',
  meta: [
    { name: 'description', content: 'Корзина товаров для аренды кальянов' }
  ]
})

const cartStore = useCartStore()

// State
const showClearConfirm = ref(false)
const promoCode = ref('')
const promoMessage = ref('')
const promoSuccess = ref(false)

// Recommendations
const recommendations = [
  {
    id: 101,
    name: 'Khalil Mamoon Mini',
    brand: 'Khalil Mamoon',
    price: 2200,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: 102,
    name: 'Amy Compact',
    brand: 'Amy',
    price: 2400,
    image: '/placeholder.svg?height=200&width=200'
  }
]

// Methods
const getItemsLabel = () => {
  const count = cartStore.uniqueItemsCount
  if (count === 1) return 'товар'
  if (count >= 2 && count <= 4) return 'товара'
  return 'товаров'
}

const getQuantityLabel = () => {
  const count = cartStore.itemsCount
  if (count === 1) return 'штука'
  if (count >= 2 && count <= 4) return 'штуки'
  return 'штук'
}

const clearCart = () => {
  cartStore.clearCart()
  showClearConfirm.value = false
}

const applyPromoCode = () => {
  // Simulate promo code validation
  const validCodes = ['FIRST10', 'SAVE20', 'WELCOME']
  
  if (validCodes.includes(promoCode.value.toUpperCase())) {
    promoMessage.value = 'Промокод применен!'
    promoSuccess.value = true
  } else {
    promoMessage.value = 'Неверный промокод'
    promoSuccess.value = false
  }
  
  setTimeout(() => {
    promoMessage.value = ''
  }, 3000)
}

const addRecommendation = (hookah) => {
  cartStore.addItem({
    hookah: {
      id: hookah.id,
      name: hookah.name,
      brand: hookah.brand,
      price: hookah.price,
      image: hookah.image,
      size: 'medium'
    },
    tobaccos: [],
    rentalHours: 4,
    quantity: 1
  })
}
</script>
