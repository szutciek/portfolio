<template>
  <LenisScroll v-slot="{ global, sections }" sections>
    <NavigationBar @open="navOpen = true" />
    <NavigationSocials />
    <NavigationPanel @close="navOpen = false" :isOpen="navOpen" :scroll="global" />
    <div class="container">
      <!-- INTRODUCTION -->
      <section vertical>
        <LandingSection :scroll="sections[0]?.coveredProgress" />
      </section>
      <!-- ABOUT -->
      <section horizontal></section>
      <!-- PROJECTS -->
      <!--   ....   -->
    </div>
  </LenisScroll>
</template>

<style scoped>
.container {
  padding: 0 80px;
  min-height: 100vh;
}
</style>

<script setup>
const navOpen = ref(false)
</script>
