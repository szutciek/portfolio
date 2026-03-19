<template>
  <div class="focusCard" data-cursor-target data-cursor-passive>
    <slot />
  </div>
</template>

<style scoped>
.focusCard {
  width: fit-content;
  padding: 30px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  border: 1px solid var(--bg-color-l);
  background-color: var(--bg-color-l);
}

.focusCard.cursor-snapped {
  background-color: var(--bg-color-l);
}
</style>
