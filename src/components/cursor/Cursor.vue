<template>
  <teleport to="body">
    <svg
      ref="svgEl"
      class="cursor-morph _no-print"
      :width="svgSize"
      :height="svgSize"
      :style="svgStyle"
      aria-hidden="true"
    >
      <g :transform="deformTransform">
        <path
          v-show="renderMode !== 'underline'"
          :d="currentPath"
          fill="none"
          :stroke="activeStrokeColor"
          :stroke-width="strokeWidth"
        />
      </g>

      <line
        v-show="ul.phase1 > 0.01"
        :x1="ul.cx - ul.halfW"
        :y1="ul.y"
        :x2="ul.cx + ul.halfW"
        :y2="ul.y"
        :stroke="activeStrokeColor"
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
 * DIRECTIVE / ATTRIBUTE USAGE
 * ----------------------------
 * data-cursor-target              — register element as a cursor target
 * data-cursor-offset="8"          — expand/shrink bounding box (px)
 * data-cursor-mode="wireframe|underline"
 * data-cursor-snap-color="#f00"   — stroke override when snapped
 * data-cursor-passive             — passive target: no pointer cursor, no
 *                                   click, stroke becomes #fff
 *
 * PROPS
 * -----
 * size            {Number}  Default circle radius in px.             Default: 30
 * strokeColor     {String}  Stroke color (free-roaming + snap fallback).
 * strokeWidth     {Number}  Stroke width in px.                      Default: 1.5
 * underlineHeight {Number}  Underline thickness in px.               Default: 2
 * mode            {String}  'wireframe' | 'underline'                Default: 'wireframe'
 * stiffness       {Number}  Spring stiffness 0-1.                    Default: 0.2
 * attractRadius   {Number}  Px from element edge to start pull.      Default: 160
 * snapRadius      {Number}  Px from element edge - snap at boundary. Default: 80
 * snapStiffness   {Number}  Spring stiffness inside snap zone.       Default: 0.2
 * virtualClick    {Boolean} Swallow real clicks, re-fire on snap.    Default: false
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isSnapped, snappedEl, snappedMode } from '@/composables/useCursorSnap.js'

const SNAP_CLASS = 'cursor-snapped'
const PASSIVE_COLOR = '#fff'

const props = defineProps({
  size: { type: Number, default: 30 },
  strokeColor: { type: String, default: 'var(--main-color-l)' },
  strokeWidth: { type: Number, default: 1.5 },
  underlineHeight: { type: Number, default: 2 },
  mode: { type: String, default: 'wireframe' },
  stiffness: { type: Number, default: 0.2 },
  attractRadius: { type: Number, default: 160 },
  snapRadius: { type: Number, default: 80 },
  snapStiffness: { type: Number, default: 0.2 },
  virtualClick: { type: Boolean, default: false },
})

// --- State -------------------------------------------------------------------

const svgEl = ref(null)
const svgSize = 2000

const renderMode = ref(props.mode)
const mouse = { x: -999, y: -999 }

const snapStrokeColor = ref(null)
const snapIsPassive = ref(false)

const activeStrokeColor = computed(() => {
  if (isSnapped.value) {
    if (snapIsPassive.value) return PASSIVE_COLOR
    if (snapStrokeColor.value) return snapStrokeColor.value
  }
  return props.strokeColor
})

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

// Deformation spring
const deform = ref({ dx: 0, dy: 0 })
const deformT = { dx: 0, dy: 0 }

// Element nudge spring
const nudge = ref({ x: 0, y: 0 })
const nudgeT = { x: 0, y: 0 }
let nudgeEl = null

// Previously nudged elements — Map<HTMLElement, { x, y }> tracking every
// element that has been nudged so they all spring back to origin, not just
// the most recent one.
const prevNudgeMap = new Map()

// Underline spring
const ul = ref({ phase1: 0, halfW: 0, cx: 0, y: 0 })
const ulT = { phase1: 0, halfW: 0, cx: 0, y: 0 }
let ulActive = false

const activeGlyphPath = ref(null)
const currentPath = ref('')
let rafId = null
let targets = []

// --- Target-switch toggle ----------------------------------------------------
// When the snapped element changes while already snapped, we set isSnapped to
// false for exactly one RAF tick so watchers see the transition false -> true.
// pendingSnapEl holds the incoming element during that one-tick gap.
let pendingSnapEl = null
let pendingSnapEntry = null
let pendingSnapShape = null

// --- SVG positioning ---------------------------------------------------------

const svgStyle = computed(() => ({
  position: 'fixed',
  top: '0px',
  left: '0px',
  pointerEvents: 'none',
  overflow: 'visible',
  zIndex: '99999',
}))

