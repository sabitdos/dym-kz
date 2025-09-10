<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div class="relative">
      <img 
        :src="hookah.image" 
        :alt="hookah.name"
        class="w-full h-48 object-cover"
      />
      <div class="absolute top-2 right-2">
        <span class="bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
          ⭐ {{ hookah.rating }}
        </span>
      </div>
      <div v-if="!hookah.available" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Недоступен
        </span>
      </div>
    </div>
    
    <div class="p-4">
      <div class="mb-2">
        <h3 class="font-semibold text-gray-900 mb-1">{{ hookah.name }}</h3>
        <p class="text-sm text-gray-600">{{ hookah.brand }} • {{ getSizeLabel(hookah.size) }}</p>
      </div>
      
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ hookah.description }}</p>
      
      <div class="flex items-center justify-between">
        <div>
          <span class="text-lg font-bold text-purple-600">{{ hookah.price.toLocaleString() }} ₸</span>
          <span class="text-sm text-gray-500">/час</span>
        </div>
        
        <NuxtLink 
          :to="`/order?hookah=${hookah.id}`"
          class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': !hookah.available }"
        >
          {{ hookah.available ? 'Выбрать' : 'Недоступен' }}
        </NuxtLink>
      </div>
      
      <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{{ hookah.reviews_count }} отзывов</span>
        <span class="flex items-center">
          <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
          Популярность: {{ hookah.popularity }}%
        </span>
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
