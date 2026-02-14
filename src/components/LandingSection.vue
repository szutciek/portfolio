<template>
  <div class="header">
    <div class="render">
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
    <div class="description">
      <h1>Maciej Szuter</h1>
      <div class="infoGrid">
        <div class="infoItem">
          <img src="/images/tue.png" alt="TU/e Logo" />
          <div>
            <p>Second Year Bachelor</p>
            <h2>Computer Science & Engineering</h2>
          </div>
        </div>
        <div class="infoItem">
          <img src="/images/kanapka.png" alt="Kanapka Logo" />
          <div>
            <p>6+ Years of Experience</p>
            <h2>Full Stack Web & Game Developer</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Number,
})

// const textureUrl = ref('https://assets.kanapka.eu/images/ceo.png')
const textureUrl = ref('/images/temp.png')
</script>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  height: 100vh;
}
.header .description {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 80px 40px 70px 0;
  width: 100%;
  color: #fff;
}

h1 {
  font-size: 60px;
  color: #fff;
  margin-bottom: 80px;
}
h2 {
  font-size: 24px;
  color: #ddd;
}
p {
  font-size: 16px;
  color: #aaa;
}

.infoGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.infoItem {
  display: grid;
  align-items: center;
  gap: 20px;

  border-left: 1px solid var(--bg-color-l);
  padding-left: 20px;
}
.infoItem img {
  height: 40px;
  min-width: 40px;
  max-width: 80px;
  object-fit: contain;
}
</style>
