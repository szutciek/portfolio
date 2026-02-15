<template>
  <div class="horizontal">
    <section marker class="transitionPhantom"></section>
    <section marker class="location">
      <HorizontalSticky :stick="scroll?.markers[1]?.coveredProgress">
        <VideoScrollSync class="videoFlight" :progress="scroll?.markers[1]?.coveredProgress * 2">
          <video src="/videos/flightShort.webm" muted playsinline></video>
        </VideoScrollSync>
      </HorizontalSticky>
      <div class="part warsaw">
        <h2>🇵🇱 &nbsp; Warsaw</h2>
        <p>Place of birth</p>
      </div>
      <div class="part eindhoven">
        <h2>🇳🇱 &nbsp; Eindhoven</h2>
        <p>Place of residence</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Object,
})
</script>

<style scoped>
.horizontal {
  display: flex;
  height: 100vh;
}
.transitionPhantom {
  position: absolute;
  width: var(--full-width);
}
.start {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.location {
  position: relative;
  width: calc(var(--full-width) * 2);
  height: 100vh;
  margin-left: calc(var(--full-width) / 2);
}
.location .part {
  position: absolute;
  min-width: 400px;
  bottom: 80px;
  background-color: var(--bg-color-d);
  border: 1px solid var(--bg-color-l);
  padding: 40px;
}
.location .warsaw {
  left: 80px;
}
.location .eindhoven {
  left: calc(var(--full-width) + 80px);
}
.videoFlight {
  width: calc(var(--full-width));
  height: 100vh;
}
</style>
