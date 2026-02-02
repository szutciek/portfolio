<template>
  <div ref="container" class="_parallaxPicture">
    <slot />
  </div>
</template>

<script setup>
import { watch, defineProps, ref, onMounted } from 'vue'

const container = ref(null)

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0.5,
  },
})

let image = null
let offset = 0
let velocity = 1

onMounted(() => {
  image = container.value.querySelector('img')
  offset = parseFloat(image.getAttribute('offset')) || 0
  velocity = parseFloat(image.getAttribute('velocity')) || 1
})

const move = (p) => {
  const y = (p - 0.5) * window.innerHeight * velocity + offset
  image.style.transform = `translateY(${-y}px)`
}

watch(() => props.progress, move)
</script>

<style>
._parallaxPicture {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
._parallaxPicture img {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
