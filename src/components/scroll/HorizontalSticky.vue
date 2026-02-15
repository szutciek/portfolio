<template>
  <div class="rail" ref="rail">
    <div class="content" ref="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stick: Number,
})

const rail = ref(null)
const content = ref(null)

const onScroll = (p) => {
  if (!content.value) return
  const totalScrollable = rail.value.clientWidth - content.value.clientWidth
  const pixels = Math.min(totalScrollable, Math.max(0, p * rail.value.clientWidth))
  content.value.style.transform = `translateX(${pixels}px)`
}

watch(() => props.stick, onScroll)
</script>

<style scoped>
.rail {
  width: 100%;
  height: 100vh;
}
.content {
  width: calc(var(--full-width));
  height: 100vh;
}
</style>
