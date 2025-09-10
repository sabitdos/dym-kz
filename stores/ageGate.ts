import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAgeGateStore = defineStore('ageGate', () => {
  const confirmed = ref<boolean>(false)
  const birthDate = ref<string | null>(null) // ISO YYYY-MM-DD
  const checked = ref<boolean>(false)

  function load() {
    if (!process.client) return
    try {
      const raw = localStorage.getItem('age-gate')
      if (raw) {
        const data = JSON.parse(raw)
        confirmed.value = !!data.confirmed
        birthDate.value = data.birthDate || null
        checked.value = true
      }
    } catch {
      // ignore
    }
  }
  function save() {
    if (!process.client) return
    try { localStorage.setItem('age-gate', JSON.stringify({ confirmed: confirmed.value, birthDate: birthDate.value })) } catch {}
  }

  function evaluate(dateStr: string) {
    const today = new Date()
    const bd = new Date(dateStr)
    if (isNaN(bd.getTime())) return false
    const age = today.getFullYear() - bd.getFullYear() - ( (today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) ? 1 : 0 )
    return age >= 21
  }

  function setBirthDate(dateStr: string) {
    birthDate.value = dateStr
    confirmed.value = evaluate(dateStr)
    save()
  }

  function accept() {
    confirmed.value = true
    save()
  }
  function reject() {
    confirmed.value = false
    birthDate.value = null
    save()
  }

  const isAllowed = computed(() => confirmed.value && (!birthDate.value || evaluate(birthDate.value)))

  if (process.client) load()

  return { confirmed, birthDate, checked, isAllowed, setBirthDate, accept, reject, evaluate, load }
})
