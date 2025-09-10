import { ref, readonly } from "vue"

const isOpen = ref(false)

export const useCartSidebar = () => {
  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen: readonly(isOpen),
    open,
    close,
    toggle,
  }
}
