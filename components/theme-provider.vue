<template>
  <div :class="theme">
    <slot />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const theme = ref('light') // или 'dark'

provide('theme', theme)
</script>
<template>
  <div :class="theme">
    <slot />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const theme = ref('light') // или 'dark'

provide('theme', theme)
</script>