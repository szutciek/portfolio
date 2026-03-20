<template>
  <LenisScroll v-slot="{ global, sections }" sections>
    <div class="_desktopHome container">
      <!-- INTRODUCTION -->
      <LandingSection
        :scroll="sections[0]?.coveredProgress"
        :nextPageScroll="sections[1]?.markers[0]?.coveredProgress"
      />
      <!-- ABOUT -->
      <AboutSection :sections="sections?.subset(1, 1)" />
      <!-- PROJECTS -->
      <ProjectSection :sections="sections?.subset(2)" />
      <!--   ....   -->
      <div class="padding">
        <p>The end for now</p>
      </div>
    </div>
  </LenisScroll>
</template>

<style>
:root {
  --nav-space: 160px;
  --full-width: calc(100vw - var(--nav-space));
}

._desktopHome section[vertical],
._desktopHome section[horizontal] {
  padding: 0 var(--base8);
}

._subsectionTitle svg {
  margin-left: var(--base3);
  height: var(--base4);
  width: var(--base4);
}
._subsectionTitle path,
._subsectionTitle circle {
  stroke-width: var(--base3);
  stroke: var(--main-color-l);
}
</style>

<style scoped>
.container {
  min-height: 100dvh;
}

.padding {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
