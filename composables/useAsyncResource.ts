import { ref } from 'vue'
import { withTiming } from '~/utils/metrics'

export interface AsyncResource<T, A extends any[] = []> {
  loading: Readonly<{ value: boolean }>
  loaded: Readonly<{ value: boolean }>
  error: Readonly<{ value: string | null }>
  data: Readonly<{ value: T | null }>
  load: (...args: A) => Promise<T | null>
  reset: () => void
}

export function useAsyncResource<T, A extends any[] = []>(loader: (...args: A) => Promise<T>, opts?: { label?: string; metrics?: boolean }): AsyncResource<T, A> {
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)
  const data = ref<T | null>(null)

  async function load(...args: A): Promise<T | null> {
    if (loading.value) return data.value
    loading.value = true
    error.value = null
    try {
  const exec = () => loader(...args)
  const result = opts?.metrics && opts.label ? await withTiming(opts.label, exec) : await exec()
      data.value = result
      loaded.value = true
      return result
    } catch (e: any) {
      error.value = e?.message || 'Failed to load'
      return null
    } finally {
      loading.value = false
    }
  }

  function reset() {
    data.value = null
    loaded.value = false
    error.value = null
  }

  // final return with explicit readonly casting
  return {
    loading: loading as unknown as Readonly<{ value: boolean }>,
    loaded: loaded as unknown as Readonly<{ value: boolean }>,
    error: error as unknown as Readonly<{ value: string | null }>,
    data: data as unknown as Readonly<{ value: T | null }>,
    load,
    reset
  }
}
