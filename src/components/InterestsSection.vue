<template>
  <section marker class="interests _half">
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
  width: calc(var(--full-width) / 2);
  height: 100vh;
  padding: 40px;
}
</style>
