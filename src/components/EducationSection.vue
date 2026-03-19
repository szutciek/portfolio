<template>
  <section marker class="education">
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
  width: var(--full-width);
  height: 100vh;
  padding: 40px;
}
</style>
