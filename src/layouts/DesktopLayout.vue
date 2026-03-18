<template>
  <main class="desktop">
    <div class="box">
      <NavigationBar @open="navOpen = true" :isOpen="navOpen" />
      <NavigationSocials />
      <NavigationPanel @close="navOpen = false" :isOpen="navOpen" />
      <slot />
    </div>
    <Cursor :virtualClick="true" />
    <Background />
  </main>
</template>

<script setup>
const navOpen = ref(false)

import Cursor from '@/components/cursor/Cursor.vue'
import Background from '@/components/cursor/Background.vue'
</script>

<style scoped>
.box {
  position: relative;
  z-index: 1;
}
</style>
