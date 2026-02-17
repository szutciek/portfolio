<template>
  <div class="project">
    <h1>Work in Progress</h1>
    <p>This new portfolio is currently under development.</p>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Object,
})
</script>

<style scoped>
.project {
  min-height: 100vh;
  padding: 80px;
}
</style>
