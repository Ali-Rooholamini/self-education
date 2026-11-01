import { defineStore } from 'pinia'

export const useBackendHealthStore = defineStore('backend-health', () => {
  const status = ref<'idle' | 'checking' | 'online' | 'offline'>('idle')
  const config = useRuntimeConfig()

  async function check() {
    if (status.value === 'checking') return

    status.value = 'checking'

    try {
      const response = await $fetch<{ status: string }>('/health', {
        baseURL: config.public.apiBase,
        timeout: 5000,
        retry: 0,
      })
      status.value = response.status === 'ok' ? 'online' : 'offline'
    } catch {
      status.value = 'offline'
    }
  }

  return { status, check }
})
