<template>
  <main class="desktop">
    <NavigationBar @open="navOpen = true" :isOpen="navOpen" />
    <NavigationSocials />
    <NavigationPanel @close="navOpen = false" :isOpen="navOpen" />
    <slot />
    <Cursor :virtualClick="true" />
  </main>
</template>

<script setup>
const navOpen = ref(false)

import Cursor from '@/components/cursor/Cursor.vue'
</script>
