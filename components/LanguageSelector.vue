<template>
  <ClientOnly>
    <div v-if="store.loaded" class="relative">
      <select
        v-model="selected"
        @change="onChange"
        class="text-sm bg-white/70 backdrop-blur pl-2 pr-6 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 appearance-none cursor-pointer w-full"
      >
        <option v-for="l in store.options" :key="l.code" :value="l.code">{{ l.flag }} {{ l.code.toUpperCase() }}</option>
      </select>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useLocaleStore } from '~/stores/locale'
const store = useLocaleStore()
const selected = ref<string>('ru')

onMounted(() => { if (store.current) selected.value = store.current.code })
watch(() => store.code, v => { if (v && v !== selected.value) selected.value = v })
function onChange() { if (selected.value) store.set(selected.value) }
</script>
