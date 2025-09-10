<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <div 
      v-for="toast in toasts" 
      :key="toast.id"
      class="bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm transform transition-all duration-300"
      :class="{
        'border-green-500': toast.type === 'success',
        'border-blue-500': toast.type === 'info',
        'border-red-500': toast.type === 'error',
        'border-yellow-500': toast.type === 'warning'
      }"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg v-if="toast.type === 'success'" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg v-else-if="toast.type === 'info'" class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm8.707-7.293a1 1 0 00-1.414 1.414L10 10.586l-4.293 4.293a1 1 0 001.414 1.414L11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 000-1.414z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        
        <div class="ml-3 flex-1">
          <h4 class="text-sm font-medium text-gray-900">{{ toast.title }}</h4>
          <p class="text-sm text-gray-600 mt-1">{{ toast.message }}</p>
        </div>
        
        <button 
          @click="removeToast(toast.id)"
          class="ml-4 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const toasts = ref([]);

const addToast = (toast) => {
  const id = Date.now().toString();
  toasts.value.push({ ...toast, id });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id);
  }, 5000);
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
}

// Listen for custom events
const handleNotificationSent = (event) => {
  addToast({
    type: 'success',
    title: 'Уведомление отправлено',
    message: `${event.detail.type.toUpperCase()} уведомление отправлено`
  });
}

const handleNotificationError = (event) => {
  addToast({
    type: 'error',
    title: 'Ошибка отправки',
    message: event.detail.message
  });
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('notification-sent', handleNotificationSent);
    window.addEventListener('notification-error', handleNotificationError);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('notification-sent', handleNotificationSent);
    window.removeEventListener('notification-error', handleNotificationError);
  }
});
</script>
