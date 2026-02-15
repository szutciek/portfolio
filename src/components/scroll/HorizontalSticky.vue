<template>
  <div class="rail">
    <div class="content" ref="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Object,
})

const content = ref(null)

const onScroll = (p) => {
  if (!content.value) return
  content.value.style.transform = `translateX(${p * 200}%)`
}

watch(() => props.scroll, onScroll)
</script>

<style scoped>
.rail {
  width: 100%;
  height: 100%;
}
.content {
  width: 100%;
  height: 100%;
}
</style>
