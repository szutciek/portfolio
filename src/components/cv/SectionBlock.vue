<template>
  <div class="section-block">
    <h2 class="section-title">{{ title }}</h2>
    <div class="section-divider" />
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.section-block {
  margin-bottom: 1.8rem;
}

.section-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin: 0 0 0.4rem 0;
}

.section-divider {
  height: 2px;
  background: var(--accent);
  margin-bottom: 0.9rem;
  border-radius: 2px;
}
</style>
