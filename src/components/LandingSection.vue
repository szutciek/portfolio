<template>
  <div class="header">
    <div class="render">
      <!-- <TransformModelRender
        modelUrl="/models/monitor_v1_scaled.glb"
        :cameraPosition="[1.5, 0, 0.5]"
        :limitControls="true"
        :scrollProgress="props.scroll"
        :scrollTransform="{
          positionStart: [0, 0, 0],
          positionEnd: [0, 1, 0],
          rotationStart: [0, 0, 0],
          rotationEnd: [0, 2 * Math.PI, 0],
          scaleStart: [1, 1, 1],
          scaleEnd: [1, 1, 1],
        }"
      /> -->
      <TransformModelRender
        modelUrl="/models/setup.glb"
        :cameraPosition="[1.5, 0, 0.5]"
        :limitControls="true"
        :scrollProgress="props.scroll"
        :scrollTransform="{
          positionStart: [0, 0, 0],
          positionEnd: [0, 1, 0],
          rotationStart: [0, 0, 0],
          rotationEnd: [0, 2 * Math.PI, 0],
          scaleStart: [1, 1, 1],
          scaleEnd: [1, 1, 1],
        }"
        screenMeshName="Screen"
        :screenTextureUrl="textureUrl"
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
const props = defineProps({
  scroll: Number,
})

const textureUrl = ref('https://assets.kanapka.eu/images/ceo.png')
</script>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
}
.header .text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: #fff;
}
</style>
