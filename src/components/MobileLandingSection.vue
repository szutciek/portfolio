<template>
  <section class="mobileLanding">
    <div class="visual">
      <TileImageGrid
        class="projectTiles"
        :images="bgImages"
        :offset="gridOffset"
        :arrangement="bgArrangemenet"
      />
      <SimpleModelRender
        v-if="renderReady"
        class="render"
        modelUrl="/models/setup.glb"
        :cameraPosition="[1.65, 0, 0.39]"
        :limitControls="true"
        :scrollProgress="0"
        :scrollTransform="{
          // shift so the Screen mesh (not the whole setup) sits at the camera target
          positionStart: [-0.017, -0.046, 0.045],
          positionEnd: [-0.017, -0.046, 0.045],
          rotationStart: [0, 0, 0],
          rotationEnd: [0, 2 * Math.PI, 0],
          scaleStart: [1, 1, 1],
          scaleEnd: [1, 1, 1],
        }"
        screenMeshName="Screen"
        screenTextureUrl="/images/pic.avif"
      />
    </div>
    <LandingDescription class="island" />
  </section>
</template>

<script setup>
// Intro: play the desktop scroll-out (offset = -scroll * 500) in reverse,
// so the columns slide down into place when the page opens.
const INTRO_DISTANCE = 500
const INTRO_DURATION = 1600
const gridOffset = ref(-INTRO_DISTANCE)
let introFrame = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gridOffset.value = 0
    return
  }
  const start = performance.now()
  const step = (now) => {
    const t = Math.min((now - start) / INTRO_DURATION, 1)
    const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
    gridOffset.value = -INTRO_DISTANCE * (1 - eased)
    if (t < 1) introFrame = requestAnimationFrame(step)
  }
  introFrame = requestAnimationFrame(step)
})

onBeforeUnmount(() => cancelAnimationFrame(introFrame))

// SimpleModelRender sizes its canvas once, on mount. The visual area only
// reaches its final height once fonts and images in the island have loaded,
// so mount the render after that so the canvas matches .three-container.
const renderReady = ref(false)

onMounted(async () => {
  if (document.readyState !== 'complete') {
    await new Promise((resolve) => window.addEventListener('load', resolve, { once: true }))
  }
  await document.fonts.ready
  // let layout settle for a frame before measuring
  await new Promise((resolve) => requestAnimationFrame(resolve))
  renderReady.value = true
})

// Same tiles as the desktop LandingSection
const bgImages = [
  '/images/checkout/touchscreen.avif',
  '/images/myaura/home.avif',
  '/images/myaura/checkout.avif',
  '/images/myaura/payment.avif',
  '/images/zolwie/menu.avif',
  '/images/zolwie/game.avif',
  '/images/roomganizer/scheduler.avif',
  '/images/roomganizer/map.avif',
  '/images/roomganizer/timeline.avif',
  '/images/sso/accounts.avif',
  '/images/sso/trust.avif',
  '/images/wcgame/amongus.avif',
]
const bgArrangemenet = [
  [2, 3, 11, 9, 5, 6],
  [4, 0, 7],
  [11, 7, 1, 6, 3, 11],
  [4, 5, 4, 2],
  [6, 0, 1, 8],
  [9, 3, 2, 7],
]
</script>

<style scoped>
.mobileLanding {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.visual {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
}
/* Sized/positioned by the visual area as before, but not clipped by it:
   the columns may run down under the island (the section clips at the screen) */
.visual .projectTiles {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: visible;
}
.visual .render {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* Floating island, same rounding as the desktop panel's bottom-left corner */
.island {
  position: relative;
  z-index: 2;
  margin: 0 var(--base2) calc(var(--base2) + env(safe-area-inset-bottom));
  padding: var(--base2);
  background-color: var(--bg-color-l);
  border: 1px solid #1f1f1f;
  border-radius: var(--base);
  /* SVG icons use currentColor; desktop gets #fff from its panel */
  color: #fff;
}
</style>

<!--
  Unscoped: these style elements inside child components (LandingDescription,
  TileImageGrid, SimpleModelRender), which scoped CSS can't reach.
  Everything is prefixed with .mobileLanding so it only applies here.
-->
<style>
/* Keep the canvas pinned to .three-container */
.mobileLanding .visual .render canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* Typography, scaled down for phones */
.mobileLanding .island .name {
  /* floor keeps it clearly larger than the 16px tab headings */
  font-size: clamp(24px, 7vw, 40px);
  line-height: 1.1;
  margin-bottom: var(--base);
}
.mobileLanding .island .main {
  margin-bottom: 32px;
}
.mobileLanding .island .infoGrid {
  gap: var(--base);
}
.mobileLanding .island .infoItem {
  gap: 12px;
}
.mobileLanding .island .infoItem .logos {
  gap: 4px;
}
/* extra .infoGrid so this also beats LandingDescription's img:first-of-type rule */
.mobileLanding .island .infoGrid .infoItem .logos img {
  height: 24px;
  min-width: 24px;
}
/* No projects section on mobile yet, so hide its "See Details" label */
.mobileLanding .island .infoItem[href='/#projects'] .onSnap {
  display: none;
}
.mobileLanding .island p {
  font-size: 14px;
}
.mobileLanding .island h3 {
  font-size: 16px;
}

/* Background grid: overscan so the tilted grid covers the screen,
   let columns fill their track and tighten spacing */
.mobileLanding .projectTiles .grid {
  width: 140%;
  left: -20%;
  gap: 4px;
}
.mobileLanding .projectTiles .grid > div {
  width: auto !important;
}
.mobileLanding .projectTiles .grid img {
  display: block;
  margin-bottom: 4px;
}
</style>
