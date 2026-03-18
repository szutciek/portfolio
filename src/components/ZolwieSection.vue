<template>
  <div class="project">
    <div class="text">
      <h1>Turtle Game</h1>
      <p>ONLINE MULTIPLAYER VERSION OF POPULAR BOARD GAME</p>
      <div class="actions">
        <OpaqueButton @click="openUrl(`https://zolwie.kanapka.eu/start`)">
          <AdjacentIcon>
            <p>Host a game</p>
            <p>&nearr;</p>
          </AdjacentIcon>
        </OpaqueButton>
        <TransparentButton @click="openUrl(`https://github.com/szutciek/zolwie`)">
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
          <img src="/images/zolwie/game.png" alt="" />
          <p>A game of chasing turtles</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[1]?.visibleProgress" velocity="2">
          <img src="/images/zolwie/menu.png" alt="" />
          <p>
            Customize turtles,<br />
            level and cards
          </p>
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
