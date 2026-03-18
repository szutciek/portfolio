<template>
  <LenisScroll v-slot="{ global, sections }" sections>
    <div class="_desktopHome container">
      <!-- INTRODUCTION -->
      <LandingSection
        :scroll="sections[0]?.coveredProgress"
        :nextPageScroll="sections[1]?.markers[0]?.coveredProgress"
      />
      <!-- ABOUT -->
      <AboutSection :scroll1="sections[1]" :scroll2="sections[2]" />
      <!-- PROJECTS -->
      <section vertical>
        <WebcamGameSection :scroll="sections[3]" />
      </section>
      <section vertical>
        <KanapkaSSOSection :scroll="sections[4]" />
      </section>
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

<style>
._desktopHome section[vertical],
._desktopHome section[horizontal] {
  padding: 0 80px;
}
</style>
