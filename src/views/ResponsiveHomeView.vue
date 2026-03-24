<script setup>
import { useBreakpoint } from '@/composables/useBreakpoint'
import DesktopHome from '@/views/DesktopHomeView.vue'
import MobileHome from '@/views/MobileHomeView.vue'

const { isMobile } = useBreakpoint()
</script>

<template>
  <component :is="isMobile ? MobileHome : DesktopHome" />
</template>
