import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const mobileMenuOpen = ref(false)

  function openMobileMenu() { mobileMenuOpen.value = true }
  function closeMobileMenu() { mobileMenuOpen.value = false }
  function toggleMobileMenu() { mobileMenuOpen.value = !mobileMenuOpen.value }

  return { mobileMenuOpen, openMobileMenu, closeMobileMenu, toggleMobileMenu }
})
