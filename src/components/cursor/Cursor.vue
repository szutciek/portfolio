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
      <!-- fill / wireframe mode -->
      <path
        v-if="renderMode !== 'underline'"
        :d="currentPath"
        :fill="renderMode === 'fill' ? color : 'none'"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
      />

      <!--
        underline mode — a single horizontal line spanning the shape's width,
        sitting at the bottom of the bounding box. The line inherits the same
        spring position so it follows smoothly like everything else.
        underlineHeight controls its thickness (default 2px).
      -->
      <line
        v-if="renderMode === 'underline'"
        :x1="spring.x - spring.w / 2"
        :y1="spring.y + spring.h / 2"
        :x2="spring.x + spring.w / 2"
        :y2="spring.y + spring.h / 2"
        :stroke="strokeColor"
        :stroke-width="underlineHeight"
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
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isSnapped, snappedEl, snappedMode } from '@/composables/useCursorSnap.js'

// Class added to the element that is currently snapped to.
// Consumers can target [data-cursor-target].cursor-snapped in CSS.
const SNAP_CLASS = 'cursor-snapped'

const props = defineProps({
  size: { type: Number, default: 20 },
  color: { type: String, default: 'rgba(99, 99, 255, 0.25)' },
  strokeColor: { type: String, default: 'rgba(99, 99, 255, 0.85)' },
  strokeWidth: { type: Number, default: 1.5 },
  mode: { type: String, default: 'fill' }, // 'fill' | 'wireframe' | 'underline'
  underlineHeight: { type: Number, default: 2 },
  stiffness: { type: Number, default: 0.22 },
  attractRadius: { type: Number, default: 80 },
  snapRadius: { type: Number, default: 100 }, // smooth-snap zone starts here
  snapStiffness: { type: Number, default: 0.18 }, // spring k inside snap zone
})

// ─── State ────────────────────────────────────────────────────────────────────

const svgEl = ref(null)
const svgSize = 2000 // fixed large canvas, positioned via transform

// Active render mode — may be overridden per-element via data-cursor-mode
const renderMode = ref(props.mode)

// Mouse position (raw, updated immediately)
const mouse = { x: -999, y: -999 }

// Spring state — position of cursor center + shape params
// Exposed as a reactive ref so the underline <line> can bind directly.
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

// Targets driven by attraction logic each frame
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

// The SVG <path> d attribute — updated each RAF
const currentPath = ref('')

let rafId = null
let targets = [] // registered DOM elements + cached data

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
// Describes a rounded rect as 8 cubic-bezier arcs (one per corner quadrant).
// cx/cy = center, w/h = full size, rtl/rtr/rbr/rbl = corner radii.
// All 4 radii are independent — handles arbitrary border-radius per corner.

const K = 0.5522848 // cubic bezier approximation constant for quarter-circle

function roundedRectPath(cx, cy, w, h, rtl, rtr, rbr, rbl) {
  const hw = w / 2,
    hh = h / 2

  // clamp radii so they never exceed half the side
  rtl = Math.min(rtl, hw, hh)
  rtr = Math.min(rtr, hw, hh)
  rbr = Math.min(rbr, hw, hh)
  rbl = Math.min(rbl, hw, hh)

  const x0 = cx - hw,
    y0 = cy - hh // top-left corner of bounding box
  const x1 = cx + hw,
    y1 = cy + hh // bottom-right

  // control point distances for each corner
  const ktl = rtl * K,
    ktr = rtr * K,
    kbr = rbr * K,
    kbl = rbl * K

  return [
    `M ${x0 + rtl} ${y0}`,
    // top edge → top-right corner
    `L ${x1 - rtr} ${y0}`,
    `C ${x1 - rtr + ktr} ${y0} ${x1} ${y0 + rtr - ktr} ${x1} ${y0 + rtr}`,
    // right edge → bottom-right corner
    `L ${x1} ${y1 - rbr}`,
    `C ${x1} ${y1 - rbr + kbr} ${x1 - rbr + kbr} ${y1} ${x1 - rbr} ${y1}`,
    // bottom edge → bottom-left corner
    `L ${x0 + rbl} ${y1}`,
    `C ${x0 + rbl - kbl} ${y1} ${x0} ${y1 - rbl + kbl} ${x0} ${y1 - rbl}`,
    // left edge → top-left corner
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
    cursorMode: el.dataset.cursorMode ?? null, // per-element mode override
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

// ─── Attraction logic ─────────────────────────────────────────────────────────

function distToRect(mx, my, rect, offset) {
  const ex = Math.max(rect.left - offset, Math.min(mx, rect.right + offset))
  const ey = Math.max(rect.top - offset, Math.min(my, rect.bottom + offset))
  return Math.hypot(mx - ex, my - ey)
}

// easeInQuad ramp: weak far away, strong up close
function attractWeight(dist) {
  const t =
    1 -
    Math.max(0, Math.min(1, (dist - props.snapRadius) / (props.attractRadius - props.snapRadius)))
  return t * t
}

// Active snap target so springStep can pick the right stiffness
let inSnapZone = false
let activeElement = null // the element currently being tracked
let prevSnappedEl = null // track previous so we can remove the class

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

    // Switch render mode to the element's override (if any), else global prop
    renderMode.value = bestEntry.cursorMode ?? props.mode

    if (inSnapZone) {
      // ── Update shared snap state ──────────────────────────────────────────
      if (!isSnapped.value || snappedEl.value !== bestEntry.el) {
        // Remove class from previous element (if different)
        if (prevSnappedEl && prevSnappedEl !== bestEntry.el) {
          prevSnappedEl.classList.remove(SNAP_CLASS)
        }
        // Add class to the newly snapped element
        bestEntry.el.classList.add(SNAP_CLASS)
        prevSnappedEl = bestEntry.el

        isSnapped.value = true
        snappedEl.value = bestEntry.el
        snappedMode.value = renderMode.value
      }

      target.x = bestShape.x
      target.y = bestShape.y
      target.w = bestShape.w
      target.h = bestShape.h
      target.rtl = bestShape.rtl
      target.rtr = bestShape.rtr
      target.rbr = bestShape.rbr
      target.rbl = bestShape.rbl
    } else {
      // Outside snap zone but still in attract radius — clear snap state
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
  } else {
    inSnapZone = false
    activeElement = null
    renderMode.value = props.mode

    // Clear snap state when no element is in range
    if (isSnapped.value) {
      prevSnappedEl?.classList.remove(SNAP_CLASS)
      prevSnappedEl = null
      isSnapped.value = false
      snappedEl.value = null
      snappedMode.value = null
    }

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
  }
}

// Re-scan whenever DOM changes (layout shifts, route changes, etc.)
let observer = null

onMounted(() => {
  scanTargets()
  window.addEventListener('mousemove', onMouseMove)
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
  cancelAnimationFrame(rafId)
  observer?.disconnect()
  // Clean up any lingering snap class
  prevSnappedEl?.classList.remove(SNAP_CLASS)
})
</script>

<style scoped>
.cursor-morph {
  cursor: none;
}
</style>
