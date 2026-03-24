<template>
  <div class="snappable">
    <Link :href="props.target" data-cursor-target data-cursor-offset="5">
      <div class="spinWhite">
        <h1>{{ props.text }}</h1>
        <!-- prettier-ignore -->
        <h1>{{ props.text }}<svg class="moveSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><polyline points="268 112 412 256 268 400" style="fill:none;stroke-linecap:round;stroke-linejoin:round"/><line x1="392" y1="256" x2="100" y2="256" style="fill:none;stroke-linecap:round;stroke-linejoin:round"/></svg></h1>
      </div>
    </Link>
  </div>
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
.snappable {
  margin: var(--base) calc(-1 * var(--base));
}
.spinWhite {
  color: white;
  height: 46px;
  line-height: 46px;
  margin: var(--base) var(--base);
  font-size: 18px;
  overflow: hidden;
  transition: 0.4s;
}
.spinWhite h1 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: var(--base3);
  white-space: nowrap;
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