// --- Deformation transform ---------------------------------------------------

const deformTransform = computed(() => {
  const s = spring.value
  const dx = deform.value.dx
  const dy = deform.value.dy
  const mag = Math.hypot(dx, dy)
  if (mag < 0.001) return ''

  const stretch = 1 + mag * 0.15
  const squash = 1 - mag * 0.08
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)
  const cx = s.x,
    cy = s.y

  return [
    `translate(${cx} ${cy})`,
    `rotate(${angle})`,
    `scale(${stretch} ${squash})`,
    `rotate(${-angle})`,
    `translate(${-cx} ${-cy})`,
  ].join(' ')
})

// --- Rounded-rect path builder -----------------------------------------------

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

// --- DOM scanning ------------------------------------------------------------

function scanTargets() {
  targets = Array.from(document.querySelectorAll('[data-cursor-target]')).map((el) => ({
    el,
    offset: parseFloat(el.dataset.cursorOffset ?? '0'),
    cursorMode: el.dataset.cursorMode ?? null,
    snapStrokeColor: el.dataset.cursorSnapColor ?? null,
    isGlyph: el.dataset.cursorGlyph === 'true',
    passive: el.getAttribute('data-cursor-passive') != null,
  }))
}

function getTargetShape(el, offset) {
  if (el.dataset.cursorGlyph === 'true') {
    const rect = el.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      w: rect.width,
      h: rect.height,
      rtl: 0,
      rtr: 0,
      rbr: 0,
      rbl: 0,
      glyphPath: el.dataset.cursorGlyphPath ?? null,
    }
  }

  const rect = el.getBoundingClientRect()
  const cs = getComputedStyle(el)
  const parseR = (v) => parseFloat(v) || 0
  const r = (v) => {
    const base = parseR(v)
    return base === 0 ? 0 : base + offset
  }
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    w: rect.width + offset * 2,
    h: rect.height + offset * 2,
    rtl: r(cs.borderTopLeftRadius),
    rtr: r(cs.borderTopRightRadius),
    rbr: r(cs.borderBottomRightRadius),
    rbl: r(cs.borderBottomLeftRadius),
    glyphPath: null,
  }
}

// --- Real cursor style -------------------------------------------------------

function setRealCursor(style) {
  document.documentElement.style.setProperty('cursor', style, 'important')
}

// --- Hover emulation ---------------------------------------------------------

let hoveredEl = null

function emitEnter(el) {
  if (!el || hoveredEl === el) return
  if (hoveredEl) emitLeave(hoveredEl)
  hoveredEl = el
  el.dispatchEvent(
    new PointerEvent('pointerenter', { bubbles: false, cancelable: false, pointerType: 'mouse' }),
  )
  el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
}

function emitLeave(el) {
  if (!el) return
  if (hoveredEl === el) hoveredEl = null
  el.dispatchEvent(
    new PointerEvent('pointerleave', { bubbles: false, cancelable: false, pointerType: 'mouse' }),
  )
  el.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true }))
}

// --- Occlusion check ---------------------------------------------------------

function testPoint(node, el) {
  while (node) {
    if (node === el || node.classList.contains('_cursor-transparent')) return true
    node = node.parentElement
  }
  return false
}

function isVisible(el) {
  const rect = el.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return false
  if (rect.bottom < 0 || rect.top > window.innerHeight) return false
  if (rect.right < 0 || rect.left > window.innerWidth) return false

  const cs = getComputedStyle(el)
  if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false

  const cx = rect.x + rect.width / 2
  const cy = rect.y + rect.height / 2
  if (!testPoint(document.elementFromPoint(cx, rect.y + 1), el)) return false
  if (!testPoint(document.elementFromPoint(cx, rect.y + rect.height - 1), el)) return false
  if (!testPoint(document.elementFromPoint(rect.x + 1, cy), el)) return false
  if (!testPoint(document.elementFromPoint(rect.x + rect.width - 1, cy), el)) return false
  return true
}

// --- Snap helpers ------------------------------------------------------------

function applySnap(entry, shape) {
  if (prevSnappedEl && prevSnappedEl !== entry.el) {
    prevSnappedEl.classList.remove(SNAP_CLASS)
  }
  entry.el.classList.add(SNAP_CLASS)
  prevSnappedEl = entry.el
  isSnapped.value = true
  snappedEl.value = entry.el
  snappedMode.value = renderMode.value
  snapStrokeColor.value = entry.snapStrokeColor
  snapIsPassive.value = entry.passive
  activeGlyphPath.value = shape.glyphPath
  if (!entry.passive) emitEnter(entry.el)
}

