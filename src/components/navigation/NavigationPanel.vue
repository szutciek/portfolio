<template>
  <div :class="[`slideNav`, props.isOpen ? `visible` : `hidden`]">
    <!-- prettier-ignore -->
    <div class="close" data-cursor-target @click="$emit('close')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg></div>
    <div class="navArea">
      <ul class="navAreaGrid">
        <li class="marker">Navigation</li>
        <SpinTextInternal
          data-cursor-target
          data-cursor-offset="8"
          @click="$emit('close')"
          text="Introduction"
          target="#introduction"
        />
        <SpinTextInternal
          data-cursor-target
          data-cursor-offset="8"
          @click="$emit('close')"
          text="About"
          target="#about"
        />
        <SpinTextInternal
          data-cursor-target
          data-cursor-offset="8"
          @click="$emit('close')"
          text="Projects"
          target="#projects"
        />
      </ul>
      <ul class="liveAreaGrid">
        <li class="marker">Live Projects</li>
        <SpinTextExternal
          data-cursor-target
          data-cursor-offset="8"
          text="Turtle Game"
          target="https://zolwie.kanapka.eu"
        />
        <SpinTextExternal
          data-cursor-target
          data-cursor-offset="8"
          text="Webcam Game"
          target="https://webcamgame.kanapka.eu"
        />
        <SpinTextExternal
          data-cursor-target
          data-cursor-offset="8"
          text="IBpedia"
          target="https://ibpedia.kanapka.eu"
        />
        <SpinTextExternal
          data-cursor-target
          data-cursor-offset="8"
          text="Sztorify"
          target="https://sztorify.kanapka.eu"
        />
        <SpinTextExternal
          data-cursor-target
          data-cursor-offset="8"
          text="Gaming"
          target="https://gaming.kanapka.eu"
        />
      </ul>
      <NavigationContact />
      <h4 class="authAreaGrid">&copy; Maciej Szuter 2026</h4>
    </div>
  </div>
</template>

<style scoped>
.slideNav {
  position: fixed;
  top: 0;
  height: 100dvh;
  width: calc(100vw - 80px);
  border-left: 1px solid #1f1f1f;
  background-color: var(--bg-color-d);
  transition:
    left 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.2s linear;
  color: white;
  padding: 0 80px 0 0;
  overflow-y: auto;
  z-index: 101;
}
.slideNav.hidden {
  background-color: var(--bg-color-d);
  left: calc(100vw - 80px);
}
.slideNav.visible {
  background-color: var(--bg-color-l);
  left: 80px;
}

.close {
  width: 40px;
  height: 40px;
  background-color: var(--main-color-l);
  position: absolute;
  top: 30px;
  right: 110px;
  cursor: pointer;
}
.close svg {
  max-width: 100%;
  max-height: 100%;
  fill: white;
  stroke: var(--main-color-l);
  stroke-width: 36px;
}
.navArea {
  display: grid;
  grid-template-columns: 360px 360px minmax(auto, 500px);
  grid-template-areas: 'nav live cont' 'auth auth auth';
  gap: 50px;
  height: 100%;
  padding: 200px 200px 0 200px;
  border-right: 1px solid #1f1f1f;
}
.navArea a {
  width: fit-content;
  text-decoration: none;
}
.navArea ul {
  list-style: none;
}
.navArea .marker {
  font-weight: 300;
  color: #c7c7c7;
}
.spinWhite {
  color: white;
  height: 46px;
  line-height: 46px;
  margin: 15px 0;
  font-size: 18px;
  overflow: hidden;
  transition: 0.4s;
}
.spinWhite h1 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  font-weight: 300;
  transition: 0.4s;
}
.spinWhite svg {
  height: 35px;
  width: 35px;
  stroke: white;
  stroke-width: 24px;
}
.spinWhite:hover h1 {
  transform: translateY(-46px);
}
.spinWhite .moveSvg {
  opacity: 0;
  transition:
    transform 0.7s ease-out,
    opacity 0.1s;
}
.spinWhite:hover .moveSvg {
  transform: translateX(50px);
  opacity: 1;
}
.spinWhite:hover {
  transform: translateX(-10px);
}
.navArea h4 {
  margin-top: auto;
  color: #909090;
  font-size: 15px;
  font-weight: 100;
  padding-bottom: 100px;
}

.navAreaGrid {
  grid-area: nav;
}
.liveAreaGrid {
  grid-area: live;
}
.contAreaGrid {
  grid-area: cont;
}
.authAreaGrid {
  grid-area: auth;
}
</style>

<script setup>
const props = defineProps({
  isOpen: Boolean,
})
</script>
