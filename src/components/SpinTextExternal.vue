<template>
  <a :href="props.target" target="_blank" data-cursor-target data-cursor-offset="10">
    <div class="spinWhite">
      <h1>{{ props.text }}</h1>
      <!-- prettier-ignore -->
      <h1>{{ props.text }}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48" style="fill:none;stroke-linecap:round;stroke-linejoin:round"/><polyline points="336 64 448 64 448 176" style="fill:none;stroke-linecap:round;stroke-linejoin:round"/><line x1="224" y1="288" x2="440" y2="72" style="fill:none;stroke-linecap:round;stroke-linejoin:round"/></svg></h1>
    </div>
  </a>
</template>

<script setup>
const props = defineProps({
  target: {
    type: String,
  },
  text: {
    type: String,
  },
})
</script>

<style scoped>
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
  font-size: 36px;
  font-weight: 300;
  transition: 0.4s;
}
.spinWhite svg {
  height: 35px;
  width: 35px;
  stroke: white;
  stroke-width: 24px;
}
.spinWhite:hover h1,
.cursor-snapped .spinWhite h1 {
  transform: translateY(-46px);
}
.spinWhite .moveSvg {
  opacity: 0;
  transition:
    transform 0.7s ease-out,
    opacity 0.1s;
}
.spinWhite:hover .moveSvg,
.cursor-snapped .spinWhite .moveSvg {
  transform: translateX(50px);
  opacity: 1;
}
.spinWhite:hover,
.cursor-snapped .spinWhite {
  transform: translateX(-10px);
}
</style>
