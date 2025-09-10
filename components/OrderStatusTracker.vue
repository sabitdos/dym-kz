<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold mb-4">Статус заказа</h3>
    
    <!-- Status Steps -->
    <div class="relative">
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div v-for="(step, index) in statusSteps" :key="step.status" class="relative flex items-center mb-6 last:mb-0">
        <div 
          class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
          :class="{
            'bg-green-500 text-white': step.completed,
            'bg-purple-500 text-white': step.current,
            'bg-gray-200 text-gray-600': !step.completed && !step.current
          }"
        >
          <svg v-if="step.completed" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </div>
        
        <div class="ml-4 flex-1">
          <div class="flex items-center justify-between">
            <h4 class="font-medium" :class="{ 'text-purple-600': step.current }">
              {{ step.title }}
            </h4>
            <span v-if="step.time" class="text-sm text-gray-500">{{ step.time }}</span>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ step.description }}</p>
          
          <!-- Notification Status -->
          <div v-if="step.notifications && step.notifications.length > 0" class="mt-2 flex items-center space-x-2">
            <span 
              v-for="notification in step.notifications" 
              :key="notification.type"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs"
              :class="{
                'bg-green-100 text-green-800': notification.delivered,
                'bg-red-100 text-red-800': !notification.delivered,
                'bg-gray-100 text-gray-600': notification.pending
              }"
            >
              <span v-if="notification.type === 'sms'">📱</span>
              <span v-else-if="notification.type === 'email'">📧</span>
              <span v-else>🔔</span>
              <span class="ml-1">
                {{ notification.delivered ? 'Отправлено' : notification.pending ? 'Отправляется...' : 'Ошибка' }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Status Button (for demo) -->
    <div class="mt-6 pt-4 border-t">
      <button 
        @click="updateStatus"
        :disabled="isUpdating"
        class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {{ isUpdating ? 'Обновляется...' : 'Обновить статус (демо)' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '~/stores/notifications'

const props = defineProps({
  orderId: {
    type: String,
    required: true
  },
  currentStatus: {
    type: String,
    default: 'new'
  }
})

const notificationsStore = useNotificationsStore()
const isUpdating = ref(false)

const allStatuses = ['new', 'confirmed', 'preparing', 'delivering', 'completed']

const statusSteps = computed(() => {
  const steps = [
    {
      status: 'new',
      title: 'Заказ получен',
      description: 'Ваш заказ принят и передан в обработку',
      completed: false,
      current: false,
      time: null,
      notifications: []
    },
    {
      status: 'confirmed',
      title: 'Заказ подтвержден',
      description: 'Заказ подтвержден и принят в работу',
      completed: false,
      current: false,
      time: null,
      notifications: []
    },
    {
      status: 'preparing',
      title: 'Готовится',
      description: 'Мастера готовят ваш кальян',
      completed: false,
      current: false,
      time: null,
      notifications: []
    },
    {
      status: 'delivering',
      title: 'Доставляется',
      description: 'Курьер направляется к вам',
      completed: false,
      current: false,
      time: null,
      notifications: []
    },
    {
      status: 'completed',
      title: 'Доставлен',
      description: 'Заказ успешно доставлен',
      completed: false,
      current: false,
      time: null,
      notifications: []
    }
  ]

  const currentIndex = allStatuses.indexOf(props.currentStatus)
  
  steps.forEach((step, index) => {
    if (index < currentIndex) {
      step.completed = true
      step.time = '12:' + (30 + index * 15).toString().padStart(2, '0')
    } else if (index === currentIndex) {
      step.current = true
      step.time = 'Сейчас'
    }

    // Add notification status from history
    const notifications = notificationsStore.history.filter(n => 
      n.orderId === props.orderId && n.status === step.status
    )
    
    step.notifications = notifications.map(n => ({
      type: n.type,
      delivered: n.delivered,
      pending: false
    }))
  })

  return steps
})

const updateStatus = async () => {
  isUpdating.value = true
  
  try {
    const currentIndex = allStatuses.indexOf(props.currentStatus)
    const nextStatus = allStatuses[currentIndex + 1]
    
    if (nextStatus) {
      // Simulate status update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Send notifications for new status
      await notificationsStore.sendNotification(props.orderId, nextStatus, {
        orderNumber: props.orderId,
        total: 5500,
        address: 'ул. Тестовая, 123',
        deliveryTime: '14:00-16:00',
        phone: '+7 777 123 45 67'
      })
      
      // Emit event to parent to update status
      emit('statusUpdated', nextStatus)
    }
  } catch (error) {
    console.error('Error updating status:', error)
  } finally {
    isUpdating.value = false
  }
}

const emit = defineEmits(['statusUpdated'])

onMounted(() => {
  notificationsStore.loadHistory()
})
</script>
