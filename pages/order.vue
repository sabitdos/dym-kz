<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">Оформление заказа</h1>
    
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <!-- Выбор кальяна -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Выберите кальян</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div 
            v-for="hookah in hookahs" 
            :key="hookah.id"
            @click="selectedHookah = hookah"
            class="border rounded-lg p-4 cursor-pointer transition-all"
            :class="selectedHookah?.id === hookah.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <div class="flex items-center gap-4">
              <img :src="hookah.image" :alt="hookah.name" class="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h3 class="font-semibold">{{ hookah.name }}</h3>
                <p class="text-sm text-gray-600">{{ hookah.brand }}</p>
                <p class="text-lg font-bold text-purple-600">{{ hookah.price }} ₸/час</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Выбор табака -->
      <div class="mb-8" v-if="selectedHookah">
        <h2 class="text-2xl font-bold mb-4">Выберите табак (до 3 вкусов)</h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div 
            v-for="tobacco in tobaccos" 
            :key="tobacco.id"
            class="border rounded-lg p-4"
            :class="isSelected(tobacco.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200'"
          >
            <h3 class="font-medium">{{ tobacco.name }}</h3>
            <p class="text-sm text-gray-600">{{ tobacco.brand }}</p>
            <p class="text-sm font-semibold">{{ tobacco.price }} ₸/г</p>
            <label class="flex items-center mt-2">
              <input
                type="checkbox"
                :checked="isSelected(tobacco.id)"
                @change="toggleTobacco(tobacco)"
                :disabled="!canSelect && !isSelected(tobacco.id)"
                class="mr-2"
              />
              Выбрать
            </label>
          </div>
        </div>
      </div>

      <!-- Время аренды -->
      <div class="mb-8" v-if="selectedHookah && selectedTobaccos.length > 0">
        <h2 class="text-2xl font-bold mb-4">Время аренды</h2>
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

      <!-- Расчет стоимости -->
      <div v-if="selectedHookah && selectedTobaccos.length > 0" class="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold mb-3">Расчет стоимости</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Кальян × {{ rentalHours }}ч:</span>
            <span>{{ (selectedHookah.price * rentalHours).toLocaleString() }} ₸</span>
          </div>
          <div class="flex justify-between">
            <span>Табак × {{ rentalHours }}ч:</span>
            <span>{{ (tobaccoPrice * rentalHours).toLocaleString() }} ₸</span>
          </div>
          <div class="flex justify-between">
            <span>Доставка:</span>
            <span>1,500 ₸</span>
          </div>
          <hr class="my-2">
          <div class="flex justify-between text-lg font-semibold">
            <span>Итого:</span>
            <span class="text-purple-600">{{ totalPrice.toLocaleString() }} ₸</span>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div v-if="selectedHookah && selectedTobaccos.length > 0" class="flex gap-4">
        <button
          @click="addToCart"
          class="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700"
        >
          Добавить в корзину
        </button>
        <button
          @click="orderNow"
          class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700"
        >
          Заказать сейчас
        </button>
      </div>

      <!-- Сообщение об успехе -->
      <div v-if="showSuccess" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

// Данные
const selectedHookah = ref(null)
const selectedTobaccos = ref([])
const rentalHours = ref(4)
const showSuccess = ref(false)
const successMessage = ref('')

const hookahs = [
  {
    id: 1,
    name: 'Khalil Mamoon Classic',
    brand: 'Khalil Mamoon',
    price: 2500,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: 2,
    name: 'Starbuzz Carbine',
    brand: 'Starbuzz',
    price: 3200,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: 3,
    name: 'Amy Deluxe',
    brand: 'Amy',
    price: 2800,
    image: '/placeholder.svg?height=200&width=200'
  }
]

const tobaccos = [
  { id: 1, name: 'Double Apple', brand: 'Al Fakher', price: 800 },
  { id: 2, name: 'Mint', brand: 'Adalya', price: 750 },
  { id: 3, name: 'Grape', brand: 'Tangiers', price: 900 },
  { id: 4, name: 'Lemon Mint', brand: 'Al Fakher', price: 850 },
  { id: 5, name: 'Blueberry', brand: 'Darkside', price: 950 },
  { id: 6, name: 'Peach', brand: 'Adalya', price: 820 }
]

// Вычисляемые свойства
const canSelect = computed(() => selectedTobaccos.value.length < 3)

const tobaccoPrice = computed(() => 
  selectedTobaccos.value.reduce((sum, tobacco) => sum + tobacco.price, 0)
)

const totalPrice = computed(() => {
  if (!selectedHookah.value) return 0
  return (selectedHookah.value.price + tobaccoPrice.value) * rentalHours.value + 1500
})

// Методы
const isSelected = (tobaccoId) => {
  return selectedTobaccos.value.some(t => t.id === tobaccoId)
}

const toggleTobacco = (tobacco) => {
  const index = selectedTobaccos.value.findIndex(t => t.id === tobacco.id)
  
  if (index !== -1) {
    selectedTobaccos.value.splice(index, 1)
  } else if (canSelect.value) {
    selectedTobaccos.value.push(tobacco)
  }
}

const addToCart = () => {
  if (!selectedHookah.value || selectedTobaccos.value.length === 0) return
  
  cartStore.addItem({
    hookah: {
      id: selectedHookah.value.id,
      name: selectedHookah.value.name,
      brand: selectedHookah.value.brand,
      price: selectedHookah.value.price,
      image: selectedHookah.value.image,
      size: 'medium'
    },
    tobaccos: selectedTobaccos.value.map(tobacco => ({
      id: tobacco.id,
      name: tobacco.name,
      brand: tobacco.brand,
      price: tobacco.price,
      weight: 1
    })),
    rentalHours: rentalHours.value,
    quantity: 1
  })
  
  showSuccess.value = true
  successMessage.value = 'Товар добавлен в корзину!'
  setTimeout(() => showSuccess.value = false, 3000)
}

const orderNow = () => {
  showSuccess.value = true
  successMessage.value = `Заказ оформлен! Итого: ${totalPrice.value.toLocaleString()} ₸`
  setTimeout(() => showSuccess.value = false, 5000)
}
</script>
