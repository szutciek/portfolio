<template>
  <div ref="container" class="screenshot-background">
    <div class="perspective" :style="perspectiveStyle">
      <div class="grid" :style="gridStyle">
        <div v-for="(column, i) in arrangedItems" :key="i" :style="`width: ${60 / nColumns}vw`">
          <img v-for="(row, j) in column" :key="j" :src="images[row]" draggable="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  images: { type: Array, default: [] },
})

const nColumns = 7
const nRows = 10
const opacity = 0.067

const perspective = 500
const rX = 10
const rY = 10
const rZ = -10

const perspectiveStyle = {
  perspective: `${perspective}px`,
  perspectiveOrigin: `50% 50%`,
}
const gridStyle = ref({
  opacity: opacity,
  gridTemplateColumns: `repeat(${nColumns}, 1fr)`,
  transform: [
    'translate(0, -50%)',
    `rotateX(${rX}deg)`,
    `rotateY(${rY}deg)`,
    `rotateZ(${rZ}deg)`,
  ].join(' '),
})

const arrangedItems = ref([])
for (let i = 0; i < nColumns; i++) {
  arrangedItems.value.push([])
}

const sampleOrder = () => {
  if (!props.images) return
  const numberReps = Math.ceil((nColumns * nRows) / props.images.length)
  const repLimit = Array(props.images.length).fill(numberReps)
  let prevIndex = null
  for (let i = 0; i < nColumns; i++) {
    for (let j = 0; j < nRows; j++) {
      const imageIndex = Math.floor(Math.random() * props.images.length)
      const accept = repLimit[imageIndex] !== 0 && imageIndex !== prevIndex
      if (!accept) {
        j--
        continue
      }
      repLimit[imageIndex]--
      arrangedItems.value[i][j] = imageIndex
    }
  }
}
sampleOrder()
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

.perspective {
  position: absolute;
  inset: 0;
}

.grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: flat;
  display: grid;
  gap: 10px;
  align-items: center;
}

img {
  width: 100%;
  object-fit: contain;
}
</style>
