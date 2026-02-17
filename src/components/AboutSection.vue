<template>
  <section horizontal>
    <div class="horizontal">
      <section marker class="transitionPhantom"></section>
      <LocationSection style="grid-area: location" :scroll="scroll1?.markers[1]?.coveredProgress" />
    </div>
  </section>
  <section vertical>
    <EducationSection :scroll="scroll2?.markers[0]?.coveredProgress" />
    <InterestsSection :scroll="scroll2?.markers[1]?.coveredProgress" />
  </section>
</template>

<script setup>
const props = defineProps({
  scroll1: Object,
  scroll2: Object,
})
</script>

<style scoped>
.horizontal {
  display: flex;
  height: 100vh;

  display: grid;
  grid-template-columns: repeat(6, calc(var(--full-width) / 2));
  grid-template-areas: 'e location location location location education';
}
.transitionPhantom {
  position: absolute;
  width: var(--full-width);
}
.videoFlight {
  width: calc(var(--full-width));
  height: 100vh;
}
</style>
