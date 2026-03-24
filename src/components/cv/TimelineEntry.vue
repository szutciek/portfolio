<template>
  <div class="timeline-entry">
    <div class="entry-meta">
      <span class="entry-period">{{ period }}</span>
      <span class="entry-sep">|</span>
      <span class="entry-title">{{ title }}</span>
    </div>
    <p class="entry-org">{{ organisation }}</p>
    <p v-if="description" class="entry-desc">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  period: { type: String, required: true },
  title: { type: String, required: true },
  organisation: { type: String, required: true },
  description: { type: String, default: null },
})
</script>

<style scoped>
.timeline-entry {
  margin-bottom: 1.3rem;
  padding-left: 0.8rem;
  border-left: 3px solid var(--accent);
}

.entry-meta {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-bottom: 0.15rem;
}

.entry-period {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.entry-sep {
  color: var(--accent);
  opacity: 0.4;
  font-size: 0.75rem;
}

.entry-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text);
}

.entry-org {
  font-size: 0.78rem;
  font-style: italic;
  color: var(--text-muted);
  margin: 0 0 0.35rem;
}

.entry-desc {
  font-size: 0.78rem;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0;
}
</style>
