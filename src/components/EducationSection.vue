<template>
  <section marker class="education _half">
    <h1>Education</h1>
    <p>Bachelor degree in Computer Science at Eindhoven University of Technology</p>
  </section>
</template>

<script setup>
const props = defineProps({
  scroll: Number,
})
</script>

<style scoped>
.education {
  width: calc(var(--full-width) / 2);
  height: 100vh;
  padding: 40px;
}
</style>
