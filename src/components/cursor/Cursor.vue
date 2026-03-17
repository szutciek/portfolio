<template>
  <teleport to="body">
    <svg
      ref="svgEl"
      class="cursor-morph"
      :width="svgSize"
      :height="svgSize"
      :style="svgStyle"
      aria-hidden="true"
    >
      <!-- fill / wireframe — hidden while underline is fully active -->
      <path
        v-show="renderMode !== 'underline'"
        :d="currentPath"
        :fill="renderMode === 'fill' ? color : 'none'"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
      />

      <!--
        Underline — two-phase entrance, reversed on exit.

        phase1  0→1  squash:    stroke-width morphs from underlineHeight → 1px
                                as the cursor shape collapses into a thin line
        halfW   0→N  slide-out: line expands from center once phase1 > 0.5

        On exit both spring back to 0 simultaneously (retract + thicken).
        v-show keeps the element mounted so spring values can decay smoothly.
      -->
      <line
        v-show="ul.phase1 > 0.01"
        :x1="ul.cx - ul.halfW"
        :y1="ul.y"
        :x2="ul.cx + ul.halfW"
        :y2="ul.y"
        :stroke="strokeColor"
        :stroke-width="Math.max(1, underlineHeight - (underlineHeight - 1) * ul.phase1)"
        stroke-linecap="round"
      />
    </svg>
  </teleport>
</template>

