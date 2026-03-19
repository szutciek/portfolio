<template>
  <section vertical>
    <div class="header">
      <div class="renderAnchor">
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
            <div
              class="infoItem"
              data-cursor-target
              data-cursor-offset="12"
              @click="
                openUrl(
                  `https://www.tue.nl/en/education/bachelor-college/bachelor-computer-science-and-engineering`,
                )
              "
            >
              <img src="/images/tue.png" alt="TU/e Logo" />
              <div>
                <p>Second Year Bachelor</p>
                <h2>Computer Science & Engineering</h2>
              </div>
              <AdjacentIcon class="onSnap" style="position: absolute; top: 4px; right: 4px">
                <p>Study Info</p>
                <p>&nearr;</p>
              </AdjacentIcon>
            </div>
            <div class="border"></div>
            <div
              class="infoItem"
              data-cursor-target
              data-cursor-offset="12"
              @click="openUrl(`https://github.com/szutciek`)"
            >
              <img src="/images/kanapka.png" alt="Kanapka Logo" />
              <div>
                <p>6+ Years of Experience</p>
                <h2>Full Stack Web & Game Developer</h2>
              </div>
              <AdjacentIcon class="onSnap" style="position: absolute; top: 4px; right: 4px">
                <p>GitHub</p>
                <p>&nearr;</p>
              </AdjacentIcon>
            </div>
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

const monitor = ref(null)

const textureUrl = ref('/images/pic.png')

const selectTexture = () => {
  if (props.scroll < 0.5) {
    textureUrl.value = `/images/pic.png`
    return
  }
  if (snappedEl?.value?.dataset?.city === 'warsaw') {
    textureUrl.value = `/videos/warsaw.webm`
    return
  }
  if (snappedEl?.value?.dataset?.city === 'eindhoven') {
    textureUrl.value = `/videos/eindhoven.webm`
    return
  }
  textureUrl.value = `/images/aboutme.png`
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

const openUrl = (url) => {
  window.open(url)
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
.renderAnchor {
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

.header .description {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100vh;
  width: 100%;
  padding: 80px 40px 70px 0;
  color: #fff;
  background-color: var(--bg-color-l);
}

.header .box {
  border-left: 1px solid var(--bg-color-l);
  padding-left: 40px;
}

.main {
  margin-bottom: 100px;
}
.main img {
  aspect-ratio: 1;
  border-radius: 4px;
}

.infoGrid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 40px;
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
  gap: 20px;
}
.infoItem img {
  height: 40px;
  min-width: 40px;
  max-width: 80px;
  width: min-content;
  object-fit: contain;
}
.infoItem .onSnap {
  display: none;
}
.infoItem.cursor-snapped .onSnap {
  display: flex;
}

@media (max-width: 1200px) {
  .infoGrid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .infoItem {
    border-left: none;
    padding-left: 0;
  }
}
</style>
