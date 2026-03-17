<template>
  <teleport to="body">
    <!--
      Fill layer — z-index: -1 so it sits behind all page content.
      Only renders the filled shape; no stroke.
    -->
    <svg
      class="cursor-morph cursor-morph--fill"
      :width="svgSize"
      :height="svgSize"
      :style="fillSvgStyle"
      aria-hidden="true"
    >
      <path v-show="renderMode !== 'underline'" :d="currentPath" :fill="activeFill" stroke="none" />
    </svg>

    <!--
      Stroke layer — z-index: 99999, always on top.
      Only renders the outline + underline; no fill.
    -->
    <svg
      ref="svgEl"
      class="cursor-morph cursor-morph--stroke"
      :width="svgSize"
      :height="svgSize"
      :style="strokeSvgStyle"
      aria-hidden="true"
    >
      <path
        v-show="renderMode !== 'underline'"
        :d="currentPath"
        fill="none"
        :stroke="activeStroke"
        :stroke-width="strokeWidth"
      />

      <line
        v-show="ul.phase1 > 0.01"
        :x1="ul.cx - ul.halfW"
        :y1="ul.y"
        :x2="ul.cx + ul.halfW"
        :y2="ul.y"
        :stroke="activeStroke"
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
 * Optionally add  data-cursor-color="#fff"  to fill the cursor with a specific
 * color when snapped to that element. Without it, the cursor becomes wireframe
 * (stroke only, no fill) when snapped.
 *
 * Behaviour summary:
 *   Free roaming          → filled with props.color
 *   Snapped, no color     → wireframe (fill: none, stroke only)
 *   Snapped + color attr  → filled with data-cursor-color value
 *
 * Examples:
 *   <button data-cursor-target>Wireframe on snap</button>
 *   <button data-cursor-target data-cursor-color="#ffffff">White fill on snap</button>
 *   <div    data-cursor-target data-cursor-color="rgba(255,80,80,0.4)">Red fill</div>
 *   <a      data-cursor-target data-cursor-mode="underline">Link</a>
 *
 * PROPS
 * -----
 * size            {Number}  Default circle radius in px.          Default: 20
 * color           {String}  Fill color while free-roaming.        Default: '#fffa'
 * strokeColor     {String}  Stroke color (always visible).        Default: '#fffa'
 * strokeWidth     {Number}  Stroke width in px.                   Default: 1.5
 * mode            {String}  'fill' | 'wireframe' | 'underline'    Default: 'fill'
 * underlineHeight {Number}  Underline thickness in px.            Default: 2
 * stiffness       {Number}  Spring stiffness 0–1.                 Default: 0.22
 * attractRadius   {Number}  Px from element edge to start pull.   Default: 80
 * snapRadius      {Number}  Px from element edge — snap triggers at boundary. Default: 0
 * snapStiffness   {Number}  Spring stiffness inside snap zone.    Default: 0.18
 * virtualClick    {Boolean} Swallow real clicks, re-fire on snap. Default: false
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isSnapped, snappedEl, snappedMode } from '@/composables/useCursorSnap.js'

const SNAP_CLASS = 'cursor-snapped'

const props = defineProps({
  size: { type: Number, default: 32 },
  color: { type: String, default: '#fffa' },
  strokeColor: { type: String, default: '#fffa' },
  strokeWidth: { type: Number, default: 2 },
  mode: { type: String, default: 'fill' },
  underlineHeight: { type: Number, default: 2 },
  stiffness: { type: Number, default: 0.22 },
  attractRadius: { type: Number, default: 160 },
  snapRadius: { type: Number, default: 80 },
  snapStiffness: { type: Number, default: 0.18 },
  virtualClick: { type: Boolean, default: false },
})

// ─── State ────────────────────────────────────────────────────────────────────

const svgEl = ref(null)
const svgSize = 2000

const renderMode = ref(props.mode)
const mouse = { x: -999, y: -999 }

// null  → no element-level color (wireframe when snapped)
// string → the data-cursor-color value of the snapped element
const snapColor = ref(null)

// ── Fill / stroke logic ───────────────────────────────────────────────────────
// Free roaming : always filled with props.color
// Snapped, no data-cursor-color : wireframe (fill none)
// Snapped + data-cursor-color  : filled with that color
const activeFill = computed(() => {
  if (!isSnapped.value) return props.color
  return snapColor.value ?? 'none'
})

const activeStroke = computed(() => props.strokeColor)

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

// Underline spring state
const ul = ref({ phase1: 0, halfW: 0, cx: 0, y: 0 })
const ulT = { phase1: 0, halfW: 0, cx: 0, y: 0 }
let ulActive = false

const currentPath = ref('')
let rafId = null
let targets = []

// ─── SVG positioning ──────────────────────────────────────────────────────────
// Two layers share identical position/size. Only z-index differs.

const baseSvgStyle = {
  position: 'fixed',
  top: '0px',
  left: '0px',
  pointerEvents: 'none',
  overflow: 'visible',
}

const fillSvgStyle = computed(() => ({ ...baseSvgStyle, zIndex: '-1' }))
const strokeSvgStyle = computed(() => ({ ...baseSvgStyle, zIndex: '99999' }))

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
    cursorColor: el.dataset.cursorColor ?? null, // null = wireframe when snapped
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
        // Set color: element's data-cursor-color, or null → wireframe
        snapColor.value = bestEntry.cursorColor
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
        snapColor.value = null
      }

      const w = attractWeight(bestDist)

      // Closest point on the element's expanded bounding box to the cursor.
      // The circle is pulled toward this point, not the center, so it feels
      // like it's being drawn to the nearest edge rather than flying across.
      const rect = bestEntry.el.getBoundingClientRect()
      const off = bestEntry.offset
      const closestX = Math.max(rect.left - off, Math.min(mouse.x, rect.right + off))
      const closestY = Math.max(rect.top - off, Math.min(mouse.y, rect.bottom + off))

      target.x = mouse.x + (closestX - mouse.x) * w
      target.y = mouse.y + (closestY - mouse.y) * w

      // Shape: stay as circle — no morphing until snap zone
      target.w = defaultW
      target.h = defaultW
      target.rtl = defaultR
      target.rtr = defaultR
      target.rbr = defaultR
      target.rbl = defaultR
    }

    if (ulActive) {
      ulT.phase1 = 1
      ulT.cx = bestShape.x
      ulT.y = bestShape.y + bestShape.h / 2
      ulT.halfW = ul.value.phase1 > 0.5 ? bestShape.w / 2 : 0
    } else {
      ulT.phase1 = 0
      ulT.halfW = 0
    }
  } else {
    inSnapZone = false // use normal stiffness for the morph-back to circle
    activeElement = null
    ulActive = false
    renderMode.value = props.mode

    if (isSnapped.value) {
      prevSnappedEl?.classList.remove(SNAP_CLASS)
      prevSnappedEl = null
      isSnapped.value = false
      snappedEl.value = null
      snappedMode.value = null
      snapColor.value = null
    }

    setRealCursor('none')

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
    attributeFilter: [
      'data-cursor-target',
      'data-cursor-offset',
      'data-cursor-mode',
      'data-cursor-color',
    ],
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
