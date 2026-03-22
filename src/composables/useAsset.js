import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * useAsset
 *
 * Observes the rendered width of an asset's DOM element.
 * When it exceeds `fullscreenThreshold`, the URL is updated to ?asset=<id>,
 * which switches the src to the high-res variant. Reverts when it shrinks back.
 *
 * Usage:
 *   const { avif, fallback, elRef } = useAsset('/assets/hero/bg', 'image', 'hero-bg')
 *   <img :src="fallback" ref="elRef" />
 */

const DEFAULT_THRESHOLD = 1024 // px — tune per project

export function useAsset(basePath, type, id, fullscreenThreshold = DEFAULT_THRESHOLD) {
  const route = useRoute()
  const router = useRouter()

  const elRef = (ref < HTMLElement) | (null > null)
  const isFullscreen = computed(() => route.query.asset === id)

  // ── URL helpers ───────────────────────────────────────────────────────────

  function setFullscreen(active) {
    const query = { ...route.query }

    if (active && query.asset !== id) {
      router.replace({ query: { ...query, asset: id } })
    } else if (!active && query.asset === id) {
      delete query.asset
      router.replace({ query })
    }
  }

  // ── ResizeObserver ────────────────────────────────────────────────────────

  let observer = null

  function observe(el) {
    observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setFullscreen(width >= fullscreenThreshold)
    })
    observer.observe(el)
  }

  onMounted(() => {
    if (elRef.value) observe(elRef.value)
  })

  // If elRef is set after mount (e.g. inside a v-if), start observing then
  watch(elRef, (el, prevEl) => {
    if (prevEl) observer?.unobserve(prevEl)
    if (el) observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
    // Clean up URL if this asset was fullscreen when the component unmounts
    if (isFullscreen.value) setFullscreen(false)
  })

  // ── Image ─────────────────────────────────────────────────────────────────

  if (type === 'image') {
    const avif = computed(() => (isFullscreen.value ? `${basePath}-full.avif` : `${basePath}.avif`))
    const fallback = `${basePath}.png`
    return { avif, fallback, isFullscreen, elRef }
  }

  // ── Video ─────────────────────────────────────────────────────────────────

  const src = computed(() =>
    isFullscreen.value ? `${basePath}-full.webm` : `${basePath}-compressed.webm`,
  )

  return { src, isFullscreen, elRef }
}
