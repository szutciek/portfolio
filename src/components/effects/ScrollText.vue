<template>
  <div ref="containerRef" class="marquee-container">
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="marquee-row"
      :style="rowStyle(rowIndex)"
    >
      <span
        v-for="(item, itemIndex) in row"
        :key="itemIndex"
        class="marquee-item"
        :style="itemStyle"
        >{{ item }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  /**
   * Array of strings to repeat across the canvas.
   * They cycle through rows in order.
   */
  texts: {
    type: Array,
    default: () => ['Hello World'],
  },
  /**
   * Scroll position: 0 = far left, 1 = far right.
   */
  progress: {
    type: Number,
    default: 0,
    validator: (v) => v >= 0 && v <= 1,
  },
  /** CSS font-size value, e.g. "32px", "2rem", "clamp(1rem,3vw,2rem)" */
  fontSize: {
    type: String,
    default: '1rem',
  },
  /** Any valid CSS color */
  color: {
    type: String,
    default: '#ffffff',
  },
  /**
   * Horizontal gap between repeated items (px).
   */
  gap: {
    type: Number,
    default: 16,
  },
  /**
   * How many extra tile-widths the scroll travels across (controls range).
   * Default 2 means the strip scrolls two full tile-widths from left to right.
   */
  scrollRange: {
    type: Number,
    default: 5,
  },
  /**
   * Vertical stagger: each row is offset horizontally by this fraction
   * of the tile width, multiplied by the row index.
   */
  rowStagger: {
    type: Number,
    default: 0.25,
  },
})

// ── Container size tracking ──────────────────────────────────────────────────

const containerRef = ref(null)
const containerWidth = ref(0)
const containerHeight = ref(0)

let ro
onMounted(() => {
  ro = new ResizeObserver(([entry]) => {
    containerWidth.value = entry.contentRect.width
    containerHeight.value = entry.contentRect.height
  })
  ro.observe(containerRef.value)
})
onBeforeUnmount(() => ro?.disconnect())

// ── Layout math ──────────────────────────────────────────────────────────────

/** Parse a CSS size string to a pixel number (best-effort). */
function parsePx(val) {
  const n = parseFloat(val)
  if (String(val).includes('rem')) return n * 16
  return n || 32
}

/**
 * Approximate single-tile width (one text label + gap).
 * Uses the longest label so every row has consistent spacing.
 */
const tileWidth = computed(() => {
  const longestText = props.texts.reduce((a, b) => (a.length >= b.length ? a : b), '')
  const pxSize = parsePx(props.fontSize)
  return longestText.length * pxSize * 0.55 + props.gap
})

/** Line height in px */
const lineHeight = computed(() => parsePx(props.fontSize) * 1.6)

/** Number of rows needed to fill the container height. */
const numRows = computed(() => Math.ceil(containerHeight.value / lineHeight.value) + 1)

/**
 * Base scroll travel for a normal (1×) row over the full 0→1 progress range.
 * Odd rows travel 2× this distance, so their strip is also 2× as long.
 */
const scrollTravel = computed(() => props.scrollRange * tileWidth.value)

/** Tiles needed for a row with a given speed multiplier. */
function tilesForSpeed(speedMult) {
  const tw = tileWidth.value
  const travel = scrollTravel.value * speedMult
  const staggerBudget = props.rowStagger * numRows.value * tw
  return Math.ceil((containerWidth.value + travel + staggerBudget + tw * 2) / tw)
}

/**
 * Build the 2-D text array.
 * Odd rows get 2× as many tiles to cover their longer travel distance.
 * Tiles are allocated once; panning is done purely by translateX.
 */
const rows = computed(() => {
  const result = []
  for (let r = 0; r < numRows.value; r++) {
    const count = tilesForSpeed(r % 2 === 0 ? 1 : 2)
    const row = []
    for (let c = 0; c < count; c++) {
      row.push(props.texts[(r + c) % props.texts.length])
    }
    result.push(row)
  }
  return result
})

// ── Style helpers ─────────────────────────────────────────────────────────────

/**
 * Per-row translateX — no modulo, no wrapping, pure linear pan.
 *
 * All rows scroll in the same direction (left).
 * Even rows travel   scrollTravel px over progress 0→1.
 * Odd  rows travel 2×scrollTravel px over progress 0→1 (twice as fast).
 *
 * Stagger shifts each row's start position by rowIndex × rowStagger × tileWidth.
 */
function rowStyle(rowIndex) {
  const tw = tileWidth.value
  const speed = rowIndex % 2 === 0 ? 1 : 2
  const travel = scrollTravel.value * speed
  const stagger = rowIndex * props.rowStagger * tw
  const pan = -(props.progress * travel) - stagger

  return {
    transform: `translateX(${pan}px)`,
    top: `${rowIndex * lineHeight.value}px`,
    gap: `${props.gap}px`,
    lineHeight: `${lineHeight.value}px`,
    willChange: 'transform',
  }
}

const itemStyle = computed(() => ({
  fontSize: props.fontSize,
  color: props.color,
  whiteSpace: 'nowrap',
  userSelect: 'none',
}))
</script>

<style scoped>
.marquee-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.marquee-row {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  /* gap is set inline */
}

.marquee-item {
  display: inline-block;
  flex-shrink: 0;
  font-weight: 700;
}
</style>
