<template>
  <div class="brand-carousel relative py-6">
    <h4 class="text-sm uppercase tracking-wider text-gray-400 mb-4 font-semibold text-center">Бренды табака, кальянов и аксессуаров</h4>
    <div class="overflow-hidden group">
      <div class="flex gap-8 animate-scroll-x will-change-transform" :style="{ '--speed': speed + 's' }">
        <template v-for="n in 2" :key="n">
          <div v-for="b in brands" :key="b.name + '-' + n" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm hover:bg-white/10 transition min-w-fit">
            <img v-if="b.logo" :src="b.logo" :alt="b.name" class="h-8 w-auto object-contain" />
            <span v-else class="text-[13px] font-medium text-gray-200 whitespace-nowrap">{{ b.name }}</span>
            <span class="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 tracking-wide uppercase">{{ b.cat }}</span>
          </div>
        </template>
      </div>
      <!-- gradient edges -->
      <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-800 to-transparent"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-800 to-transparent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Brand { name: string; cat: string; logo?: string }

const speed = 40 // seconds for full loop

// Placeholder brands; replace logo paths with real ones in /public/brands
const brands: Brand[] = [
  { name: 'Darkside', cat: 'tobacco' },
  { name: 'Tangiers', cat: 'tobacco' },
  { name: 'Must Have', cat: 'tobacco' },
  { name: 'Fumari', cat: 'tobacco' },
  { name: 'Nakhla', cat: 'tobacco' },
  { name: 'Serbetli', cat: 'tobacco' },
  { name: 'Khalil Mamoon', cat: 'hookah' },
  { name: 'Amy Deluxe', cat: 'hookah' },
  { name: 'Starbuzz', cat: 'hookah' },
  { name: 'Hoob', cat: 'hookah' },
  { name: 'MattPear', cat: 'hookah' },
  { name: 'Japona', cat: 'bowls' },
  { name: 'Upgrade Form', cat: 'bowls' },
  { name: 'Koloud', cat: 'accessories' },
  { name: 'Cocobrico', cat: 'coals' },
  { name: 'Coco Nara', cat: 'coals' },
  { name: 'BlackBurn', cat: 'tobacco' },
  { name: 'Al Fakher', cat: 'tobacco' },
  { name: 'Maklaud', cat: 'hookah' },
]
</script>

<style scoped>
@keyframes scroll-x {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.brand-carousel .animate-scroll-x {
  animation: scroll-x var(--speed,40s) linear infinite;
}
.brand-carousel .group:hover .animate-scroll-x {
  animation-play-state: paused;
}
</style>
