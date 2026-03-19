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
      <h1>My Place(s)</h1>
      <FocusCard class="card" data-city="warsaw">
        <template #header>
          <h2>Warsaw, Poland</h2>
        </template>
        <template #main>
          <p>I was born in Warsaw, Poland in 2005 and spent the majority of my life there.</p>
        </template>
      </FocusCard>
      <FocusCard class="card" data-city="eindhoven">
        <template #header>
          <h2>Eindhoven, The Netherlands</h2>
        </template>
        <template #main>
          <p>In August 2024 I moved to Eindhoven to attend university.</p>
        </template>
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
  padding: 40px;
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
  /* background-color: var(--main-color-l); */
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
  margin-top: 20px;
  width: 100%;
}
h2 {
  display: inline;
}
</style>