function clearSnap() {
  prevSnappedEl?.classList.remove(SNAP_CLASS)
  if (!snapIsPassive.value) emitLeave(prevSnappedEl)
  prevSnappedEl = null
  isSnapped.value = false
  snappedEl.value = null
  snappedMode.value = null
  snapStrokeColor.value = null
  snapIsPassive.value = false
  activeGlyphPath.value = null
}

// --- Attraction logic --------------------------------------------------------

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

// Retire the current nudgeEl into prevNudgeMap so it springs back to origin.
// Seeds its position from the live nudge spring to avoid a jump.
function retireNudgeEl() {
  if (!nudgeEl) return
  if (!prevNudgeMap.has(nudgeEl)) {
    prevNudgeMap.set(nudgeEl, { x: nudge.value.x, y: nudge.value.y })
  } else {
    const pos = prevNudgeMap.get(nudgeEl)
    pos.x = nudge.value.x
    pos.y = nudge.value.y
  }
  nudge.value.x = 0
  nudge.value.y = 0
  nudgeEl = null
}

// Switch the active nudge element to `el`, retiring the old one first.
function activateNudgeEl(el) {
  if (nudgeEl === el) return
  retireNudgeEl()
  nudgeEl = el
  // Remove from prevNudgeMap — it is now the active nudge target.
  prevNudgeMap.delete(el)
}

