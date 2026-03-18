<template>
  <div ref="container" class="opaque" data-cursor-target data-cursor-offset="4">
    <slot />
  </div>
</template>

<style scoped>
.opaque {
  background-color: var(--main-color-l);
  padding: 16px 20px;
  width: fit-content;
  border-radius: 100px;
}
</style>
