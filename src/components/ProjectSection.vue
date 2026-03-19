<template>
  <div class="projects">
    <section vertical>
      <div class="transition">
        <div class="background">
          <ScrollText
            :texts="[`PROJECTS`]"
            :color="`var(--bg-color-l)`"
            :gap="8"
            :progress="sections[0]?.visibleProgress"
            :scrollRange="10"
          />
        </div>
        <div class="content"></div>
      </div>
    </section>
    <section vertical>
      <WebcamGameSection :scroll="sections[1]" />
    </section>
    <section vertical>
      <KanapkaSSOSection :scroll="sections[2]" />
    </section>
    <section vertical>
      <CheckoutSection :scroll="sections[3]" />
    </section>
    <section vertical>
      <RoomganizerSection :scroll="sections[4]" />
    </section>
    <section vertical>
      <ZolwieSection :scroll="sections[5]" />
    </section>
  </div>
</template>

<script setup>
import ScrollText from '@/components/effects/ScrollText.vue'

const props = defineProps({
  sections: Array,
})
</script>

<style scoped>
.transition {
  position: relative;
  height: 50vh;
  width: var(--full-width);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.transition .background {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  /* background-color: var(--main-color-l); */
}
.transition .content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
