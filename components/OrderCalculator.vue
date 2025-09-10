<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
    <!-- Hookah Info -->
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-4">
        <img
          :src="(hookah && hookah.img_url && hookah.img_url[0]) ? hookah.img_url[0] : '/placeholder.svg?height=80&width=80'"
          :alt="hookah?.name || 'Hookah'"
          class="w-20 h-20 object-cover rounded-lg"
        >
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ hookah?.name || 'Кальян' }}</h2>
          <p class="text-gray-600">{{ hookah?.brand || '' }}</p>
          <p class="text-lg font-semibold text-blue-600">{{ (hookah?.price || 0) }} ₸/час</p>
        </div>
      </div>
    </div>

    <!-- Tobacco Selection -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Выбор табака</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="tobacco in tobaccos"
          :key="tobacco.$id"
          class="border rounded-lg p-4"
          :class="{ 'border-blue-500 bg-blue-50': isSelected(tobacco.$id) }"
        >
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium">{{ tobacco.name }}</h4>
              <p class="text-sm text-gray-600">{{ tobacco.brand }}</p>
              <p class="text-sm font-semibold">{{ tobacco.price }} ₸/г</p>
            </div>
            <label class="flex items-center">
              <input
                type="checkbox"
                :checked="isSelected(tobacco.$id)"
                @change="toggleTobacco(tobacco)"
                :disabled="!canSelect && !isSelected(tobacco.$id)"
                class="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Rental Duration -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Время аренды</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span>Часов:</span>
          <span class="text-lg font-semibold">{{ rentalHours }}</span>
        </div>
        <input
          v-model="rentalHours"
          type="range"
          min="1"
          max="24"
          class="w-full"
        />
      </div>
    </div>

    <!-- Price Calculation -->
    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 class="text-lg font-semibold mb-3">Расчет стоимости</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span>Кальян × {{ rentalHours }}ч:</span>
          <span>{{ (((hookah?.price || 0) * rentalHours) as number).toLocaleString() }} ₸</span>
        </div>
        <div class="flex justify-between">
          <span>Табак × {{ rentalHours }}ч:</span>
          <span>{{ (tobaccoPrice * rentalHours).toLocaleString() }} ₸</span>
        </div>
        <div class="flex justify-between">
          <span>Доставка:</span>
          <span>{{ deliveryFee.toLocaleString() }} ₸</span>
        </div>
        <hr class="my-2">
        <div class="flex justify-between text-lg font-semibold">
          <span>Итого:</span>
          <span class="text-blue-600">{{ totalPrice.toLocaleString() }} ₸</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-4">
      <button
        @click="addToCart"
        class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700"
    :disabled="!hookah || selectedTobaccos.length === 0"
      >
        Добавить в корзину
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'

interface Hookah {
  img_url: string[]
  name: string
  brand: string
  price: number
  size?: 'small' | 'medium' | 'large' | string
  $id?: string
}

interface Tobacco {
  $id: string
  name: string
  brand: string
  price: number
}

const props = defineProps<{
  hookah?: Hookah
  tobaccos?: Tobacco[]
}>()

const selectedTobaccos = ref<Tobacco[]>([])
const rentalHours = ref(4)
const deliveryFee = ref(1500)

const canSelect = computed(() => selectedTobaccos.value.length < 3)

const tobaccoPrice = computed(() => 
  selectedTobaccos.value.reduce((sum, tobacco) => sum + tobacco.price, 0)
)

const totalPrice = computed(() => 
  ((props.hookah?.price || 0) + tobaccoPrice.value) * rentalHours.value + deliveryFee.value
)

const isSelected = (id: string) => 
  selectedTobaccos.value.some(t => t.$id === id)

const toggleTobacco = (tobacco: Tobacco) => {
  const index = selectedTobaccos.value.findIndex(t => t.$id === tobacco.$id)
  if (index !== -1) {
    selectedTobaccos.value.splice(index, 1)
  } else if (canSelect.value) {
    selectedTobaccos.value.push(tobacco)
  }
}

const addToCart = () => {
  if (!props.hookah) return
  const cartStore = useCartStore()

  // Transform data to match CartItem shape expected by cart store and UI
  const hookah = props.hookah
  const hookahPayload = {
    id: hookah && (hookah as any).id ? (hookah as any).id : (hookah.$id ? Math.abs(hashString(hookah.$id)) : Date.now()),
    name: hookah.name,
    brand: hookah.brand,
    price: hookah.price,
    image: hookah.img_url && hookah.img_url[0] ? hookah.img_url[0] : '/placeholder.svg?height=80&width=80',
    size: hookah.size || 'medium'
  }

  const tobaccosPayload = selectedTobaccos.value.map((t) => ({
    id: Math.abs(hashString(t.$id)),
    name: t.name,
    brand: t.brand,
    price: t.price,
    weight: 1
  }))

  const payload: any = {
    hookah: hookahPayload,
    tobaccos: tobaccosPayload,
    rentalHours: rentalHours.value,
    quantity: 1
  }

  cartStore.addItem(payload)
  alert('Добавлено в корзину!')
}

function hashString(str?: string) {
  if (!str) return Date.now()
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}
</script>