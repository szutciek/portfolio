<template>
  <div ref="container" class="screenshot-background">
    <div class="perspective" :style="perspectiveStyle">
      <div class="grid" :style="gridStyle">
        <div
          v-for="(column, i) in arrangement"
          :key="i"
          :style="`width: ${67 / arrangement.length}vw; transform: translateY(${((i % 2) + 1) * offset}px)`"
        >
          <img
            v-for="(row, j) in column"
            :key="j"
            :src="images[row]"
            :alt="alt(images[row])"
            draggable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  images: { type: Array, default: [] },
  arrangement: { type: Array, default: [] },
  offset: { type: Number, default: 0 },
})

const opacity = 0.1

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
  gridTemplateColumns: `repeat(${props.arrangement.length}, 1fr)`,
  transform: [
    'translate(0, -25%)',
    `rotateX(${rX}deg)`,
    `rotateY(${rY}deg)`,
    `rotateZ(${rZ}deg)`,
  ].join(' '),
})

const alt = (url) => url.split('/').at(-1)
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
  /* align-items: center; */
}

img {
  width: 100%;
  object-fit: contain;
}
</style>
