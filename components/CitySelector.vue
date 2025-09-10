<template>
  <ClientOnly>
    <div v-if="store.loaded" class="relative">
      <select
        v-model="selected"
        @change="onChange"
        class="text-sm bg-white/70 backdrop-blur px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 w-full"
      >
        <option value="" disabled>Город</option>
        <option v-for="c in store.cities" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useLocationStore } from '~/stores/location'
const store = useLocationStore()
const selected = ref<string>('')

onMounted(() => { if (store.current) selected.value = store.current })
watch(() => store.current, v => { if (v && v !== selected.value) selected.value = v })
function onChange() { if (selected.value) store.setCity(selected.value) }
</script>
