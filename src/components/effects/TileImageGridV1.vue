<template>
  <div ref="container" class="screenshot-background">
    <div class="perspective-wrap" :style="perspectiveStyle">
      <div class="grid-plane" :style="gridPlaneStyle">
        <div
          v-for="item in arrangedItems"
          :key="item.id"
          class="screenshot-cell"
          :style="item.style"
        >
          <img
            v-if="item.src"
            :src="item.src"
            :alt="`screenshot-${item.id}`"
            class="screenshot-img"
            draggable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Rotation-aware overflow:
 *
 * When the plane is rotated by rotateX / rotateY / rotateZ the axis-aligned
 * bounding box of its corners in screen-space grows.  We compute the 4 corners
 * of a hypothetical W×H plane, rotate them (ignoring perspective for a
 * conservative upper-bound), and find the max extents.  The ratio of that
 * bounding box to the original W×H tells us how much larger the plane must be
 * to still fill the container after rotation.
 */
function rotatedBBoxScale(rxDeg, ryDeg, rzDeg) {
  const toRad = (d) => (d * Math.PI) / 180
  const rx = toRad(rxDeg)
  const ry = toRad(ryDeg)
  const rz = toRad(rzDeg)

  // Rotation matrices (applied in X → Y → Z order, same as CSS)
  const cosX = Math.cos(rx),
    sinX = Math.sin(rx)
  const cosY = Math.cos(ry),
    sinY = Math.sin(ry)
  const cosZ = Math.cos(rz),
    sinZ = Math.sin(rz)

  // Combined rotation matrix R = Rz * Ry * Rx
  const m = [
    [cosY * cosZ, cosZ * sinX * sinY - cosX * sinZ, cosX * cosZ * sinY + sinX * sinZ],
    [cosY * sinZ, cosX * cosZ + sinX * sinY * sinZ, cosX * sinY * sinZ - cosZ * sinX],
    [-sinY, cosY * sinX, cosX * cosY],
  ]

  // Unit-square corners (we'll scale by actual W/H later; ratios are what matter)
  const corners = [
    [-0.5, -0.5, 0],
    [0.5, -0.5, 0],
    [0.5, 0.5, 0],
    [-0.5, 0.5, 0],
  ]

  let minX = Infinity,
    maxX = -Infinity
  let minY = Infinity,
    maxY = -Infinity

  for (const [x, y, z] of corners) {
    const rx2 = m[0][0] * x + m[0][1] * y + m[0][2] * z
    const ry2 = m[1][0] * x + m[1][1] * y + m[1][2] * z
    if (rx2 < minX) minX = rx2
    if (rx2 > maxX) maxX = rx2
    if (ry2 < minY) minY = ry2
    if (ry2 > maxY) maxY = ry2
  }

  return {
    scaleW: maxX - minX, // relative to original width  (1 = no change)
    scaleH: maxY - minY, // relative to original height
  }
}

// Seeded LCG PRNG — returns floats in [0, 1)
function makeLcg(seed) {
  let s = seed >>> 0
  return () => {
    s = ((1664525 * s + 1013904223) & 0xffffffff) >>> 0
    return s / 0x100000000
  }
}

