<template>
  <section marker class="location _half">
    <div class="background">
      <ScrollText
        :texts="[`ABOUT ME`]"
        :color="`var(--bg-color-l)`"
        :gap="8"
        :progress="gScroll"
        :scrollRange="10"
      />
    </div>
    <div class="content">
      <AdjacentIcon class="_subsectionTitle" overrideGap="var(--base3)">
        <!-- prettier-ignore -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256M400 179V64h-48v69" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
        <h2>My Homes<span>/ About me</span></h2>
      </AdjacentIcon>
      <FocusCard class="card" data-city="warsaw">
        <AdjacentIcon overrideGap="var(--base3)">
          <!-- prettier-ignore -->
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 45 90 C 20.147 90 0 69.853 0 45 h 90 C 90 69.853 69.853 90 45 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(220,20,60); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 45 0 C 20.147 0 0 20.147 0 45 h 90 C 90 20.147 69.853 0 45 0 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(243,244,245); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/></g></svg>
          <div>
            <h3>Warsaw, Poland</h3>
            <p>Born and raised in Warsaw - where I spent the first 19 years of my life.</p>
          </div>
        </AdjacentIcon>
      </FocusCard>
      <FocusCard class="card" data-city="eindhoven">
        <AdjacentIcon overrideGap="var(--base3)">
          <!-- prettier-ignore -->
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 2.57 30 h 84.859 C 81.254 12.534 64.611 0.015 45.033 0 h -0.068 C 25.388 0.015 8.745 12.534 2.57 30 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(174,28,40); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 87.429 60 H 2.57 C 8.749 77.476 25.408 90 45 90 S 81.25 77.476 87.429 60 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(33,70,139); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 87.429 60 C 89.088 55.307 90 50.261 90 45 c 0 -5.261 -0.911 -10.307 -2.571 -15 H 2.57 C 0.911 34.693 0 39.739 0 45 c 0 5.261 0.912 10.307 2.571 15 H 87.429 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(243,244,245); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/></g></svg>
          <div>
            <h3>Eindhoven, The Netherlands</h3>
            <p>Moved to Eindhoven in 2024 to study at TU/e - currently based here.</p>
          </div>
        </AdjacentIcon>
      </FocusCard>
    </div>
  </section>
</template>

<script setup>
import FocusCard from '@/components/cursor/FocusCard.vue'
import ScrollText from '@/components/effects/ScrollText.vue'

const props = defineProps({
  gScroll: Number,
  scroll: Number,
})
</script>

<style scoped>
.location {
  position: relative;
  height: 100vh;
  width: calc(var(--full-width) / 2);
  padding: var(--base4);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.location .background {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.location .content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.location .canvas {
  height: 100%;
}
.location .card {
  width: 100%;
}
.location .content .card svg {
  height: var(--base4);
  width: var(--base4);
}
.location .card {
  margin-top: var(--base3);
}
</style>
