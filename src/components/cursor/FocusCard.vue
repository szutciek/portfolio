<template>
  <div class="focusCard" data-cursor-target data-cursor-passive>
    <slot name="header" />
    <slot name="main" />
    <slot name="footer" />
  </div>
</template>

<style scoped>
.focusCard {
  width: fit-content;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  border: 1px solid var(--bg-color-l);
}

.focusCard.cursor-snapped {
  background-color: var(--bg-color-l);
}
</style>
