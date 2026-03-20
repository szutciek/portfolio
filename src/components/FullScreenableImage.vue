<template>
  <span ref="anchor" class="image-focus-anchor" @click="open" data-cursor-target>
    <slot />
  </span>

  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="active" class="image-focus-backdrop" @click="close" />
    </Transition>

    <div
      v-if="cloneVisible"
      ref="flyEl"
      class="image-focus-clone"
      :style="cloneStyle"
      @click="active ? close() : null"
    >
      <img :src="imgSrc" :alt="imgAlt" draggable="false" />
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'

/* ─── state ─────────────────────────────────────────────── */
const anchor = ref(null) // the slot wrapper
const flyEl = ref(null) // the flying clone
const active = ref(false)
const cloneVisible = ref(false)

const imgSrc = ref('')
const imgAlt = ref('')

const cloneStyle = reactive({
  left: '0px',
  top: '0px',
  width: '0px',
  height: '0px',
  transform: 'none',
  transition: 'none',
  borderRadius: '0px',
})

/* ─── helpers ────────────────────────────────────────────── */
function getImgEl() {
  return anchor.value?.querySelector('img') ?? null
}

function getRect() {
  const img = getImgEl()
  return img ? img.getBoundingClientRect() : anchor.value?.getBoundingClientRect()
}

/** Compute the "open" target: centred, max 90vw × 90vh, aspect-preserved */
function targetRect(naturalW, naturalH) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxW = vw * 0.9
  const maxH = vh * 0.9
  const scale = Math.min(maxW / naturalW, maxH / naturalH, 1)
  const w = naturalW * scale
  const h = naturalH * scale
  return { x: (vw - w) / 2, y: (vh - h) / 2, w, h }
}

/** Place the clone at the source rect, no transition */
function placeAtSource(r) {
  cloneStyle.transition = 'none'
  cloneStyle.left = `${r.left}px`
  cloneStyle.top = `${r.top}px`
  cloneStyle.width = `${r.width}px`
  cloneStyle.height = `${r.height}px`
  cloneStyle.transform = 'none'
  cloneStyle.borderRadius = '0px'
}

/**
 * Cubic ease-in-out: smooth acceleration and deceleration.
 * t ∈ [0,1] → [0,1]
 */
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Animate the clone from its current rendered position to `toRect`
 * along a smooth quadratic Bézier arc driven by requestAnimationFrame.
 *
 * X and Y are computed from the same Bézier control points so the path
 * is a true curve, not a V-shape. The global progress is eased with a
 * cubic ease-in-out so motion feels physical, not mechanical.
 *
 * Bézier: P(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
 *   P0 = start, P1 = control point (arc apex), P2 = end
 */
function flyTo(fromRect, toRect, opts = {}) {
  const { duration = 520, arcHeight = 80, onDone = () => {} } = opts

  const el = flyEl.value
  if (!el) return

  // Cancel any in-progress rAF loop
  if (el._flyRaf) cancelAnimationFrame(el._flyRaf)

  const cr = el.getBoundingClientRect()

  // Start values
  const x0 = cr.left,
    y0 = cr.top
  const w0 = cr.width,
    h0 = cr.height

  // End values
  const x2 = toRect.x,
    y2 = toRect.y
  const w2 = toRect.w,
    h2 = toRect.h

  // Bézier control point: horizontally centred, vertically offset for the arc
  const cx = (x0 + x2) / 2
  const cy = (y0 + y2) / 2 - arcHeight

  el.style.transition = 'none'

  const startTime = performance.now()

  function tick(now) {
    const raw = Math.min((now - startTime) / duration, 1)
    const t = easeInOut(raw) // smoothed progress
    const u = 1 - t

    // Quadratic Bézier for position
    const x = u * u * x0 + 2 * u * t * cx + t * t * x2
    const y = u * u * y0 + 2 * u * t * cy + t * t * y2

    // Linear interpolation for size (no arc needed)
    const w = w0 + (w2 - w0) * t
    const h = h0 + (h2 - h0) * t

    el.style.left = `${x}px`
    el.style.top = `${y}px`
    el.style.width = `${w}px`
    el.style.height = `${h}px`

    if (raw < 1) {
      el._flyRaf = requestAnimationFrame(tick)
    } else {
      el._flyRaf = null
      onDone()
    }
  }

  el._flyRaf = requestAnimationFrame(tick)
}

/* ─── open / close ───────────────────────────────────────── */
async function open() {
  if (active.value) return

  const img = getImgEl()
  if (!img) return

  imgSrc.value = img.src
  imgAlt.value = img.alt

  const srcRect = getRect()
  placeAtSource(srcRect)
  cloneVisible.value = true
  hideOriginal(true)

  await nextTick()

  const naturalW = img.naturalWidth || srcRect.width
  const naturalH = img.naturalHeight || srcRect.height
  const dest = targetRect(naturalW, naturalH)

  active.value = true // show backdrop

  flyTo(srcRect, dest, {
    opening: true,
    arcHeight: -70, // arc upward on open
    duration: 540,
  })
}

async function close() {
  if (!active.value) return
  active.value = false // start fading backdrop

  // Re-query the original's current rect (it may have scrolled)
  const dest = getRect()

  const flyRect = flyEl.value?.getBoundingClientRect()

  flyTo(
    flyRect,
    { x: dest.left, y: dest.top, w: dest.width, h: dest.height },
    {
      opening: false,
      arcHeight: 70, // arc downward on close
      duration: 460,
      onDone: () => {
        cloneVisible.value = false
        hideOriginal(false)
      },
    },
  )
}

function hideOriginal(hide) {
  const img = getImgEl()
  if (img) img.style.opacity = hide ? '0' : ''
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
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 9998;
  cursor: zoom-out;
}

/* backdrop fade */
.backdrop-enter-active {
  transition: opacity 0.3s ease;
}
.backdrop-leave-active {
  transition: opacity 0.4s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.image-focus-clone {
  position: fixed;
  z-index: 9999;
  margin: 0;
  padding: 0;
  pointer-events: auto;
  cursor: zoom-out;
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  will-change: left, top, width, height;
  overflow: hidden;
}

.image-focus-clone img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  pointer-events: none;
  user-select: none;
}
</style>
