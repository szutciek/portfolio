<script setup>
import { useBreakpoint } from '@/composables/useBreakpoint'
import DesktopHome from '@/views/DesktopHomeView.vue'
import MobileHome from '@/views/MobileHomeView.vue'

const { deviceType } = useBreakpoint()
</script>

<template>
  <DesktopHome v-if="deviceType === 'desktop'" />
  <MobileHome v-if="deviceType === 'mobile'" />
</template>
