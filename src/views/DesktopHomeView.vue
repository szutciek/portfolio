<template>
  <LenisScroll v-slot="{ global, sections }" sections>
    <div class="container">
      <!-- INTRODUCTION -->
      <section vertical>
        <LandingSection
          :scroll="sections[0]?.coveredProgress"
          :nextPageScroll="sections[1]?.markers[0]?.coveredProgress"
        />
      </section>
      <!-- ABOUT -->
      <section horizontal>
        <AboutSection :scroll="sections[1]" />
      </section>
      <!-- PROJECTS -->
      <!--   ....   -->
    </div>
  </LenisScroll>
</template>

<style scoped>
.container {
  margin: 0 80px;
  min-height: 100dvh;
}
</style>
