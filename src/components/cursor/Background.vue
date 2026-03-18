<template>
  <canvas ref="canvas" class="cursor-background" aria-hidden="true" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ── Config ────────────────────────────────────────────────────────────────────
const GRID_SIZE = 40 // px between crosses
const CROSS_SIZE = 5 // half-arm length in px
const LINE_WIDTH = 1 // stroke width
const RADIUS = 200 // cursor influence radius in px
const BASE_ALPHA = 0 // resting opacity of crosses
const PEAK_ALPHA = 0.5 // opacity at cursor centre
const COLOR = '#ec7837' // tweak to match your palette
const RIPPLE_EASE = 1 // how fast brightness trails the cursor (0–1)

// ── State ─────────────────────────────────────────────────────────────────────
const canvas = ref(null)
let ctx,
  cols,
  rows,
  dots = []
let mouse = { x: -9999, y: -9999 }
let smoothMouse = { x: -9999, y: -9999 }
let rafId

// ── Grid ──────────────────────────────────────────────────────────────────────
function buildGrid() {
  const { offsetWidth: w, offsetHeight: h } = canvas.value
  canvas.value.width = w
  canvas.value.height = h

  cols = Math.ceil(w / GRID_SIZE) + 1
  rows = Math.ceil(h / GRID_SIZE) + 1

  // Offset grid so it's centred
  const offX = (w % GRID_SIZE) / 2
  const offY = (h % GRID_SIZE) / 2

  dots = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({
        x: offX + c * GRID_SIZE,
        y: offY + r * GRID_SIZE,
        alpha: BASE_ALPHA,
        target: BASE_ALPHA,
      })
    }
  }
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function drawCross(x, y, alpha) {
  ctx.globalAlpha = alpha
  ctx.beginPath()
  ctx.moveTo(x - CROSS_SIZE, y)
  ctx.lineTo(x + CROSS_SIZE, y)
  ctx.moveTo(x, y - CROSS_SIZE)
  ctx.lineTo(x, y + CROSS_SIZE)
  ctx.stroke()
}

function tick() {
  // Smooth mouse position
  smoothMouse.x += (mouse.x - smoothMouse.x) * RIPPLE_EASE
  smoothMouse.y += (mouse.y - smoothMouse.y) * RIPPLE_EASE

  const { width: w, height: h } = canvas.value
  ctx.clearRect(0, 0, w, h)

  ctx.strokeStyle = `${COLOR}`
  ctx.lineWidth = LINE_WIDTH

  for (const d of dots) {
    const dx = d.x - smoothMouse.x
    const dy = d.y - smoothMouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const t = Math.max(0, 1 - dist / RADIUS) // 0→1 proximity

    // Smooth falloff: ease-out quad
    d.target = BASE_ALPHA + (PEAK_ALPHA - BASE_ALPHA) * (t * t)

    // Interpolate current alpha toward target
    d.alpha += (d.target - d.alpha) * 0.12

    drawCross(d.x, d.y, d.alpha)
  }

  ctx.globalAlpha = 1
  rafId = requestAnimationFrame(tick)
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
function onMouseMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

function onMouseLeave() {
  mouse.x = -9999
  mouse.y = -9999
}

let ro
onMounted(() => {
  ctx = canvas.value.getContext('2d')
  buildGrid()
  tick()

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mouseleave', onMouseLeave, { passive: true })

  ro = new ResizeObserver(buildGrid)
  ro.observe(document.body)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseleave', onMouseLeave)
  ro?.disconnect()
})
</script>

<style scoped>
.cursor-background {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  display: block;
}
</style>
