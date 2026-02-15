<template>
  <div class="horizontal">
    <section marker class="transitionPhantom"></section>
    <section marker class="location">
      <HorizontalSticky :stick="scroll?.markers[1]?.coveredProgress">
        <VideoScrollSync class="videoFlight" :progress="scroll?.markers[1]?.coveredProgress * 2">
          <video src="/videos/flightShort.webm" muted playsinline></video>
        </VideoScrollSync>
      </HorizontalSticky>
      <div class="part warsaw"></div>
      <div class="part eindhoven"></div>
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
  width: calc(var(--full-width) * 2);
  margin-left: calc(var(--full-width) / 2);
}
.videoFlight {
  width: calc(var(--full-width));
  height: 100vh;
}
</style>
