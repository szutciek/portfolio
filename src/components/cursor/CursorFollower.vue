<template>
  <div
    v-if="enabled"
    class="cursorRoot"
    aria-hidden="true"
    :style="{
      '--cx': `${Math.round(current.x)}px`,
      '--cy': `${Math.round(current.y)}px`,
      '--cw': `${Math.round(current.w)}px`,
      '--ch': `${Math.round(current.h)}px`,
      '--cr': `${Math.round(current.r)}px`,
      '--cop': `${current.opacity}`,
      '--cbg': current.bg,
      '--cscale': `${current.scale}`,
    }"
  >
    <div class="cursorShape" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive } from 'vue'

const opts = {
  baseSize: 28,
  baseOpacity: 0.9,
  baseBg: 'rgba(255, 255, 255, 0.22)',
  baseLerp: 0.14,
  morphLerp: 0.18,
  morphDistance: 90,
  morphPadding: 10,
  morphOpacity: 0.95,
  morphScale: 1,
}

const current = reactive({
  x: 0,
  y: 0,
  w: opts.baseSize,
  h: opts.baseSize,
  r: 999,
  opacity: opts.baseOpacity,
  bg: opts.baseBg,
  scale: 1,
})

const target = reactive({ ...current })

let raf = 0
let lastPointer = { x: 0, y: 0, hadMove: false }
let candidates = []
let lastCandidatesRefresh = 0
let mutationObserver = null

const enabled = computed(() => {
  if (typeof window === 'undefined') return false
  const fine = window.matchMedia?.('(pointer:fine)').matches ?? true
  const hover = window.matchMedia?.('(hover:hover)').matches ?? true
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  return fine && hover && !reduce
})

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n))
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function parseNumber(v, fallback) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function elementDistanceToPoint(rect, x, y) {
  const dx = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0
  const dy = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0
  return Math.hypot(dx, dy)
}

function refreshCandidates(force = false) {
  const now = performance.now()
  if (!force && now - lastCandidatesRefresh < 200) return
  lastCandidatesRefresh = now

  const selector =
    '[data-cursor-morph], a[href], button, [role="button"], input, textarea, select, summary'
  candidates = Array.from(document.querySelectorAll(selector)).filter((el) => {
    if (!(el instanceof HTMLElement)) return false
    if (el.dataset.cursorDisable === 'true') return false
    const style = window.getComputedStyle(el)
    if (style.visibility === 'hidden' || style.display === 'none') return false
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  })
}

function findMorphTarget(x, y) {
  const hovered = document.elementFromPoint(x, y)
  let el = hovered instanceof HTMLElement ? hovered.closest('[data-cursor-morph]') : null
  if (!el && hovered instanceof HTMLElement) {
    el = hovered.closest('a[href], button, [role="button"], input, textarea, select, summary')
  }
  if (el) return { el, dist: 0 }

  refreshCandidates()
  let best = null
  let bestDist = Infinity
  for (const candidate of candidates) {
    const rect = candidate.getBoundingClientRect()
    const d = elementDistanceToPoint(rect, x, y)
    if (d < bestDist) {
      bestDist = d
      best = candidate
    }
  }

  const maxDist = opts.morphDistance
  if (best && bestDist <= maxDist) return { el: best, dist: bestDist }
  return null
}

function resolveMorphStyle(el) {
  const rect = el.getBoundingClientRect()
  const pad = parseNumber(el.dataset.cursorPadding, opts.morphPadding)
  const shape = el.dataset.cursorShape ?? 'auto'
  const bg = el.dataset.cursorBg ?? opts.baseBg
  const opacity = clamp(parseNumber(el.dataset.cursorOpacity, opts.morphOpacity), 0, 1)
  const scale = clamp(parseNumber(el.dataset.cursorScale, opts.morphScale), 0.6, 2)

  let radius = 999
  if (shape === 'rect') radius = 14
  if (shape === 'pill') radius = (rect.height + pad * 2) / 2
  if (shape === 'circle') radius = 999
  if (shape === 'auto') {
    const cr = window.getComputedStyle(el).borderRadius
    const first = (cr || '').split(' ')[0]
    const px = parseFloat(first)
    if (Number.isFinite(px)) radius = clamp(px + pad, 8, 999)
    else radius = clamp((rect.height + pad * 2) / 2, 10, 999)
  }

  return {
    x: rect.left - pad,
    y: rect.top - pad,
    w: rect.width + pad * 2,
    h: rect.height + pad * 2,
    r: radius,
    opacity,
    bg,
    scale,
  }
}

function setBaseTarget() {
  const size = opts.baseSize
  target.x = lastPointer.x - size / 2
  target.y = lastPointer.y - size / 2
  target.w = size
  target.h = size
  target.r = 999
  target.opacity = opts.baseOpacity
  target.bg = opts.baseBg
  target.scale = 1
}

function tick() {
  raf = requestAnimationFrame(tick)
  if (!lastPointer.hadMove) return

  const morph = findMorphTarget(lastPointer.x, lastPointer.y)
  if (morph?.el) {
    Object.assign(target, resolveMorphStyle(morph.el))
  } else {
    setBaseTarget()
  }

  const t = morph?.el ? opts.morphLerp : opts.baseLerp
  current.x = lerp(current.x, target.x, t)
  current.y = lerp(current.y, target.y, t)
  current.w = lerp(current.w, target.w, t)
  current.h = lerp(current.h, target.h, t)
  current.r = lerp(current.r, target.r, t)
  current.opacity = lerp(current.opacity, target.opacity, t)
  current.scale = lerp(current.scale, target.scale, t)
  current.bg = target.bg
}

function onPointerMove(e) {
  lastPointer = { x: e.clientX, y: e.clientY, hadMove: true }
}

onMounted(() => {
  if (!enabled.value) return

  refreshCandidates(true)
  mutationObserver = new MutationObserver(() => refreshCandidates(true))
  mutationObserver.observe(document.documentElement, { subtree: true, childList: true, attributes: true })

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', () => refreshCandidates(), { passive: true })
  window.addEventListener('resize', () => refreshCandidates(true), { passive: true })

  raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  cancelAnimationFrame(raf)
  mutationObserver?.disconnect()
})
</script>

<style scoped>
.cursorRoot {
  position: fixed;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 9999;
}

.cursorShape {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--cw);
  height: var(--ch);
  transform: translate3d(var(--cx), var(--cy), 0) scale(var(--cscale));
  border-radius: var(--cr);
  background: var(--cbg);
  opacity: var(--cop);
  transition: background 120ms ease, opacity 120ms ease;
  will-change: transform, width, height, border-radius, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .cursorRoot {
    display: none;
  }
}
</style>

