<template>
  <LenisScroll v-slot="{ global, sections }" sections>
    <NavigationBar @open="navOpen = true" />
    <NavigationSocials />
    <NavigationPanel :isOpen="navOpen" @close="navOpen = false" />
    <div class="container"></div>
  </LenisScroll>
</template>

<style scoped>
.container {
  padding: 0 80px;
  min-height: 100vh;
}
</style>

<script setup>
const navOpen = ref(false)
</script>
