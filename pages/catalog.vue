<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row gap-8">
      <aside class="w-full md:w-64 space-y-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="font-semibold mb-4">Фильтры</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Цена</label>
              <div class="flex gap-2">
                <input
                  v-model="filters.minPrice"
                  type="number"
                  placeholder="От"
                  class="w-full px-3 py-2 border rounded-lg"
                >
                <input
                  v-model="filters.maxPrice"
                  type="number"
                  placeholder="До"
                  class="w-full px-3 py-2 border rounded-lg"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Бренд</label>
              <select
                v-model="filters.brand"
                class="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Все бренды</option>
                <option value="khalil-mamoon">Khalil Mamoon</option>
                <option value="starbuzz">Starbuzz</option>
                <option value="amy-deluxe">Amy Deluxe</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Рейтинг</label>
              <select
                v-model="filters.rating"
                class="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Любой рейтинг</option>
                <option value="4">4+ звезд</option>
                <option value="4.5">4.5+ звезд</option>
              </select>
            </div>
          </div>

          <button
            @click="resetFilters"
            class="w-full mt-4 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
          >
            Сбросить фильтры
          </button>
        </div>
      </aside>

      <main class="flex-1">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Каталог кальянов</h1>
          <select
            v-model="sortBy"
            class="px-3 py-2 border rounded-lg"
          >
            <option value="name">По названию</option>
            <option value="price-asc">По цене (возр.)</option>
            <option value="price-desc">По цене (убыв.)</option>
            <option value="rating">По рейтингу</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HookahCard
            v-for="hookah in filteredHookahs"
            :key="hookah.id"
            :hookah="hookah"
          />
        </div>

        <div v-if="filteredHookahs.length === 0" class="text-center py-12">
          <p class="text-gray-500">Кальяны не найдены</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead } from '#imports'
import HookahCard from '~/components/HookahCard.vue'

useHead({
  title: 'Каталог кальянов - Dym.kz',
  meta: [
    { name: 'description', content: 'Большой выбор кальянов для аренды в Алматы. Khalil Mamoon, Starbuzz, Amy Deluxe и другие бренды.' }
  ]
})

const filters = ref({
  minPrice: '',
  maxPrice: '',
  brand: '',
  rating: ''
})

const sortBy = ref('name')

const hookahs = ref([
  {
    id: 1,
    name: 'Khalil Mamoon Classic',
    price: 3000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.8,
    brand: 'khalil-mamoon',
    description: 'Классический египетский кальян'
  },
  {
    id: 2,
    name: 'Starbuzz Premium',
    price: 3500,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.9,
    brand: 'starbuzz',
    description: 'Премиальный американский кальян'
  },
  {
    id: 3,
    name: 'Amy Deluxe Gold',
    price: 2800,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.7,
    brand: 'amy-deluxe',
    description: 'Немецкое качество и стиль'
  }
])

const filteredHookahs = computed(() => {
  let result = [...hookahs.value]

  // Фильтрация по цене
  if (filters.value.minPrice) {
    result = result.filter(h => h.price >= parseInt(filters.value.minPrice))
  }
  if (filters.value.maxPrice) {
    result = result.filter(h => h.price <= parseInt(filters.value.maxPrice))
  }

  // Фильтрация по бренду
  if (filters.value.brand) {
    result = result.filter(h => h.brand === filters.value.brand)
  }

  // Фильтрация по рейтингу
  if (filters.value.rating) {
    result = result.filter(h => h.rating >= parseFloat(filters.value.rating))
  }

  // Сортировка
  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    default:
      result.sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})

const resetFilters = () => {
  filters.value = {
    minPrice: '',
    maxPrice: '',
    brand: '',
    rating: ''
  }
}
</script>
