<template>
  <span
    ref="anchor"
    class="image-focus-anchor"
    @click="open"
    data-cursor-target
    data-cursor-offset="10"
  >
    <slot />
  </span>

  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="active" class="image-focus-backdrop" @click="close" />
    </Transition>

    <div
      v-if="cloneVisible"
      ref="flyEl"
      class="image-focus-fly"
      :style="flyStyle"
      @click="active ? close() : null"
    >
      <!-- image mode -->
      <img
        v-if="mediaType === 'image'"
        class="image-focus-fly__media"
        :src="mediaSrc"
        :alt="mediaAlt"
        draggable="false"
      />

      <!-- video mode -->
      <video
        v-else-if="mediaType === 'video'"
        ref="flyVideo"
        class="image-focus-fly__media"
        :src="mediaSrc"
        :poster="mediaPoster"
        playsinline
        autoplay
        loop
        :muted="mediaMuted"
        draggable="false"
      />

      <Transition name="caption">
        <div v-if="text && settled" class="image-focus-fly__caption">
          <p>{{ text }}</p>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
})

/* ─── state ──────────────────────────────────────────────── */
const anchor = ref(null)
const flyEl = ref(null)
const flyVideo = ref(null) // ref to the <video> inside the fly shell
const active = ref(false)
const cloneVisible = ref(false)
const settled = ref(false)

// media
const mediaType = ref('image') // 'image' | 'video'
const mediaSrc = ref('')
const mediaAlt = ref('')
const mediaPoster = ref('')
const mediaMuted = ref(true)

const flyStyle = reactive({
  left: '0px',
  top: '0px',
  width: '0px',
  height: '0px',
})

/* ─── media element helpers ──────────────────────────────── */
function getMediaEl() {
  return anchor.value?.querySelector('img, video') ?? null
}

function getMediaRect() {
  const el = getMediaEl()
  return el?.getBoundingClientRect() ?? anchor.value?.getBoundingClientRect()
}

/** Natural pixel dimensions of img or video */
function getNaturalSize(el) {
  if (el.tagName === 'IMG') {
    return {
      w: el.naturalWidth || el.getBoundingClientRect().width,
      h: el.naturalHeight || el.getBoundingClientRect().height,
    }
  }
  // video: prefer videoWidth (intrinsic), fall back to rendered size
  return {
    w: el.videoWidth || el.getBoundingClientRect().width,
    h: el.videoHeight || el.getBoundingClientRect().height,
  }
}

/* ─── geometry ───────────────────────────────────────────── */
function targetRect(nw, nh) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const scale = Math.min((vw * 0.9) / nw, (vh * 0.9) / nh, 1)
  const w = nw * scale
  const h = nh * scale
  return { x: (vw - w) / 2, y: (vh - h) / 2, w, h }
}

/* ─── animation ──────────────────────────────────────────── */
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
function lerp(a, b, t) {
  return a + (b - a) * t
}

function flyTo(toRect, { duration = 500, arcHeight = 80, onDone = () => {} } = {}) {
  const el = flyEl.value
  if (!el) return
  if (el._raf) cancelAnimationFrame(el._raf)

  const cr = el.getBoundingClientRect()
  const x0 = cr.left,
    y0 = cr.top,
    w0 = cr.width,
    h0 = cr.height
  const x2 = toRect.x,
    y2 = toRect.y,
    w2 = toRect.w,
    h2 = toRect.h
  const bx = (x0 + x2) / 2
  const by = (y0 + y2) / 2 - arcHeight
  const t0 = performance.now()

  function tick(now) {
    const raw = Math.min((now - t0) / duration, 1)
    const t = easeInOut(raw),
      u = 1 - t
    el.style.left = `${u * u * x0 + 2 * u * t * bx + t * t * x2}px`
    el.style.top = `${u * u * y0 + 2 * u * t * by + t * t * y2}px`
    el.style.width = `${lerp(w0, w2, t)}px`
    el.style.height = `${lerp(h0, h2, t)}px`
    if (raw < 1) {
      el._raf = requestAnimationFrame(tick)
    } else {
      el._raf = null
      onDone()
    }
  }
  el._raf = requestAnimationFrame(tick)
}

