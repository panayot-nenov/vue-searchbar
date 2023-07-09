import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target: Window & typeof globalThis, events: any[]) {
  onMounted(() => {
    events.forEach(({ event, cb }) => {
      target.addEventListener(event, cb)
    })
  })

  onUnmounted(() => {
    events.forEach(({ event, cb }) => {
      target.removeEventListener(event, cb)
    })
  })
}
