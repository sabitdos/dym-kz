<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Уведомления</h1>

    <div v-if="notifications.length === 0" class="text-center py-12">
      <Bell class="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <p class="text-gray-500">У вас нет уведомлений</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'bg-white rounded-lg shadow p-4 border-l-4',
          notification.read ? 'border-gray-300' : 'border-blue-500'
        ]"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold mb-1">{{ notification.title }}</h3>
            <p class="text-gray-600 mb-2">{{ notification.message }}</p>
            <p class="text-sm text-gray-400">{{ formatDate(notification.createdAt) }}</p>
          </div>
          <div class="flex gap-2">
            <button
              v-if="!notification.read"
              @click="markAsRead(notification.id)"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              Отметить как прочитанное
            </button>
            <button
              @click="deleteNotification(notification.id)"
              class="text-red-600 hover:text-red-800"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="notifications.length > 0" class="mt-6 text-center">
      <button
        @click="markAllAsRead"
        class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 mr-4"
      >
        Отметить все как прочитанные
      </button>
      <button
        @click="clearAll"
        class="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
      >
        Очистить все
      </button>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { ref } from 'vue'
import { Bell, Trash2 } from 'lucide-vue-next'

useHead({
  title: 'Уведомления - Dym.kz'
})

const notifications = ref([
  {
    id: 1,
    title: 'Заказ подтвержден',
    message: 'Ваш заказ #12346 подтвержден и будет доставлен в течение часа.',
    createdAt: new Date('2024-01-20T10:30:00'),
    read: false
  },
  {
    id: 2,
    title: 'Заказ доставлен',
    message: 'Ваш заказ #12345 успешно доставлен. Спасибо за выбор Dym.kz!',
    createdAt: new Date('2024-01-15T15:45:00'),
    read: true
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

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const deleteNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const clearAll = () => {
  notifications.value = []
}
</script>
