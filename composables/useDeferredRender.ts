import { ref, onMounted, onBeforeUnmount } from 'vue'

interface DeferredOptions {
  rootMargin?: string
  threshold?: number | number[]
  immediate?: boolean
}

export function useDeferredRender(options: DeferredOptions = {}) {
  const { rootMargin = '0px 0px -50px 0px', threshold = 0, immediate = false } = options
  const target = ref<HTMLElement | null>(null)
  const render = ref<boolean>(immediate)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (render.value) return
    if (!('IntersectionObserver' in window)) {
      render.value = true
      return
    }
    observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          render.value = true
          if (observer) {
            observer.disconnect()
            observer = null
          }
          break
        }
      }
    }, { rootMargin, threshold })
    if (target.value) observer.observe(target.value)
  })

  onBeforeUnmount(() => {
    if (observer) observer.disconnect()
  })

  return { target, render }
}
