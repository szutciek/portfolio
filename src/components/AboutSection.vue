<template>
  <div class="horizontal">
    <section marker>
      <div class="transition">
        <div></div>
        <div class="start">
          <h2>Some information about me</h2>
        </div>
      </div>
    </section>
    <div class="content">
      <h2>The rest of the information</h2>
      <p>(WIP)</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Object,
})
</script>

<style scoped>
.horizontal {
  display: flex;
  height: 100vh;
}
.transition {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: calc(100vw - 160px);
  height: 100%;
}
.start,
.full {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100%;
}
</style>
