import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// Supported languages
export interface LangOption { code: string; label: string; flag: string }

const LANGS: LangOption[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'kk', label: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', label: 'English', flag: '🇺🇸' }
]

export const useLocaleStore = defineStore('locale', () => {
  const options = ref<LangOption[]>(LANGS)
  const current = ref<LangOption>(LANGS[0])
  const loaded = ref(false)

  const code = computed(() => current.value.code)

  function set(codeOrObj: string | LangOption) {
    const target = typeof codeOrObj === 'string' ? options.value.find(o => o.code === codeOrObj) : codeOrObj
    if (target) {
      current.value = target
      persist()
    }
  }

  function persist() {
    if (!process.client) return
    try { localStorage.setItem('dym-lang', current.value.code) } catch {}
  }
  function restore() {
    if (!process.client) return
    try {
      const raw = localStorage.getItem('dym-lang')
      if (raw) {
        const found = options.value.find(o => o.code === raw)
        if (found) current.value = found
      }
    } catch {}
    loaded.value = true
  }

  if (process.client) restore()
  watch(code, persist)

  return { options, current, code, loaded, set }
})
