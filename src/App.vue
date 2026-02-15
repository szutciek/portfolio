<template>
  <component :is="isMobile ? MobileLayout : DesktopLayout">
    <router-view />
  </component>
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
  background-color: var(--bg-color-d);
  font-family: 'Poppins', sans-serif;
}
:root {
  --bg-color-l: #1b1b1b;
  --bg-color-dl: #171717;
  --bg-color-d: #131313;
  --main-color-l: #ec7837;
  --main-color-d: #9e4a1b;

  --nav-space: 160px;
  --full-width: calc(100vw - var(--nav-space));
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-color-d);
}
::-webkit-scrollbar-thumb {
  background: var(--main-color-d);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--main-color-l);
}

.mW1200 {
  max-width: 1200px;
  margin: 0 auto;
}
.mW1000 {
  max-width: 1000px;
  margin: 0 auto;
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>

<script setup>
import '@/components/Fonts.vue'

import { useBreakpoint } from '@/composables/useBreakpoint'
import DesktopLayout from '@/layouts/DesktopLayout.vue'
import MobileLayout from '@/layouts/MobileLayout.vue'

const { isMobile } = useBreakpoint()
</script>
