<template>
  <div ref="container" class="transparent" data-cursor-target data-cursor-offset="4">
    <slot />
  </div>
</template>

<style scoped>
.transparent {
  background-color: transparent;
  padding: 16px 20px;
  width: fit-content;
  border-radius: 100px;
}
</style>
