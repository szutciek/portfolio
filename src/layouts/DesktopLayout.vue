<template>
  <main class="desktop">
    <NavigationBar @open="navOpen = true" />
    <NavigationSocials />
    <NavigationPanel @close="navOpen = false" :isOpen="navOpen" />
    <slot />
  </main>
</template>

<script setup>
const navOpen = ref(false)
</script>
