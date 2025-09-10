<template>
  <div class="bg-white rounded-lg border p-4" :class="compact ? 'shadow-sm' : 'shadow-md'">
    <div class="flex gap-4">
      <!-- Image -->
      <div class="flex-shrink-0">
        <img 
          :src="item.hookah.image" 
          :alt="item.hookah.name"
          :class="compact ? 'w-16 h-16' : 'w-20 h-20'"
          class="object-cover rounded-lg"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 :class="compact ? 'text-sm' : 'text-base'" class="font-medium text-gray-900 truncate">
              {{ item.hookah.name }}
            </h3>
            <p :class="compact ? 'text-xs' : 'text-sm'" class="text-gray-600">
              {{ item.hookah.brand }} • {{ getSizeLabel(item.hookah.size) }}
            </p>
          </div>
          
          <button 
            @click="removeItem"
            class="p-1 text-gray-400 hover:text-red-500 transition-colors"
            :class="compact ? 'ml-2' : 'ml-4'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>

        <!-- Tobaccos -->
        <div v-if="item.tobaccos.length > 0" class="mb-2">
          <p :class="compact ? 'text-xs' : 'text-sm'" class="text-gray-600 mb-1">Табак:</p>
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="tobacco in item.tobaccos" 
              :key="tobacco.id"
              :class="compact ? 'text-xs px-2 py-1' : 'text-xs px-2 py-1'"
              class="bg-purple-100 text-purple-800 rounded-full"
            >
              {{ tobacco.name }} ({{ tobacco.weight }}г)
            </span>
          </div>
        </div>

        <!-- Details -->
        <div :class="compact ? 'text-xs' : 'text-sm'" class="text-gray-600 mb-3">
          <span>{{ item.rentalHours }} {{ getHoursLabel(item.rentalHours) }}</span>
        </div>

        <!-- Price and Quantity -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <button 
              @click="decreaseQuantity"
              :disabled="item.quantity <= 1"
              class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
            
            <span :class="compact ? 'text-sm' : 'text-base'" class="font-medium min-w-[2rem] text-center">
              {{ item.quantity }}
            </span>
            
            <button 
              @click="increaseQuantity"
              class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </button>
          </div>

          <div class="text-right">
            <div :class="compact ? 'text-sm' : 'text-base'" class="font-semibold text-purple-600">
              {{ cartStore.getItemPrice(item).toLocaleString() }} ₸
            </div>
            <div v-if="!compact" class="text-xs text-gray-500">
              {{ getItemPricePerHour() }} ₸/час
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const cartStore = useCartStore()

const getSizeLabel = (size) => {
  const labels = {
    small: 'Маленький',
    medium: 'Средний',
    large: 'Большой'
  }
  return labels[size] || size
}

const getHoursLabel = (hours) => {
  if (hours === 1) return 'час'
  if (hours >= 2 && hours <= 4) return 'часа'
  return 'часов'
}

const getItemPricePerHour = () => {
  const hookahPrice = props.item.hookah.price
  const tobaccoPrice = props.item.tobaccos.reduce((sum, t) => sum + (t.price * t.weight), 0)
  return (hookahPrice + tobaccoPrice).toLocaleString()
}

const increaseQuantity = () => {
  cartStore.updateQuantity(props.item.id, props.item.quantity + 1)
}

const decreaseQuantity = () => {
  cartStore.updateQuantity(props.item.id, props.item.quantity - 1)
}

const removeItem = () => {
  cartStore.removeItem(props.item.id)
}
</script>
