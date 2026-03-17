<template>
  <main class="desktop">
    <CursorFollower />
    <NavigationBar @open="navOpen = true" />
    <NavigationSocials />
    <NavigationPanel @close="navOpen = false" :isOpen="navOpen" />
    <slot />
  </main>
</template>

<script setup>
import CursorFollower from '@/components/cursor/CursorFollower.vue'

const navOpen = ref(false)
</script>
