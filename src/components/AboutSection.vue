<template>
  <section horizontal>
    <div class="horizontal">
      <section marker class="transitionPhantom"></section>
      <LocationSection style="grid-area: location" :scroll="scroll1?.markers[1]?.coveredProgress" />
      <EducationSection :scroll="scroll2?.markers[0]?.coveredProgress" />
      <InterestsSection :scroll="scroll2?.markers[1]?.coveredProgress" />
    </div>
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
}
.transitionPhantom {
  position: absolute;
  width: var(--full-width);
}
</style>
