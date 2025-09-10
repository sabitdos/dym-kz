import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { CartItem } from "~/types"

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([])
  const deliveryFee = ref(1500)
  const isLoading = ref(false)

  // Computed properties
  const itemsCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const uniqueItemsCount = computed(() => items.value.length)

  const subtotal = computed(() =>
    items.value.reduce((total, item) => {
      const hookahPrice = item.hookah.price * item.rentalHours
      const tobaccoPrice = item.tobaccos.reduce((sum, t) => sum + t.price * t.weight, 0) * item.rentalHours
      return total + (hookahPrice + tobaccoPrice) * item.quantity
    }, 0),
  )

  const total = computed(() => subtotal.value + deliveryFee.value)
  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const addItem = (item: Omit<CartItem, "id" | "addedAt">) => {
    const cartItem: CartItem = {
      ...item,
      id: generateId(),
      addedAt: new Date().toISOString(),
    }

    // Проверяем, есть ли уже такой товар
    const existingIndex = items.value.findIndex(
      (existing) =>
        existing.hookah.id === item.hookah.id &&
        existing.rentalHours === item.rentalHours &&
        JSON.stringify(existing.tobaccos) === JSON.stringify(item.tobaccos),
    )

    if (existingIndex !== -1) {
      items.value[existingIndex].quantity += item.quantity
    } else {
      items.value.push(cartItem)
    }

    saveToStorage()
  }

  const removeItem = (itemId: string) => {
    const index = items.value.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find((item) => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId)
      } else {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }

  const clearCart = () => {
    items.value = []
    saveToStorage()
  }

  const getItemPrice = (item: CartItem) => {
    const hookahPrice = item.hookah.price * item.rentalHours
    const tobaccoPrice = item.tobaccos.reduce((sum, t) => sum + t.price * t.weight, 0) * item.rentalHours
    return (hookahPrice + tobaccoPrice) * item.quantity
  }

  // Storage functions
  const saveToStorage = () => {
    if (process.client) {
      localStorage.setItem("dym-cart", JSON.stringify(items.value))
    }
  }

  const loadFromStorage = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem("dym-cart")
        if (stored) {
          items.value = JSON.parse(stored)
        }
      } catch (error) {
        console.error("Error loading cart from storage:", error)
        items.value = []
      }
    }
  }

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const getItemById = (itemId: string) => {
    return items.value.find((item) => item.id === itemId)
  }

  // Initialize
  if (process.client) {
    loadFromStorage()
  }

  return {
    // State
    items,
    deliveryFee,
    isLoading,

    // Getters
    itemsCount,
    uniqueItemsCount,
    subtotal,
    total,
    isEmpty,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemPrice,
    getItemById,
    loadFromStorage,
    saveToStorage,
  }
})
