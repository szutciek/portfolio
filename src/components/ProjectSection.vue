<template>
  <div class="projects">
    <section vertical>
      <WebcamGameSection :scroll="sections[0]" />
    </section>
    <section vertical>
      <KanapkaSSOSection :scroll="sections[1]" />
    </section>
    <section vertical>
      <CheckoutSection :scroll="sections[2]" />
    </section>
    <section vertical>
      <RoomganizerSection :scroll="sections[3]" />
    </section>
    <section vertical>
      <ZolwieSection :scroll="sections[4]" />
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  sections: Array,
})
</script>
