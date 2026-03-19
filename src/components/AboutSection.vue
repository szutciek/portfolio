<template>
  <div class="horizontal">
    <section marker style="position: absolute; left: 0; width: var(--full-width)"></section>
    <LocationSection :scroll="scroll?.markers[1]?.coveredProgress" />
    <EducationSection :scroll="scroll?.markers[2]?.coveredProgress" />
    <InterestsSection :scroll="scroll?.markers[3]?.coveredProgress" />
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
  padding-left: calc(var(--full-width) / 2);
}
</style>
