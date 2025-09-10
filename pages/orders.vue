<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Мои заказы</h1>

    <div v-if="orders.length === 0" class="text-center py-12">
      <Package class="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <p class="text-gray-500 mb-4">У вас пока нет заказов</p>
      <NuxtLink
        to="/catalog"
        class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Перейти к каталогу
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-lg">Заказ #{{ order.id }}</h3>
            <p class="text-gray-500">{{ formatDate(order.createdAt) }}</p>
          </div>
          <span
            :class="getStatusClass(order.status)"
            class="px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <div class="space-y-2 mb-4">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between"
          >
            <span>{{ item.name }} × {{ item.quantity }}</span>
            <span>{{ item.price * item.quantity }} ₸</span>
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-500">Адрес доставки:</p>
              <p>{{ order.address }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Итого:</p>
              <p class="font-semibold text-lg">{{ order.total }} ₸</p>
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            v-if="order.status === 'pending'"
            @click="cancelOrder(order.id)"
            class="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
          >
            Отменить заказ
          </button>
          <NuxtLink
            :to="`/order/${order.id}`"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Подробнее
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { Package } from 'lucide-vue-next'
import { ref } from 'vue'

useHead({
  title: 'Мои заказы - Dym.kz'
})

const orders = ref([
  {
    id: '12345',
    createdAt: new Date('2024-01-15'),
    status: 'delivered',
    items: [
      { id: 1, name: 'Khalil Mamoon Classic', quantity: 1, price: 3000 }
    ],
    address: 'ул. Абая, 150, кв. 25',
    total: 3000
  },
  {
    id: '12346',
    createdAt: new Date('2024-01-20'),
    status: 'in_delivery',
    items: [
      { id: 2, name: 'Starbuzz Premium', quantity: 1, price: 3500 }
    ],
    address: 'пр. Достык, 200, офис 15',
    total: 3500
  }
])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Ожидает подтверждения',
    confirmed: 'Подтвержден',
    in_delivery: 'В доставке',
    delivered: 'Доставлен',
    cancelled: 'Отменен'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const cancelOrder = (orderId) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'cancelled'
  }
}
</script>
