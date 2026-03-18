<template>
  <div class="project">
    <div class="text">
      <h1>Roomganizer</h1>
      <p>REVOLUTIONARY FACILITY MANAGEMENT SYSTEM</p>
      <div class="actions">
        <OpaqueButton @click="openUrl(`https://roomganizer.kanapka.eu/`)">
          <AdjacentIcon>
            <p>Try it out</p>
            <p>&nearr;</p>
          </AdjacentIcon>
        </OpaqueButton>
        <TransparentButton @click="openUrl(`https://github.com/szutciek/roomganizer`)">
          <AdjacentIcon>
            <p>See source code</p>
            <p>&nearr;</p>
          </AdjacentIcon>
        </TransparentButton>
      </div>
    </div>
    <div class="screenShots">
      <div></div>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[0]?.visibleProgress" velocity="1">
          <img src="/images/roomganizer/map.png" alt="" />
          <p>3D map layout of facility displaying availability</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[1]?.visibleProgress" velocity="2">
          <img src="/images/roomganizer/scheduler.png" alt="" />
          <p>Customizable event scheduler</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[2]?.visibleProgress" velocity="1">
          <img src="/images/roomganizer/timeline.png" alt="" />
          <p>Clean timeline of upcoming events</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[3]?.visibleProgress" velocity="0.5">
          <VideoScrollSync :progress="scroll?.markers[3]?.visibleProgress">
            <video src="/videos/roomganizer/window.mp4" muted playsinline></video>
          </VideoScrollSync>
          <p>Panels adjustable by touch</p>
        </ParallaxContent>
      </section>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<script setup>
import OpaqueButton from './OpaqueButton.vue'
import TransparentButton from './TransparentButton.vue'
const props = defineProps({
  scroll: Object,
})
const openUrl = (url) => {
  window.open(url)
}
</script>
<style scoped>
.project {
  min-height: 100vh;
  padding: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.text {
  position: sticky;
  top: 80px;
  align-self: start;
}
.actions {
  margin-top: 40px;
  display: flex;
  gap: 20px;
}
.actions p {
  color: #fff;
}
.screenShots {
  display: grid;
  grid-template-rows: 40vh;
}
.screenShots img,
.screenShots video {
  max-height: calc(40vh - 2rem);
}
</style>
