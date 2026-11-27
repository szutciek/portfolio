<template>
  <div class="landingDescription">
    <div class="main">
      <h1 class="name">MACIEJ SZUTER</h1>
      <AdjacentIcon>
        <!-- prettier-ignore -->
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M160 368L32 256l128-112M352 368l128-112-128-112M304 96l-96 320"/></svg>
        <p>Full Stack Engineer</p>
      </AdjacentIcon>
    </div>
    <div class="infoGrid">
      <Link class="infoItem" data-cursor-target data-cursor-offset="10" :href="tue">
        <div class="logos">
          <img src="/images/logo/tue.avif" alt="TU/e Logo" />
        </div>
        <div>
          <p>Third Year Bachelor</p>
          <h3>Computer Science & Engineering</h3>
        </div>
        <AdjacentIcon class="onSnap" style="position: absolute; top: 5px; right: 5px">
          <p>Explore Program</p>
          <p>&nearr;</p>
        </AdjacentIcon>
      </Link>
      <div class="border"></div>
      <Link
        class="infoItem"
        data-cursor-target
        data-cursor-offset="10"
        href="/#projects"
        :smooth="true"
      >
        <div class="logos">
          <img src="/images/logo/kanapka.avif" alt="Kanapka Logo" />
          <img src="/images/logo/asml.avif" alt="ASML Logo" />
          <img src="/images/logo/totem.avif" alt="Totem Logo" />
        </div>
        <div>
          <p>Projects & Experience in</p>
          <h3>Full Stack Engineering</h3>
        </div>
        <AdjacentIcon class="onSnap" style="position: absolute; top: 5px; right: 5px">
          <p>See Details</p>
          <p>&nearr;</p>
        </AdjacentIcon>
      </Link>
    </div>
  </div>
</template>

<script setup>
const tue = `https://www.tue.nl/en/education/bachelor-college/bachelor-computer-science-and-engineering`
</script>

<style scoped>
.main {
  margin-bottom: var(--base8);
}

.infoGrid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: var(--base4);
}
.infoGrid .border {
  width: 100%;
  height: 100%;
  background-color: var(--bg-color-ll);
}
.infoItem {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  gap: var(--base2);
}
.infoItem .logos {
  display: flex;
  gap: var(--base);
}
.infoItem .logos img:first-of-type {
  margin-top: 0;
  height: var(--base4);
  min-width: var(--base4);
  max-width: var(--base8);
  width: min-content;
}
.infoItem .logos img {
  height: var(--base4);
  min-width: var(--base4);
  max-width: var(--base8);
  object-fit: contain;
}
.infoItem .onSnap {
  opacity: 0.2;
}
.infoItem.cursor-snapped .onSnap {
  opacity: 1;
}
@media (max-width: 1600px) {
  .infoGrid {
    grid-template-columns: 1fr;
    gap: var(--base4);
  }
  .infoItem {
    border-left: none;
  }
}
</style>
