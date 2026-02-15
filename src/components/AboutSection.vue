<template>
  <div class="horizontal">
    <section marker class="transitionPhantom"></section>
    <section marker class="location">
      <VideoScrollSync class="_videoFlight" :progress="scroll?.markers[1]?.coveredProgress">
        <video ref="video" src="/videos/flight.webm" muted playsinline></video>
      </VideoScrollSync>
      <div class="part warsaw"></div>
      <div class="part eindhoven"></div>
    </section>
    <section marker class="location"></section>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Object,
})

const video = ref(null)

const onScroll = (p) => {
  video.value.style.transform = `translateX(${p * 200}%)`
}

watch(() => props.scroll?.markers[1]?.coveredProgress, onScroll)
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
  margin-left: calc(var(--full-width) / 2);
}
._videoFlight {
  width: calc(var(--full-width));
  height: 100vh;
}
</style>