export default {
  name: 'ScreenshotBackground',

  props: {
    /** Array of image URLs */
    images: { type: Array, default: () => [] },

    /** Column width in px */
    columnWidth: { type: Number, default: 240 },

    /** Base / average row height in px */
    rowHeightBase: { type: Number, default: 160 },

    /**
     * Each cell's height is: rowHeightBase * (1 ± rowHeightVariance).
     * 0 = all rows same height.  0.5 = heights range from 50% to 150% of base.
     */
    rowHeightVariance: { type: Number, default: 0.45 },

    /** Gap between cells in px */
    gap: { type: Number, default: 16 },

    /** Base opacity */
    opacity: { type: Number, default: 0.18 },

    /** Perspective depth (px) */
    perspective: { type: Number, default: 1400 },

    rotateX: { type: Number, default: 35 },
    rotateY: { type: Number, default: -20 },
    rotateZ: { type: Number, default: 8 },

    originX: { type: String, default: '50%' },
    originY: { type: String, default: '55%' },

    /** 'sequential' | 'random' */
    arrangement: {
      type: String,
      default: 'random',
      validator: (v) => ['sequential', 'random'].includes(v),
    },

    /** Seed used for both height variation and image shuffle */
    randomSeed: { type: Number, default: 42 },
  },

  data() {
    return { containerW: 0, containerH: 0 }
  },

  mounted() {
    this.measure()
    this._ro = new ResizeObserver(this.measure)
    this._ro.observe(this.$refs.container)
  },

  beforeUnmount() {
    this._ro?.disconnect()
  },

  computed: {
    /**
     * How much larger (in each axis) the plane's bounding box becomes after
     * the CSS rotations — used to inflate the grid so it still covers the
     * viewport after rotation.
     */
    bboxScale() {
      return rotatedBBoxScale(this.rotateX, this.rotateY, this.rotateZ)
    },

    /**
     * Required plane size to fully cover the container after rotation.
     * We need the plane's *projected* extent to be at least containerW × containerH,
     * so the plane itself must be containerW/scaleW × containerH/scaleH.
     * Add a fixed safety margin on top (extra cells).
     */
    requiredPlaneW() {
      return (this.containerW || 800) / Math.max(this.bboxScale.scaleW, 0.1)
    },
    requiredPlaneH() {
      return (this.containerH || 600) / Math.max(this.bboxScale.scaleH, 0.1)
    },

    /** Number of columns that fill the required plane width */
    columns() {
      return Math.ceil(this.requiredPlaneW / (this.columnWidth + this.gap)) + 1
    },

    /**
     * Per-column arrays of cell heights.
     * Heights are seeded-random per column so each column has an independent
     * rhythm, giving a genuine masonry feel rather than row-aligned heights.
     *
     * We generate enough heights so the column's total span exceeds
     * requiredPlaneH.
     */
    columnHeights() {
      const { rowHeightBase, rowHeightVariance, gap, requiredPlaneH, columns, randomSeed } = this
      const rng = makeLcg(randomSeed)

      return Array.from({ length: columns }, (_, col) => {
        // Give each column its own sub-seed so columns differ
        const colRng = makeLcg((randomSeed ^ (col * 2654435761)) >>> 0)
        const heights = []
        let cumulative = 0
        while (cumulative < requiredPlaneH + rowHeightBase * 2) {
          const h = Math.round(
            rowHeightBase * (1 - rowHeightVariance + colRng() * rowHeightVariance * 2),
          )
          heights.push(h)
          cumulative += h + gap
        }
        return heights
      })
    },

    /** Actual plane dimensions based on generated column heights */
    gridW() {
      return this.columns * (this.columnWidth + this.gap) - this.gap
    },
    gridH() {
      // Tallest column determines grid height
      const { gap } = this
      return Math.max(
        ...this.columnHeights.map((col) => col.reduce((sum, h) => sum + h + gap, 0) - gap),
      )
    },

    /** Flat list of all cells with pre-computed styles */
    arrangedItems() {
      const { columnHeights, columnWidth, gap, images, arrangement, randomSeed } = this

      // Build source list: total cells = sum of all column lengths
      const totalCells = columnHeights.reduce((s, c) => s + c.length, 0)
      let srcs
      if (!images.length) {
        srcs = Array(totalCells).fill(null)
      } else if (arrangement === 'sequential') {
        srcs = Array.from({ length: totalCells }, (_, i) => images[i % images.length])
      } else {
        const rng = makeLcg(randomSeed)
        const shuffled = [...images].sort(() => rng() - 0.5)
        srcs = Array.from({ length: totalCells }, (_, i) => shuffled[i % shuffled.length])
      }

      const items = []
      let srcIdx = 0

      columnHeights.forEach((heights, col) => {
        const left = col * (columnWidth + gap)
        let top = 0
        heights.forEach((h) => {
          items.push({
            id: srcIdx,
            src: srcs[srcIdx],
            style: {
              left: `${left}px`,
              top: `${top}px`,
              width: `${columnWidth}px`,
              height: `${h}px`,
            },
          })
          srcIdx++
          top += h + gap
        })
      })

      return items
    },

    perspectiveStyle() {
      return {
        perspective: `${this.perspective}px`,
        perspectiveOrigin: `${this.originX} ${this.originY}`,
      }
    },

    gridPlaneStyle() {
      const { rotateX, rotateY, rotateZ, opacity, gridW, gridH } = this
      return {
        width: `${gridW}px`,
        height: `${gridH}px`,
        opacity,
        transform: [
          'translate(-50%, -50%)',
          `rotateX(${rotateX}deg)`,
          `rotateY(${rotateY}deg)`,
          `rotateZ(${rotateZ}deg)`,
        ].join(' '),
      }
    },
  },

  methods: {
    measure() {
      const el = this.$refs.container
      if (!el) return
      this.containerW = el.offsetWidth
      this.containerH = el.offsetHeight
    },
  },
}
</script>

<style scoped>
.screenshot-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.perspective-wrap {
  position: absolute;
  inset: 0;
}

.grid-plane {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: flat;
  will-change: transform;
}

.screenshot-cell {
  position: absolute;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

.screenshot-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 6px;
}
</style>
