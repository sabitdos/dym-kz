<template>
  <div>
    <section class="relative overflow-hidden">
      <!-- Background image -->
      <NuxtImg 
        src="/placeholder.png" 
        alt="Аренда премиальных кальянов"
        format="webp" 
        quality="70" 
        class="absolute inset-0 w-full h-full object-cover object-center" />
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      <div class="relative container mx-auto px-4 py-24 md:py-32">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="text-white">
            <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Раскачай <span class="text-sky-400">свой вечер</span>
            </h1>
            <p class="text-xl md:text-2xl font-light mb-8 max-w-xl">
              Премуим кальяны в аренду с доставкой — свежий табак, чистые колбы и быстрая подача.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
              <NuxtLink
                to="/catalog"
                class="inline-flex justify-center bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg shadow-sky-900/30 transition"
              >
                Выбрать кальян
              </NuxtLink>
              <NuxtLink
                to="/order"
                class="inline-flex justify-center backdrop-blur bg-white/15 hover:bg-white/25 text-white px-8 py-3 rounded-lg font-medium text-lg border border-white/30 transition"
              >
                Быстрый заказ
              </NuxtLink>
            </div>
            <div class="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                Гигиеническая подготовка
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                Премиальный табак
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                Доставка за 60 минут
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <!-- Optional foreground image / composition -->
            <div class="relative w-full max-w-md ml-auto">
              <div class="aspect-[3/4] rounded-3xl overflow-hidden ring-4 ring-white/10 shadow-2xl shadow-black/40">
                <NuxtImg src="/placeholder-logo.png" alt="Dym.kz" class="w-full h-full object-contain bg-black/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Популярные кальяны</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <HookahCard
            v-for="hookah in popularHookahs"
            :key="hookah.id"
            :hookah="hookah"
          />
        </div>
      </div>
    </section>

    <section class="bg-gray-100 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Калькулятор стоимости</h2>
        <OrderCalculator />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '#imports'
import HookahCard from '~/components/HookahCard.vue'
import OrderCalculator from '~/components/OrderCalculator.vue'


useHead({
  title: 'Dym.kz - Аренда кальянов в Алматы',
  meta: [
  { name: 'description', content: 'Премиум кальяны с доставкой по Алматы. Быстрая доставка, качественные кальяны, доступные цены.' }
  ]
})

const popularHookahs = ref([
  {
    id: 1,
    name: 'Khalil Mamoon',
    price: 3000,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.8,
    description: 'Классический египетский кальян'
  },
  {
    id: 2,
    name: 'Starbuzz',
    price: 3500,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.9,
    description: 'Премиальный американский кальян'
  },
  {
    id: 3,
    name: 'Amy Deluxe',
    price: 2800,
    image: '/placeholder.svg?height=300&width=300',
    rating: 4.7,
    description: 'Немецкое качество и стиль'
  }
])
</script>
