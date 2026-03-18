<template>
  <div ref="container" class="_parallaxContent">
    <div class="content">
      <slot />
    </div>
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

let content = null
let offset = 0
let velocity = 1

onMounted(() => {
  content = container.value.querySelector('.content')
  offset = parseFloat(content.getAttribute('offset')) || 0
  velocity = parseFloat(content.getAttribute('velocity')) || 1
})

const move = (p) => {
  const y = (p - 0.5) * window.innerHeight * velocity + offset
  content.style.transform = `translateY(${-y}px)`
}

watch(() => props.progress, move)
</script>

<style>
._parallaxContent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
._parallaxContent img,
._parallaxContent .content {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
