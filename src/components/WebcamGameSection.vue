<template>
  <div class="project">
    <div class="text">
      <h1>Webcam Game</h1>
      <p>SEEING YOUR ENEMY, REDEFINED</p>
      <div class="actions">
        <OpaqueButton @click="openUrl(`https://webcamgame.kanapka.eu`)">
          <AdjacentIcon>
            <p>Try it out</p>
            <p>&nearr;</p>
          </AdjacentIcon>
        </OpaqueButton>
        <TransparentButton @click="openUrl(`https://github.com/szutciek/webcam-game`)">
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
          <img src="/images/wcgame/soccer.png" alt="" />
          <p>A game of football</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[1]?.visibleProgress" velocity="2">
          <img src="/images/wcgame/amongus.png" alt="" />
          <p>A game of suspicious</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[2]?.visibleProgress" velocity="1">
          <img src="/images/wcgame/sso.png" alt="" />
          <p>Kanapka SSO Integration</p>
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
.screenShots img {
  max-height: calc(40vh - 2rem);
}
</style>
