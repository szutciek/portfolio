<script setup>
import { useBreakpoint } from '@/composables/useBreakpoint'
import DesktopHome from '@/views/DesktopHomeView.vue'
import MobileHome from '@/views/MobileHomeView.vue'

const { isMobile } = useBreakpoint()
</script>

<template>
  <component :is="isMobile ? MobileHome : DesktopHome" />
</template>

<style>
h1 {
  font-size: 120px;
  color: #fff;
}
._half h1 {
  font-size: 100px;
  color: #fff;
}
h2 {
  font-size: 24px;
  color: #ddd;
}
p {
  font-size: 16px;
  color: #aaa;
}
@media (max-width: 1800px) {
  h1 {
    font-size: 90px;
    color: #fff;
  }
  ._half h1 {
    font-size: 70px;
    color: #fff;
  }
}
@media (max-width: 1600px) {
  h1 {
    font-size: 80px;
  }
  ._half h1 {
    font-size: 60px;
  }
}
@media (max-width: 1400px) {
  h1 {
    font-size: 60px;
  }
  ._half h1 {
    font-size: 40px;
  }
  h2 {
    font-size: 20px;
  }
  p {
    font-size: 14px;
  }
}
</style>
