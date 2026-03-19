<template>
  <section marker class="interests">
    <div class="content">
      <h1>Interests</h1>
      <p>Programming, music, gaming, and more</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  scroll: Number,
})
</script>

<style scoped>
.interests {
  width: var(--full-width);
  height: 100vh;
  padding: 40px;
}
</style>
