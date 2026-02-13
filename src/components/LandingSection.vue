<template>
  <div class="header">
    <div class="render">
      <ModelRender
        modelUrl="/models/monitor_v1_scaled.glb"
        :cameraPosition="camera"
        :limitControls="controls"
      />
    </div>
    <div class="text">
      <h1>Maciej Szuter</h1>
      <h2>Computer Science & Engineering Student @ TU/e</h2>
      <h3>Full Stack Web Developer & Game Developer</h3>
    </div>
  </div>
</template>

<script setup>
const camera = [1.5, 0, 0.5]
const controls = true
</script>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.header .text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  color: #fff;
}
</style>
