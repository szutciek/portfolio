<template>
  <div class="container">
    <div class="message _no-print">
      <AdjacentIcon>
        <OpaqueButton @click="exportPDF"><p>Export PDF</p></OpaqueButton>
        <TransparentButton @click="openPrintMenu"><p>Print</p></TransparentButton>
      </AdjacentIcon>
    </div>
    <div class="page">
      <InfoColumn />
      <MainColumn />
    </div>
  </div>
</template>

<style scoped>
.message {
  margin: var(--base2) auto;
  width: fit-content;
}
.page {
  width: 210mm;
  display: grid;
  grid-template-columns: 1fr 2fr;
  min-height: 297mm;
  margin: 0 auto;
  padding: var(--base3);
  box-sizing: border-box;
  background: #e9dedd;
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
    min-height: unset;
  }
}
</style>

<script setup>
import html2pdf from 'html2pdf.js'

const openPrintMenu = () => {
  window.print()
}

async function exportPDF() {
  const pageEl = document.querySelector('.page')
  const originalMinHeight = pageEl.style.minHeight
  pageEl.style.minHeight = 'unset'

  const now = new Date()
  const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`

  const opt = {
    margin: 0,
    filename: `cv_maciej_szuter_${date}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }

  await html2pdf().set(opt).from(pageEl).save()

  pageEl.style.minHeight = originalMinHeight
}
</script>
