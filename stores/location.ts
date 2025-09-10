import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// Основные крупные города Казахстана
const CITY_LIST = [
  'Алматы',
  'Астана',
  'Шымкент',
  'Караганда',
  'Актобе',
  'Тараз',
  'Павлодар',
  'Усть-Каменогорск',
  'Семей',
  'Костанай',
  'Кызылорда',
  'Атырау',
  'Актау',
  'Темиртау',
  'Туркестан'
] as const

export type City = typeof CITY_LIST[number]

export const useLocationStore = defineStore('location', () => {
  const cities = ref<string[]>([...CITY_LIST])
  const current = ref<City | null>(null)
  const loaded = ref(false)

  const isSet = computed(() => !!current.value)

  function setCity(city: string) {
    if (cities.value.includes(city)) {
      current.value = city as City
      persist()
    }
  }

  function persist() {
    if (!process.client) return
    try { localStorage.setItem('dym-city', JSON.stringify(current.value)) } catch {}
  }
  function restore() {
    if (!process.client) return
    try {
      const raw = localStorage.getItem('dym-city')
      if (raw) {
        const v = JSON.parse(raw)
        if (cities.value.includes(v)) current.value = v
      }
    } catch {}
    loaded.value = true
  }

  if (process.client) restore()

  watch(current, persist)

  return { cities, current, isSet, loaded, setCity }
})
