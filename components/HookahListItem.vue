<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div class="flex gap-4">
      <div class="relative flex-shrink-0">
        <img 
          :src="hookah.image" 
          :alt="hookah.name"
          class="w-24 h-24 object-cover rounded-lg"
        />
        <div v-if="!hookah.available" class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
          <span class="text-white text-xs font-medium">Недоступен</span>
        </div>
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-lg text-gray-900 mb-1">{{ hookah.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">{{ hookah.brand }} • {{ getSizeLabel(hookah.size) }}</p>
            <p class="text-gray-600 text-sm mb-3">{{ hookah.description }}</p>
            
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span class="flex items-center">
                ⭐ {{ hookah.rating }} ({{ hookah.reviews_count }} отзывов)
              </span>
              <span class="flex items-center">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                {{ hookah.popularity }}% популярность
              </span>
            </div>
          </div>
          
          <div class="text-right ml-4">
            <div class="mb-3">
              <span class="text-xl font-bold text-purple-600">{{ hookah.price.toLocaleString() }} ₸</span>
              <span class="text-sm text-gray-500 block">/час</span>
            </div>
            
            <NuxtLink 
              :to="`/order?hookah=${hookah.id}`"
              class="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': !hookah.available }"
            >
              {{ hookah.available ? 'Выбрать' : 'Недоступен' }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  hookah: {
    type: Object,
    required: true
  }
})

const getSizeLabel = (size) => {
  const labels = {
    small: 'Маленький',
    medium: 'Средний',
    large: 'Большой'
  }
  return labels[size] || size
}
</script>
