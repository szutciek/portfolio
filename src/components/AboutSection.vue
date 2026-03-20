<template>
  <section horizontal>
    <div class="horizontal">
      <section marker style="position: absolute; left: 0; width: var(--full-width)"></section>
      <LocationSection
        :gScroll="sections[0]?.visibleProgress"
        :scroll="sections[0]?.markers[1]?.coveredProgress"
      />
      <EducationSection :scroll="sections[0]?.markers[2]" />
      <InterestsSection :scroll="sections[0]?.markers[3]?.coveredProgress" />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  sections: Array,
})
</script>

<style scoped>
.horizontal {
  display: flex;
  height: 100vh;
  padding-left: calc(var(--full-width) / 2);
}
</style>
