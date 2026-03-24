<template>
  <div class="container">
    <div class="message _no-print">
      <AdjacentIcon>
        <!-- prettier-ignore -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 272l80 80 80-80M256 48v288"/></svg>
        <div class="text">
          <h3>Use Print Window to Generate a PDF</h3>
          <p>Via the shortcut (CTRL + P) or Browser Menu</p>
        </div>
      </AdjacentIcon>
    </div>
    <div class="page">
      <h1>Maciej Szuter</h1>
    </div>
  </div>
</template>

<style scoped>
.message {
  margin: var(--base4) auto;
  width: fit-content;
}
.message svg {
  stroke: var(--main-color-l);
}
.page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: var(--base4);
  box-sizing: border-box;
  background: #fff;
}
h1 {
  color: #000;
}
</style>

<style>
@media print {
  ._no-print {
    display: none !important;
  }
  body {
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    box-shadow: none;
    margin: 0;
    width: 100%;
    min-height: auto;
    background: #0f0;
  }
}
</style>
