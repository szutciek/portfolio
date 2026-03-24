<template>
  <div class="lang-bar">
    <div class="lang-meta">
      <span class="lang-name">{{ name }}</span>
      <span class="lang-level">{{ level }}</span>
    </div>
    <div class="bar-track">
      <div class="bar-fill" :style="{ width: fill + '%' }" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  level: { type: String, required: true },
  fill: { type: Number, required: true }, // 0–100
})
</script>

<style scoped>
.lang-bar {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lang-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.lang-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
}

.lang-level {
  font-size: 0.7rem;
  color: rgba(255 255 255 / 0.65);
}

.bar-track {
  height: 5px;
  background: rgba(255 255 255 / 0.2);
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #fff;
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
