<template>
  <div
    ref="container"
    class="opaque _opaque-button"
    data-cursor-target
    :data-cursor-passive="highlightOnly ? '1' : null"
    data-cursor-offset="5"
    :style="`background-color: ${color}`"
  >
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'var(--main-color-l)',
  },
  highlightOnly: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.opaque {
  padding: calc(var(--base) * 1.5) var(--base2);
  width: fit-content;
  border-radius: 100px;
}
</style>

<style>
._opaque-button p {
  color: #fff;
}
</style>
