<template>
  <div ref="start"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  dx: { type: Number, required: true },
  dy: { type: Number, required: true },
  options: { type: Object, default: () => ({}) },
})

const start = ref(null)

const createRandomCurve = (dx, dy, options = {}) => {
  const { curvature = 0.4, stroke = 'red', strokeWidth = 8 } = options

  const svgNS = 'http://www.w3.org/2000/svg'

  const width = Math.max(Math.abs(dx), 1)
  const height = Math.max(Math.abs(dy), 1)

  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)

  // Adjust viewBox for negative direction
  const minX = dx < 0 ? dx : 0
  const minY = dy < 0 ? dy : 0

  svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`)

  const length = Math.sqrt(dx * dx + dy * dy)
  if (length === 0) return svg

  const nx = -dy / length
  const ny = dx / length

  const r1 = (Math.random() - 0.5) * curvature * length
  const r2 = (Math.random() - 0.5) * curvature * length

  const cx1 = dx * 0.33 + nx * r1
  const cy1 = dy * 0.33 + ny * r1

  const cx2 = dx * 0.66 + nx * r2
  const cy2 = dy * 0.66 + ny * r2

  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute('d', `M 0 0 C ${cx1} ${cy1}, ${cx2} ${cy2}, ${dx} ${dy}`)

  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', stroke)
  path.setAttribute('stroke-width', strokeWidth)

  svg.appendChild(path)
  return svg
}

const render = () => {
  if (!start.value) return
  start.value.innerHTML = ''
  console.log(start.value)
  start.value.appendChild(createRandomCurve(props.dx, props.dy, props.options))
}

onMounted(render)
watch(() => [props.dx, props.dy, props.options], render)
</script>
