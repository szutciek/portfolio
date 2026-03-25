<template>
  <section vertical>
    <div class="header">
      <div class="leftAnchor">
        <TileImageGrid
          class="projectTiles"
          :images="[
            '/images/checkout/touchscreen.avif',
            '/images/zolwie/game.avif',
            '/images/myaura/home.avif',
            '/images/myaura/checkout.avif',
            '/images/roomganizer/scheduler.avif',
            '/images/sso/trust.avif',
            '/images/wcgame/amongus.avif',
          ]"
        />
        <div class="renderRail" ref="monitor">
          <SimpleModelRender
            class="render"
            modelUrl="/models/setup.glb"
            :cameraPosition="[2, 0, 0.5]"
            :limitControls="true"
            :scrollProgress="props.scroll"
            :scrollTransform="{
              positionStart: [0, 0, 0],
              positionEnd: [0, 0, 0],
              rotationStart: [0, 0, 0],
              rotationEnd: [0, 2 * Math.PI, 0],
              scaleStart: [1, 1, 1],
              scaleEnd: [1, 1, 1],
            }"
            screenMeshName="Screen"
            :screenTextureUrl="textureUrl"
          />
        </div>
      </div>
      <div class="description _half">
        <div class="box">
          <div class="main">
            <h1>MACIEJ SZUTER</h1>
            <AdjacentIcon>
              <!-- prettier-ignore -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="192" r="48" fill="none" stroke="#aaa" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
              <p>Eindhoven, The Netherlands</p>
            </AdjacentIcon>
          </div>
          <div class="infoGrid">
            <Link class="infoItem" data-cursor-target data-cursor-offset="10" :href="tue">
              <div class="logos">
                <img src="/images/logo/tue.avif" alt="TU/e Logo" />
              </div>
              <div>
                <p>Second Year Bachelor</p>
                <h3>Computer Science & Engineering</h3>
              </div>
              <AdjacentIcon class="onSnap" style="position: absolute; top: 5px; right: 5px">
                <p>Explore Program</p>
                <p>&nearr;</p>
              </AdjacentIcon>
            </Link>
            <div class="border"></div>
            <Link
              class="infoItem"
              data-cursor-target
              data-cursor-offset="10"
              href="/#projects"
              :smooth="true"
            >
              <div class="logos">
                <img src="/images/logo/kanapka.avif" alt="Kanapka Logo" />
                <img src="/images/logo/totem.avif" alt="Totem Game Dev Logo" />
              </div>
              <div>
                <p>5+ Years of Experience</p>
                <h3>Full Stack Web & Game Developer</h3>
              </div>
              <AdjacentIcon class="onSnap" style="position: absolute; top: 5px; right: 5px">
                <p>Browse Projects</p>
                <p>&nearr;</p>
              </AdjacentIcon>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCursorSnap } from '@/composables/useCursorSnap.js'

const { isSnapped, snappedEl } = useCursorSnap()

const props = defineProps({
  scroll: Number,
  nextPageScroll: Number,
})

const tue = `https://www.tue.nl/en/education/bachelor-college/bachelor-computer-science-and-engineering`

const monitor = ref(null)

const textureUrl = ref('/images/pic.avif')

const selectTexture = () => {
  if (props.scroll < 0.5) {
    textureUrl.value = `/images/pic.avif`
    return
  }
  if (snappedEl?.value?.dataset?.city === 'warsaw') {
    textureUrl.value = `/videos/warsaw-compressed.webm`
    return
  }
  if (snappedEl?.value?.dataset?.city === 'eindhoven') {
    textureUrl.value = `/videos/eindhoven-compressed.webm`
    return
  }
  textureUrl.value = `/images/aboutme.avif`
}

const scrollingToNext = (scroll) => {
  if (scroll > 0) {
    monitor.value.style.position = 'fixed'
    monitor.value.style.zIndex = '-1'
  } else {
    monitor.value.style.position = 'absolute'
  }
  monitor.value.style.transform = `translateX(-${scroll * 100}vw)`
}

watch(() => props.scroll, selectTexture)
watch(isSnapped, selectTexture)

watch(() => props.nextPageScroll, scrollingToNext)
</script>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100dvh;
}
.leftAnchor {
  position: relative;
  width: 100%;
  height: 100%;
}
.header .renderRail {
  position: absolute;
  width: 100%;
  height: 200dvh;
  z-index: 17;
}
.header .render {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
}
.leftAnchor .projectTiles {
  position: absolute;
  width: calc(100% + var(--base4));
  height: 100vh;
  z-index: -1;
}

.header .description {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100vh;
  width: 100%;
  padding: var(--base8) var(--base4);
  color: #fff;
  background-color: var(--bg-color-l);
  border-bottom-left-radius: var(--base4);
}

.header .box {
  border-left: 1px solid var(--bg-color-l);
}

.main {
  margin-bottom: var(--base8);
}

.infoGrid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: var(--base4);
}
.infoGrid .border {
  width: 100%;
  height: 100%;
  background-color: var(--bg-color-ll);
}
.infoItem {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  gap: var(--base2);
}
.infoItem .logos {
  display: flex;
  gap: var(--base);
}
.infoItem .logos img:first-of-type {
  margin-top: 0;
  height: var(--base4);
  min-width: var(--base4);
  max-width: var(--base8);
  width: min-content;
}
.infoItem .logos img {
  height: var(--base4);
  min-width: var(--base4);
  max-width: var(--base8);
  object-fit: contain;
}
.infoItem .onSnap {
  opacity: 0.2;
}
.infoItem.cursor-snapped .onSnap {
  opacity: 1;
}
@media (max-width: 1800px) {
  .header .description {
    padding: var(--base4);
  }
}
@media (max-width: 1200px) {
  .infoGrid {
    grid-template-columns: 1fr;
    gap: var(--base4);
  }
  .infoItem {
    border-left: none;
  }
}
</style>
