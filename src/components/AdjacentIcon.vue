<template>
  <div ref="container" class="adjacent">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  overrideGap: String,
})
const container = ref(null)
let observer = null

const syncHeight = () => {
  const el = container.value
  if (!el || el.children.length < 2) return

  const first = el.children[0]
  const second = el.children[1]

  const height = second.getBoundingClientRect().height
  first.style.height = `${height}px`

  if (props?.overrideGap) {
    el.style.gap = props.overrideGap
  } else {
    el.style.gap = `${height / 2}px`
  }
}

onMounted(async () => {
  await nextTick()

  const el = container.value
  if (!el || el.children.length < 2) return

  const second = el.children[1]

  observer = new ResizeObserver(() => {
    syncHeight()
  })

  observer.observe(second)

  syncHeight()
})

watch(() => props.overrideGap, syncHeight)

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.adjacent {
  display: flex;
  align-items: flex-start;
  gap: var(--base);
}

.adjacent > *:first-child {
  flex-shrink: 0;
}
</style>
