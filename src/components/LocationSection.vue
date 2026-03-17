<template>
  <section marker class="location">
    <HorizontalSticky :stick="scroll">
      <VideoScrollSync class="videoFlight" :progress="scroll * 2">
        <video src="/videos/flightShort.webm" muted playsinline></video>
      </VideoScrollSync>
    </HorizontalSticky>
    <div class="part warsaw">
      <h2>🇵🇱 &nbsp; Warsaw</h2>
      <p>I was born in Warsaw, Poland and lived here the majority of my life.</p>
      <!-- <CurvedPath
        :dx="500"
        :dy="0"
        :options="{ curvature: 0.5, stroke: 'var(--bg-color-l)', strokeWidth: 3 }"
      /> -->
    </div>
    <div class="part eindhoven">
      <h2>🇳🇱 &nbsp; Eindhoven</h2>
      <p>In late 2024 I moved to Eindhoven, The Netherlands to attend University.</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  scroll: Number,
})
</script>

<style scoped>
.location {
  position: relative;
  width: calc(var(--full-width) * 2);
  height: 100vh;
}
.location .part {
  position: absolute;
  bottom: 160px;
  min-width: 400px;
  max-width: calc(var(--full-width) / 2 - 160px);
  background-color: var(--bg-color-d);
  border: 1px solid var(--bg-color-l);
  padding: 40px;
}
.location .warsaw {
  left: 80px;
}
.location .eindhoven {
  left: calc(var(--full-width) * 3 / 2 + 80px);
}
</style>
