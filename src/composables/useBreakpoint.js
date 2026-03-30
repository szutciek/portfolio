import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoint() {
  const deviceType = ref(null)

  const update = () => {
    if (window.innerWidth < 1000) {
      deviceType.value = 'mobile'
    } else {
      deviceType.value = 'desktop'
    }
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { deviceType }
}