function computeTarget() {
  const defaultW = props.size * 2
  const defaultR = props.size

  // Resolve pending snap from previous tick
  if (pendingSnapEl) {
    applySnap(pendingSnapEntry, pendingSnapShape)
    setRealCursor(pendingSnapEntry.passive ? 'none' : 'pointer')

    target.x = pendingSnapShape.x
    target.y = pendingSnapShape.y
    target.w = pendingSnapShape.w
    target.h = pendingSnapShape.h
    target.rtl = pendingSnapShape.rtl
    target.rtr = pendingSnapShape.rtr
    target.rbr = pendingSnapShape.rbr
    target.rbl = pendingSnapShape.rbl

    pendingSnapEl = null
    pendingSnapEntry = null
    pendingSnapShape = null
    return
  }

  let bestDist = Infinity
  let bestShape = null
  let bestEntry = null

  for (const entry of targets) {
    const rect = entry.el.getBoundingClientRect()
    const dist = distToRect(mouse.x, mouse.y, rect, entry.offset)
    if (dist < props.attractRadius && dist < bestDist && isVisible(entry.el)) {
      bestDist = dist
      bestShape = getTargetShape(entry.el, entry.offset)
      bestEntry = entry
    }
  }

  if (bestShape) {
    inSnapZone = bestDist <= props.snapRadius
    activeElement = bestEntry

    renderMode.value = bestEntry.cursorMode ?? props.mode
    ulActive = renderMode.value === 'underline'

    if (inSnapZone) {
      setRealCursor(bestEntry.passive ? 'none' : 'pointer')

      if (!isSnapped.value) {
        applySnap(bestEntry, bestShape)
      } else if (snappedEl.value !== bestEntry.el) {
        clearSnap()
        inSnapZone = false
        pendingSnapEl = bestEntry.el
        pendingSnapEntry = bestEntry
        pendingSnapShape = bestShape
      }

      deformT.dx = 0
      deformT.dy = 0

      const rect2 = bestEntry.el.getBoundingClientRect()
      const elCx = rect2.left + rect2.width / 2
      const elCy = rect2.top + rect2.height / 2
      const toCurX = mouse.x - elCx
      const toCurY = mouse.y - elCy
      const toDist = Math.hypot(toCurX, toCurY) || 1
      nudgeT.x = (toCurX / toDist) * Math.min(toDist, 14)
      nudgeT.y = (toCurY / toDist) * Math.min(toDist, 14)
      activateNudgeEl(bestEntry.el)

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
      if (isSnapped.value) clearSnap()

      const w = attractWeight(bestDist)

      const rect = bestEntry.el.getBoundingClientRect()
      const off = bestEntry.offset
      const closestX = Math.max(rect.left - off, Math.min(mouse.x, rect.right + off))
      const closestY = Math.max(rect.top - off, Math.min(mouse.y, rect.bottom + off))

      target.x = mouse.x + (closestX - mouse.x) * w
      target.y = mouse.y + (closestY - mouse.y) * w

      const pullX = closestX - mouse.x
      const pullY = closestY - mouse.y
      const pullDist = Math.hypot(pullX, pullY) || 1
      deformT.dx = (pullX / pullDist) * w
      deformT.dy = (pullY / pullDist) * w

      const rect3 = bestEntry.el.getBoundingClientRect()
      const elCx3 = rect3.left + rect3.width / 2
      const elCy3 = rect3.top + rect3.height / 2
      const toC3X = mouse.x - elCx3
      const toC3Y = mouse.y - elCy3
      const toD3 = Math.hypot(toC3X, toC3Y) || 1
      nudgeT.x = (toC3X / toD3) * Math.min(toD3, 8 * w)
      nudgeT.y = (toC3Y / toD3) * Math.min(toD3, 8 * w)
      activateNudgeEl(bestEntry.el)

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
    inSnapZone = false
    activeElement = null
    ulActive = false
    renderMode.value = props.mode

    if (isSnapped.value) clearSnap()

    setRealCursor('none')
    deformT.dx = 0
    deformT.dy = 0
    nudgeT.x = 0
    nudgeT.y = 0
    ulT.phase1 = 0
    ulT.halfW = 0

    // Retire the active nudge element so it springs back to origin too.
    retireNudgeEl()

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

// --- Spring & render loop ----------------------------------------------------

function springStep(key) {
  const k = inSnapZone ? props.snapStiffness : props.stiffness
  spring.value[key] += (target[key] - spring.value[key]) * k
}

const UL_K = 0.14
const DEFORM_K = 0.18
const NUDGE_K = 0.12

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

  deform.value.dx += (deformT.dx - deform.value.dx) * DEFORM_K
  deform.value.dy += (deformT.dy - deform.value.dy) * DEFORM_K

  nudge.value.x += (nudgeT.x - nudge.value.x) * NUDGE_K
  nudge.value.y += (nudgeT.y - nudge.value.y) * NUDGE_K

  // Spring ALL previously nudged elements back toward their original position.
  for (const [el, pos] of prevNudgeMap) {
    pos.x += (0 - pos.x) * (NUDGE_K * 0.5)
    pos.y += (0 - pos.y) * (NUDGE_K * 0.5)
    if (Math.abs(pos.x) > 0.01 || Math.abs(pos.y) > 0.01) {
      el.style.transform = `translate(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px)`
      el.style.willChange = 'transform'
    } else {
      // Settled — clean up and remove from map.
      el.style.transform = ''
      el.style.willChange = ''
      prevNudgeMap.delete(el)
    }
  }

  const currentNudgeEl = nudgeEl ?? prevSnappedEl
  if (currentNudgeEl) {
    const nx = nudge.value.x
    const ny = nudge.value.y
    if (Math.abs(nx) > 0.01 || Math.abs(ny) > 0.01) {
      currentNudgeEl.style.transform = `translate(${nx.toFixed(2)}px, ${ny.toFixed(2)}px)`
      currentNudgeEl.style.willChange = 'transform'
    } else {
      currentNudgeEl.style.transform = ''
      currentNudgeEl.style.willChange = ''
    }
  }

  const s = spring.value
  if (isSnapped.value && snappedEl.value?.dataset.cursorGlyph === 'true') {
    const p = snappedEl.value.dataset.cursorGlyphPath
    if (p) currentPath.value = p
  } else {
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
  }

  rafId = requestAnimationFrame(tick)
}

// --- Virtual click interception ----------------------------------------------

const SYNTHETIC_MARKER = '__cursorMorphSynthetic'

function onCaptureClick(e) {
  if (!props.virtualClick) return
  if (e[SYNTHETIC_MARKER]) return

  if (isSnapped.value && snapIsPassive.value) {
    e.preventDefault()
    e.stopPropagation()
    return
  }

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

// --- Event listeners ---------------------------------------------------------

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

  if (props.virtualClick) setRealCursor('none')

  observer = new MutationObserver(scanTargets)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      'data-cursor-target',
      'data-cursor-offset',
      'data-cursor-mode',
      'data-cursor-snap-color',
      'data-cursor-passive',
    ],
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('click', onCaptureClick, { capture: true })
  cancelAnimationFrame(rafId)
  observer?.disconnect()
  prevSnappedEl?.classList.remove(SNAP_CLASS)
  emitLeave(prevSnappedEl)
  // Clean up every element that was ever nudged.
  for (const el of prevNudgeMap.keys()) {
    el.style.transform = ''
    el.style.willChange = ''
  }
  prevNudgeMap.clear()
  if (nudgeEl) {
    nudgeEl.style.transform = ''
    nudgeEl.style.willChange = ''
  }
  if (prevSnappedEl) {
    prevSnappedEl.style.transform = ''
    prevSnappedEl.style.willChange = ''
  }
})
</script>

<style scoped>
.cursor-morph {
  cursor: none;
}
</style>
