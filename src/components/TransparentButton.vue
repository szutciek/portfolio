<template>
  <div ref="container" class="transparent" data-cursor-target data-cursor-offset="4">
    <slot />
  </div>
</template>

<style scoped>
.transparent {
  background-color: transparent;
  padding: calc(var(--base1) * 1.5) var(--base2);
  width: fit-content;
  border-radius: 100px;
}
</style>