function toFullSrc(src) {
  // /assets/hero/bg.avif        → /assets/hero/bg-full.avif
  // /assets/intro-compressed.webm → /assets/intro-full.webm
  return src.replace(/-compressed\.webm$/, '-full.webm').replace(/\.avif$/, '-full.avif')
}

/* ─── open / close ───────────────────────────────────────── */
async function open() {
  if (active.value) return
  const media = getMediaEl()
  if (!media) return

  const tag = media.tagName

  // Populate fly shell state
  if (tag === 'IMG') {
    mediaType.value = 'image'
    mediaSrc.value = toFullSrc(media.src)
    mediaAlt.value = media.alt
  } else {
    mediaType.value = 'video'
    mediaSrc.value = toFullSrc(media.currentSrc || media.src)
    mediaPoster.value = media.poster || ''
    mediaMuted.value = media.muted
  }

  // Snap shell to source
  const srcRect = getMediaRect()
  Object.assign(flyStyle, {
    left: `${srcRect.left}px`,
    top: `${srcRect.top}px`,
    width: `${srcRect.width}px`,
    height: `${srcRect.height}px`,
  })

  settled.value = false
  cloneVisible.value = true
  hideOriginal(true)

  await nextTick()

  // For video: seek fly shell to same timestamp and resume
  if (tag === 'VIDEO' && flyVideo.value) {
    flyVideo.value.currentTime = media.currentTime
    flyVideo.value.play().catch(() => {})
    media.pause()
  }

  active.value = true

  const { w: nw, h: nh } = getNaturalSize(media)
  flyTo(targetRect(nw, nh), {
    arcHeight: -80,
    duration: 540,
    onDone: () => {
      settled.value = true
    },
  })
}

function close() {
  if (!active.value) return
  active.value = false
  settled.value = false

  const destRect = getMediaRect()

  flyTo(
    { x: destRect.left, y: destRect.top, w: destRect.width, h: destRect.height },
    {
      arcHeight: 80,
      duration: 460,
      onDone: () => {
        // Hand playback back to the original video
        const media = getMediaEl()
        if (media?.tagName === 'VIDEO' && flyVideo.value) {
          media.currentTime = flyVideo.value.currentTime
          media.play().catch(() => {})
        }
        cloneVisible.value = false
        hideOriginal(false)
      },
    },
  )
}

function hideOriginal(hide) {
  const el = getMediaEl()
  if (el) el.style.opacity = hide ? '0' : ''
}

/* ─── keyboard ───────────────────────────────────────────── */
function onKey(e) {
  if (e.key === 'Escape' && active.value) close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.image-focus-anchor {
  display: inline-block;
  cursor: zoom-in;
  line-height: 0;
}

.image-focus-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9998;
  cursor: zoom-out;
}
.backdrop-enter-active {
  transition: opacity 0.28s ease;
}
.backdrop-leave-active {
  transition: opacity 0.36s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.image-focus-fly {
  position: fixed;
  z-index: 9999;
  margin: 0;
  padding: 0;
  cursor: zoom-out;
  overflow: hidden;
  will-change: left, top, width, height;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
}

.image-focus-fly__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  user-select: none;
}

.image-focus-fly__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 16px 14px;
  background: linear-gradient(to top, #000b 0%, #0000 100%);
  pointer-events: none;
  user-select: none;
}
.image-focus-fly__caption p {
  color: #fff;
}

.caption-enter-active {
  transition: opacity 0.3s ease 0.05s;
}
.caption-leave-active {
  transition: opacity 0.15s ease;
}
.caption-enter-from,
.caption-leave-to {
  opacity: 0;
}
</style>
