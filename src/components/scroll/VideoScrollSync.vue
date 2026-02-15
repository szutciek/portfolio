<template>
  <div ref="container" :class="[`_videoScrollSync`, `${objectFit}`]">
    <slot />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps } from 'vue'
import { gsap } from 'gsap'

const container = ref(null)
let videoEl = null
let tl = null

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0.5,
  },
  objectFit: {
    type: String,
    default: 'cover',
  },
})

onMounted(() => {
  videoEl = container.value.querySelector('video')
  if (!videoEl) return

  videoEl.pause()
  videoEl.muted = true
  videoEl.playsInline = true
  videoEl.preload = 'auto'

  videoEl.addEventListener(
    'loadedmetadata',
    () => {
      tl = gsap.timeline({ paused: true })

      tl.to(videoEl, {
        currentTime: videoEl.duration,
        ease: 'none',
      })
    },
    { once: true },
  )
})

let lastUpdate = performance.now()

const scrub = (p) => {
  if (!tl) return
  if (performance.now() - lastUpdate < 1000 / 24) return
  const progress = Math.min(1, Math.max(0, p))
  tl.progress(progress)
  lastUpdate = performance.now()
}

watch(() => props.progress, scrub)
</script>

<style>
._videoScrollSync {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
._videoScrollSync video {
  width: 100%;
  height: 100%;
}
._videoScrollSync.cover video {
  object-fit: cover;
}
._videoScrollSync.contain video {
  object-fit: contain;
}
</style>
