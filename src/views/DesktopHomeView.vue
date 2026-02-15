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
      <section vertical>
        <WebcamGameSection :scroll="sections[2]" />
      </section>
      <!--   ....   -->
    </div>
  </LenisScroll>
</template>

<style>
:root {
  --nav-space: 160px;
  --full-width: calc(100vw - var(--nav-space));
}
</style>

<style scoped>
.container {
  min-height: 100dvh;
}
section[vertical] {
  padding: 0 80px;
}
section[horizontal] {
  padding: 0 80px;
}
</style>
