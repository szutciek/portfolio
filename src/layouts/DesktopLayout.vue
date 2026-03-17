<template>
  <main class="desktop">
    <NavigationBar @open="navOpen = true" />
    <NavigationSocials />
    <NavigationPanel @close="navOpen = false" :isOpen="navOpen" />
    <slot />
    <Cursor />
  </main>
</template>

<script setup>
const navOpen = ref(false)

import Cursor from '@/components/cursor/Cursor.vue'
</script>
