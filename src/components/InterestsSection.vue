<template>
  <section marker class="interests _half" ref="container">
    <AdjacentIcon class="title _subsectionTitle" overrideGap="var(--base3)">
      <!-- prettier-ignore -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><circle fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" cx="256" cy="56" r="40"/><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M204.23 274.44c2.9-18.06 4.2-35.52-.5-47.59-4-10.38-12.7-16.19-23.2-20.15L88 176.76c-12-4-23.21-10.7-24-23.94-1-17 14-28 29-24 0 0 88 31.14 163 31.14s162-31 162-31c18-5 30 9 30 23.79 0 14.21-11 19.21-24 23.94l-88 31.91c-8 3-21 9-26 18.18-6 10.75-5 29.53-2.1 47.59l5.9 29.63 37.41 163.9c2.8 13.15-6.3 25.44-19.4 27.74S308 489 304.12 476.28l-37.56-115.93q-2.71-8.34-4.8-16.87L256 320l-5.3 21.65q-2.52 10.35-5.8 20.48L208 476.18c-4 12.85-14.5 21.75-27.6 19.46s-22.4-15.59-19.46-27.74l37.39-163.83z"/></svg>
      <h2>Interests & Activities<span>/ About me</span></h2>
    </AdjacentIcon>
    <div class="content">
      <div class="section">
        <h3>Sports</h3>
        <div class="list _interest-list">
          <OpaqueButton
            color="var(--bg-color-d)"
            data-url="/images/interests/dive.avif"
            :highlightOnly="true"
          >
            <p>Swimming</p>
          </OpaqueButton>
          <OpaqueButton
            color="var(--bg-color-d)"
            data-url="/images/interests/bike.avif"
            :highlightOnly="true"
          >
            <p>Biking</p>
          </OpaqueButton>
          <OpaqueButton color="var(--bg-color-d)" :highlightOnly="true">
            <p>Running</p>
          </OpaqueButton>
          <OpaqueButton color="var(--bg-color-d)" :highlightOnly="true">
            <p>Skydiving</p>
          </OpaqueButton>
        </div>
      </div>
      <div class="section">
        <h3>Free Time</h3>
        <div class="list _interest-list">
          <OpaqueButton
            color="var(--bg-color-d)"
            data-url="/images/interests/cs2.avif"
            :highlightOnly="true"
          >
            <p>CS2</p>
          </OpaqueButton>
          <OpaqueButton color="var(--bg-color-d)" :highlightOnly="true">
            <p>Memes a.k.a. Brainrot</p>
          </OpaqueButton>
        </div>
      </div>
      <div class="section">
        <h3>Computer Science</h3>
        <div class="list _interest-list">
          <OpaqueButton color="var(--bg-color-d)" :highlightOnly="true">
            <p>Full-Stack Web Development</p>
          </OpaqueButton>
          <OpaqueButton color="var(--bg-color-d)" :highlightOnly="true">
            <p>Cybersecurity</p>
          </OpaqueButton>
        </div>
      </div>
    </div>

    <!-- Teleported to body so fixed positioning is never clipped by a parent -->
    <Teleport to="body">
      <img ref="cursorImageEl" class="_cursor-follow-image" src="" alt="" />
    </Teleport>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCursorSnap } from '@/composables/useCursorSnap.js'
import gsap from 'gsap'

const props = defineProps({
  scroll: Number,
})
const { isSnapped, snappedEl } = useCursorSnap()

const cursorImageEl = ref(null)

// Set hidden state immediately on mount — no flash
onMounted(() => {
  gsap.set(cursorImageEl.value, {
    opacity: 0,
    scale: 0.88,
    x: 0,
    y: 0,
  })
})

/**
 * Move the image to follow the cursor with a smooth lag.
 */
function trackMouse(event) {
  gsap.to(cursorImageEl.value, {
    left: event.clientX,
    top: event.clientY,
    duration: 0.35,
    ease: 'power3.out',
    overwrite: 'auto',
  })
}

/**
 * Show the image at the cursor. Swaps src and animates in.
 * @param {string} imageSrc - path or URL of the image to show
 */
function onHover(imageSrc) {
  const el = cursorImageEl.value
  el.src = imageSrc

  gsap.killTweensOf(el, 'opacity,scale')
  gsap.to(el, {
    opacity: 1,
    scale: 1,
    duration: 0.25,
    ease: 'power2.out',
  })
}

/**
 * Hide the cursor image.
 * @param {string} [imageSrc] - optional guard: only hide if src still matches
 */
function onUnHover(imageSrc) {
  const el = cursorImageEl.value
  if (imageSrc && el.src !== imageSrc) return

  gsap.killTweensOf(el, 'opacity,scale')
  gsap.to(el, {
    opacity: 0,
    scale: 0.88,
    duration: 0.18,
    ease: 'power2.in',
  })
}

const handleHover = () => {
  if (isSnapped.value !== true) return onUnHover()
  if (!snappedEl?.value?.parentNode?.classList?.contains('_interest-list')) return onUnHover()
  const url = snappedEl?.value?.dataset?.url
  if (!url) return onUnHover()
  if (url === cursorImageEl?.value?.src) return
  onHover(url)
}

watch(isSnapped, handleHover)

const container = ref(null)

onMounted(() => {
  if (!container?.value) return
  container.value.addEventListener('mousemove', trackMouse)
})
onUnmounted(() => {
  container.value.removeEventListener('mousemove', trackMouse)
})
</script>

<style scoped>
.interests {
  width: calc(var(--full-width) * 6 / 10);
  height: 100vh;
  padding: var(--base8);
  background-color: var(--bg-color-l);
  border-bottom-left-radius: calc(var(--full-width) * 1 / 10);
}
.content {
  margin-top: var(--base8);
}
.section {
  margin-bottom: var(--base4);
}
.section h3 {
  margin-left: var(--base2);
}
.section .list {
  margin-top: var(--base);
  display: flex;
  flex-wrap: wrap;
  gap: var(--base);
}
</style>

<!-- Not scoped — the img lives outside this component's DOM subtree after Teleport -->
<style>
._cursor-follow-image {
  position: fixed;
  pointer-events: none;
  z-index: 999999;
  max-width: 15vw;
  max-height: 25vh;
  object-fit: cover;
}
</style>