<script setup>
/**
 * CursorMorph.vue
 *
 * A magnetic morphing cursor that blends from a circle into the exact
 * rounded-rect shape of any element marked with data-cursor-target.
 *
 * DIRECTIVE / ATTRIBUTE USAGE
 * ----------------------------
 * Add  data-cursor-target  to any element you want the cursor to morph into.
 * Optionally add  data-cursor-offset="8"  (px, positive = expand outward,
 * negative = shrink inward).
 * Optionally add  data-cursor-mode="fill|wireframe|underline"  to override
 * the render mode for that specific element.
 *
 * Examples:
 *   <button data-cursor-target data-cursor-offset="6">Click me</button>
 *   <div    data-cursor-target data-cursor-offset="-4" data-cursor-mode="wireframe">Card</div>
 *   <a      data-cursor-target data-cursor-mode="underline">Link</a>
 *
 * PROPS
 * -----
 * size            {Number}  Default circle radius in px.          Default: 20
 * color           {String}  Fill color (fill mode only).          Default: 'rgba(99,99,255,0.25)'
 * strokeColor     {String}  Stroke / underline color.             Default: 'rgba(99,99,255,0.85)'
 * strokeWidth     {Number}  Stroke width in px.                   Default: 1.5
 * mode            {String}  'fill' | 'wireframe' | 'underline'    Default: 'fill'
 * underlineHeight {Number}  Underline thickness in px.            Default: 2
 * stiffness       {Number}  Spring stiffness 0–1.                 Default: 0.22
 * attractRadius   {Number}  Px from element edge to start pull.   Default: 80
 * snapRadius      {Number}  Px from element edge — smooth snap.   Default: 100
 * snapStiffness   {Number}  Spring stiffness inside snap zone.    Default: 0.18
 * virtualClick    {Boolean} Swallow real clicks, re-fire on snap. Default: false
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isSnapped, snappedEl, snappedMode } from '@/composables/useCursorSnap.js'

const SNAP_CLASS = 'cursor-snapped'

const props = defineProps({
  size: { type: Number, default: 20 },
  color: { type: String, default: '#fffa' },
  strokeColor: { type: String, default: '#fffa' },
  strokeWidth: { type: Number, default: 1.5 },
  mode: { type: String, default: 'fill' },
  underlineHeight: { type: Number, default: 2 },
  stiffness: { type: Number, default: 0.22 },
  attractRadius: { type: Number, default: 80 },
  snapRadius: { type: Number, default: 80 },
  snapStiffness: { type: Number, default: 0.18 },
  virtualClick: { type: Boolean, default: false },
})

// ─── State ────────────────────────────────────────────────────────────────────

const svgEl = ref(null)
const svgSize = 2000

const renderMode = ref(props.mode)
const mouse = { x: -999, y: -999 }

// Shape spring
const spring = ref({
  x: -999,
  y: -999,
  w: 0,
  h: 0,
  rtl: 0,
  rtr: 0,
  rbr: 0,
  rbl: 0,
})
const target = {
  x: -999,
  y: -999,
  w: 0,
  h: 0,
  rtl: 0,
  rtr: 0,
  rbr: 0,
  rbl: 0,
}

// ── Underline spring state ────────────────────────────────────────────────────
// Completely independent from the shape spring.
//
//   phase1   0→1   squash — stroke-width goes from underlineHeight → 1px
//   halfW    0→N   slide-out — half the target width, gates on phase1 > 0.5
//   cx / y         position springs toward the element's bottom-center
//
// Enter: phase1 → 1, then halfW → targetHalfW (gated)
// Exit:  phase1 → 0, halfW → 0 simultaneously
const ul = ref({ phase1: 0, halfW: 0, cx: 0, y: 0 })
const ulT = { phase1: 0, halfW: 0, cx: 0, y: 0 }

let ulActive = false

const currentPath = ref('')
let rafId = null
let targets = []

// ─── SVG positioning ──────────────────────────────────────────────────────────

const svgStyle = computed(() => ({
  position: 'fixed',
  top: '0px',
  left: '0px',
  pointerEvents: 'none',
  zIndex: '99999',
  overflow: 'visible',
}))

// ─── Rounded-rect path builder ────────────────────────────────────────────────

const K = 0.5522848

function roundedRectPath(cx, cy, w, h, rtl, rtr, rbr, rbl) {
  const hw = w / 2,
    hh = h / 2
  rtl = Math.min(rtl, hw, hh)
  rtr = Math.min(rtr, hw, hh)
  rbr = Math.min(rbr, hw, hh)
  rbl = Math.min(rbl, hw, hh)
  const x0 = cx - hw,
    y0 = cy - hh
  const x1 = cx + hw,
    y1 = cy + hh
  const ktl = rtl * K,
    ktr = rtr * K,
    kbr = rbr * K,
    kbl = rbl * K
  return [
    `M ${x0 + rtl} ${y0}`,
    `L ${x1 - rtr} ${y0}`,
    `C ${x1 - rtr + ktr} ${y0} ${x1} ${y0 + rtr - ktr} ${x1} ${y0 + rtr}`,
    `L ${x1} ${y1 - rbr}`,
    `C ${x1} ${y1 - rbr + kbr} ${x1 - rbr + kbr} ${y1} ${x1 - rbr} ${y1}`,
    `L ${x0 + rbl} ${y1}`,
    `C ${x0 + rbl - kbl} ${y1} ${x0} ${y1 - rbl + kbl} ${x0} ${y1 - rbl}`,
    `L ${x0} ${y0 + rtl}`,
    `C ${x0} ${y0 + rtl - ktl} ${x0 + rtl - ktl} ${y0} ${x0 + rtl} ${y0}`,
    'Z',
  ].join(' ')
}

// ─── DOM scanning ─────────────────────────────────────────────────────────────

function scanTargets() {
  targets = Array.from(document.querySelectorAll('[data-cursor-target]')).map((el) => ({
    el,
    offset: parseFloat(el.dataset.cursorOffset ?? '0'),
    cursorMode: el.dataset.cursorMode ?? null,
  }))
}

function getTargetShape(el, offset) {
  const rect = el.getBoundingClientRect()
  const cs = getComputedStyle(el)
  const parseR = (v) => parseFloat(v) || 0
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    w: rect.width + offset * 2,
    h: rect.height + offset * 2,
    rtl: parseR(cs.borderTopLeftRadius) + offset,
    rtr: parseR(cs.borderTopRightRadius) + offset,
    rbr: parseR(cs.borderBottomRightRadius) + offset,
    rbl: parseR(cs.borderBottomLeftRadius) + offset,
  }
}

// ─── Real cursor style ────────────────────────────────────────────────────────
// When snapped, show the real pointer so the user knows the element is
// clickable. Restored to 'none' (hidden) when leaving the snap zone.

function setRealCursor(style) {
  document.documentElement.style.setProperty('cursor', style, 'important')
}

// ─── Attraction logic ─────────────────────────────────────────────────────────

function distToRect(mx, my, rect, offset) {
  const ex = Math.max(rect.left - offset, Math.min(mx, rect.right + offset))
  const ey = Math.max(rect.top - offset, Math.min(my, rect.bottom + offset))
  return Math.hypot(mx - ex, my - ey)
}

function attractWeight(dist) {
  const t =
    1 -
    Math.max(0, Math.min(1, (dist - props.snapRadius) / (props.attractRadius - props.snapRadius)))
  return t * t
}

let inSnapZone = false
let activeElement = null
let prevSnappedEl = null

function computeTarget() {
  const defaultW = props.size * 2
  const defaultR = props.size

  let bestDist = Infinity
  let bestShape = null
  let bestEntry = null

  for (const entry of targets) {
    const rect = entry.el.getBoundingClientRect()
    const dist = distToRect(mouse.x, mouse.y, rect, entry.offset)
    if (dist < props.attractRadius && dist < bestDist) {
      bestDist = dist
      bestShape = getTargetShape(entry.el, entry.offset)
      bestEntry = entry
    }
  }

  if (bestShape) {
    inSnapZone = bestDist <= props.snapRadius
    activeElement = bestEntry

    const activeMode = bestEntry.cursorMode ?? props.mode
    renderMode.value = activeMode
    ulActive = activeMode === 'underline'

    if (inSnapZone) {
      if (!isSnapped.value || snappedEl.value !== bestEntry.el) {
        if (prevSnappedEl && prevSnappedEl !== bestEntry.el) {
          prevSnappedEl.classList.remove(SNAP_CLASS)
        }
        bestEntry.el.classList.add(SNAP_CLASS)
        prevSnappedEl = bestEntry.el
        isSnapped.value = true
        snappedEl.value = bestEntry.el
        snappedMode.value = activeMode
      }

      setRealCursor('pointer')

      target.x = bestShape.x
      target.y = bestShape.y
      target.w = bestShape.w
      target.h = bestShape.h
      target.rtl = bestShape.rtl
      target.rtr = bestShape.rtr
      target.rbr = bestShape.rbr
      target.rbl = bestShape.rbl
    } else {
      setRealCursor('none')

      if (isSnapped.value) {
        prevSnappedEl?.classList.remove(SNAP_CLASS)
        prevSnappedEl = null
        isSnapped.value = false
        snappedEl.value = null
        snappedMode.value = null
      }

      const w = attractWeight(bestDist)
      target.x = mouse.x + (bestShape.x - mouse.x) * w
      target.y = mouse.y + (bestShape.y - mouse.y) * w
      target.w = defaultW + (bestShape.w - defaultW) * w
      target.h = defaultW + (bestShape.h - defaultW) * w
      target.rtl = defaultR + (bestShape.rtl - defaultR) * w
      target.rtr = defaultR + (bestShape.rtr - defaultR) * w
      target.rbr = defaultR + (bestShape.rbr - defaultR) * w
      target.rbl = defaultR + (bestShape.rbl - defaultR) * w
    }

    // ── Underline targets ───────────────────────────────────────────────────
    if (ulActive) {
      ulT.phase1 = 1
      ulT.cx = bestShape.x
      ulT.y = bestShape.y + bestShape.h / 2 // bottom edge

      // Gate: halfW only starts expanding once squash is well underway.
      // This is the key to the squash-THEN-expand sequence — no timers needed,
      // just a threshold on the spring value itself.
      ulT.halfW = ul.value.phase1 > 0.5 ? bestShape.w / 2 : 0
    } else {
      ulT.phase1 = 0
      ulT.halfW = 0
      // cx/y frozen — retract happens in-place, not flying back to origin
    }
  } else {
    inSnapZone = false
    activeElement = null
    ulActive = false
    renderMode.value = props.mode

    if (isSnapped.value) {
      prevSnappedEl?.classList.remove(SNAP_CLASS)
      prevSnappedEl = null
      isSnapped.value = false
      snappedEl.value = null
      snappedMode.value = null
    }

    ulT.phase1 = 0
    ulT.halfW = 0

    target.x = mouse.x
    target.y = mouse.y
    target.w = defaultW
    target.h = defaultW
    target.rtl = defaultR
    target.rtr = defaultR
    target.rbr = defaultR
    target.rbl = defaultR
  }
}

// ─── Spring & render loop ─────────────────────────────────────────────────────

function springStep(key) {
  const k = inSnapZone ? props.snapStiffness : props.stiffness
  spring.value[key] += (target[key] - spring.value[key]) * k
}

// Underline springs use a fixed stiffness — slightly snappier than the shape
// spring so the squash phase feels crisp.
const UL_K = 0.14

function ulSpringStep(key) {
  ul.value[key] += (ulT[key] - ul.value[key]) * UL_K
}

function tick() {
  computeTarget()

  springStep('x')
  springStep('y')
  springStep('w')
  springStep('h')
  springStep('rtl')
  springStep('rtr')
  springStep('rbr')
  springStep('rbl')

  ulSpringStep('phase1')
  ulSpringStep('halfW')
  ulSpringStep('cx')
  ulSpringStep('y')

  const s = spring.value
  currentPath.value = roundedRectPath(
    s.x,
    s.y,
    s.w,
    s.h,
    Math.max(0, s.rtl),
    Math.max(0, s.rtr),
    Math.max(0, s.rbr),
    Math.max(0, s.rbl),
  )

  rafId = requestAnimationFrame(tick)
}

// ─── Virtual click interception ───────────────────────────────────────────────

const SYNTHETIC_MARKER = '__cursorMorphSynthetic'

function onCaptureClick(e) {
  if (!props.virtualClick) return
  if (e[SYNTHETIC_MARKER]) return
  if (isSnapped.value && snappedEl.value) {
    e.preventDefault()
    e.stopPropagation()
    const synthetic = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
    })
    synthetic[SYNTHETIC_MARKER] = true
    snappedEl.value.dispatchEvent(synthetic)
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

function onMouseMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
  if (spring.value.x === -999) {
    spring.value.x = mouse.x
    spring.value.y = mouse.y
    spring.value.w = props.size * 2
    spring.value.h = props.size * 2
    spring.value.rtl = spring.value.rtr = spring.value.rbr = spring.value.rbl = props.size
    // Seed underline position so it doesn't fly in from 0,0 on first snap
    ul.value.cx = mouse.x
    ulT.cx = mouse.x
    ul.value.y = mouse.y
    ulT.y = mouse.y
  }
}

let observer = null

onMounted(() => {
  scanTargets()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('click', onCaptureClick, { capture: true })
  rafId = requestAnimationFrame(tick)

  observer = new MutationObserver(scanTargets)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-cursor-target', 'data-cursor-offset', 'data-cursor-mode'],
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('click', onCaptureClick, { capture: true })
  cancelAnimationFrame(rafId)
  observer?.disconnect()
  prevSnappedEl?.classList.remove(SNAP_CLASS)
})
</script>

<style scoped>
.cursor-morph {
  cursor: none;
}
</style>
