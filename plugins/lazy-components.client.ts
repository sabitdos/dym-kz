import { defineNuxtPlugin } from '#app'
import { defineAsyncComponent } from 'vue'

// Simple helper to register dynamic components used rarely (admin widgets, charts, etc.)
export default defineNuxtPlugin((nuxtApp) => {
  const globals: Record<string, () => Promise<any>> = {
    AdminChartCard: () => import('~/components/admin/ChartCard.vue'),
    AdminKpiCard: () => import('~/components/admin/KpiCard.vue')
  }
  for (const [name, loader] of Object.entries(globals)) {
    nuxtApp.vueApp.component(name, defineAsyncComponent(loader))
  }
})
