<template>
  <section marker class="location">
    <div class="content">
      <h1>Location</h1>
      <FocusCard> <h2>Warsaw</h2> </FocusCard>
      <FocusCard> <h2>Eindhoven</h2> </FocusCard>
    </div>
  </section>
</template>

<script setup>
import FocusCard from '@/components/cursor/FocusCard.vue'

const props = defineProps({
  scroll: Number,
})
</script>

<style scoped>
.location {
  width: var(--full-width);
  height: 100vh;
  padding: 40px;
}
</style>
