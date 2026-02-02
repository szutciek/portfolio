<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
html,
#app {
  height: 100%;
  font-family: 'Poppins', sans-serif;
}
.mW1200 {
  max-width: 1200px;
  margin: 0 auto;
}
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>

<script setup>
import Fonts from '@/components/Fonts.vue'
</script>
