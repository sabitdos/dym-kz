<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">Оформление заказа</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Контактная информация</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Имя *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Телефон *</label>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Адрес доставки</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Адрес *</label>
              <input
                v-model="form.address"
                type="text"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Квартира/Офис</label>
                <input
                  v-model="form.apartment"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Этаж</label>
                <input
                  v-model="form.floor"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Комментарий к адресу</label>
              <textarea
                v-model="form.addressComment"
                rows="2"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Время доставки</h2>
          <div class="space-y-4">
            <div>
              <label class="flex items-center">
                <input
                  v-model="form.deliveryType"
                  type="radio"
                  value="asap"
                  class="mr-2"
                >
                Как можно скорее
              </label>
            </div>
            <div>
              <label class="flex items-center">
                <input
                  v-model="form.deliveryType"
                  type="radio"
                  value="scheduled"
                  class="mr-2"
                >
                Запланированная доставка
              </label>
            </div>
            <div v-if="form.deliveryType === 'scheduled'" class="ml-6 space-y-2">
              <input
                v-model="form.deliveryDate"
                type="date"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <input
                v-model="form.deliveryTime"
                type="time"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Способ оплаты</h2>
          <div class="space-y-4">
            <label class="flex items-center">
              <input
                v-model="form.paymentMethod"
                type="radio"
                value="cash"
                class="mr-2"
              >
              Наличными при доставке
            </label>
            <label class="flex items-center">
              <input
                v-model="form.paymentMethod"
                type="radio"
                value="card"
                class="mr-2"
              >
              Картой при доставке
            </label>
            <label class="flex items-center">
              <input
                v-model="form.paymentMethod"
                type="radio"
                value="online"
                class="mr-2"
              >
              Онлайн оплата
            </label>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Ваш заказ</h2>
          <div class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex justify-between items-center"
            >
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Количество: {{ item.quantity }}</p>
              </div>
              <p class="font-medium">{{ item.price * item.quantity }} ₸</p>
            </div>
          </div>
          
          <div class="border-t mt-4 pt-4">
            <div class="flex justify-between items-center text-lg font-semibold">
              <span>Итого:</span>
              <span>{{ totalPrice }} ₸</span>
            </div>
          </div>
        </div>

        <button
          @click="submitOrder"
          :disabled="!isFormValid || isSubmitting"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Оформляем заказ...' : 'Оформить заказ' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { useCartStore } from '~/stores/cart'
import { navigateTo } from '#app'
import { computed, ref } from 'vue'

useHead({
  title: 'Оформление заказа - Dym.kz'
})

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)

const form = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  apartment: '',
  floor: '',
  addressComment: '',
  deliveryType: 'asap',
  deliveryDate: '',
  deliveryTime: '',
  paymentMethod: 'cash'
})

const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return form.value.name && form.value.phone && form.value.address
})

const submitOrder = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    // Здесь будет логика отправки заказа
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Очистить корзину
    cartStore.clearCart()
    
    // Перенаправить на страницу успеха
    await navigateTo('/order-success')
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
