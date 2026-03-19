<template>
  <div ref="container" class="opaque" data-cursor-target data-cursor-offset="4">
    <slot />
  </div>
</template>

<style scoped>
.opaque {
  background-color: var(--main-color-l);
  padding: calc(var(--base1) * 1.5) var(--base2);
  width: fit-content;
  border-radius: 100px;
}
</style>
