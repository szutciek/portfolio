<template>
  <main class="desktop">
    <div class="box">
      <NavigationBar class="_no-print" @open="navOpen = true" :isOpen="navOpen" />
      <NavigationSocials class="_no-print" />
      <NavigationPanel class="_no-print" @close="navOpen = false" :isOpen="navOpen" />
      <slot />
    </div>
    <Cursor :virtualClick="true" />
    <Background class="_no-print" />
  </main>
</template>

<script setup>
const navOpen = ref(false)

import Cursor from '@/components/cursor/Cursor.vue'
import Background from '@/components/cursor/Background.vue'
</script>

<style scoped>
.box {
  position: relative;
  z-index: 1;
}
</style>

<style>
:root {
  --nav-width: 80px;
  --nav-space: calc(var(--nav-width) * 2);

  --full-width: calc(100vw - var(--nav-space));
  --half-width: calc(var(--full-width) / 2);
}

h1 {
  font-size: 120px;
  font-weight: 700;
  color: #fff;
}
._half h1 {
  font-size: 100px;
  color: #fff;
}
h2 {
  font-size: 60px;
  font-weight: 700;
  color: #fff;
}
._half h2 {
  font-size: 50px;
  color: #fff;
}
h2 span {
  font-size: 16px;
  font-weight: 500;
  color: #888;
  margin-left: var(--base2);
}
h3 {
  font-size: 20px;
  font-weight: 600;
  color: #ddd;
}
p {
  font-size: 16px;
  color: #aaa;
}
@media (max-width: 1800px) {
  h1 {
    font-size: 90px;
  }
  ._half h1 {
    font-size: 70px;
  }
  h2 {
    font-size: 45px;
  }
  ._half h2 {
    font-size: 35px;
  }
}
@media (max-width: 1600px) {
  h1 {
    font-size: 80px;
  }
  ._half h1 {
    font-size: 60px;
  }
  h2 {
    font-size: 40px;
  }
  ._half h2 {
    font-size: 30px;
  }
}
@media (max-width: 1400px) {
  h1 {
    font-size: 60px;
  }
  ._half h1 {
    font-size: 40px;
  }
  h2 {
    font-size: 30px;
  }
  ._half h2 {
    font-size: 20px;
  }
  h3 {
    font-size: 20px;
  }
  p {
    font-size: 14px;
  }
}
</style>
