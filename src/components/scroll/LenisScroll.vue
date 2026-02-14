<template>
  <div ref="wrapper" class="lenis-wrapper">
    <div ref="content" class="lenis-content">
      <slot :global="globalData" :sections="sectionData" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, onBeforeUnmount } from 'vue'
import Lenis from 'lenis'

import VerticalScrollSection from '@/classes/VerticalScrollSection.js'
import HorizontalScrollSection from '@/classes/HorizontalScrollSection.js'

const props = defineProps({
  sections: {
    type: Boolean,
    default: false,
  },
})

const wrapper = ref(null)
const content = ref(null)

const globalData = ref({
  scroll: 0,
  limit: 0,
  progress: 0,
  velocity: 0,
  direction: 0,
})

let sections = []
const sectionData = ref([])

let lenis
let rafId

onMounted(() => {
  const validateSections = () => {
    if (!content.value) {
      console.warn(`@components/LenisScroll.vue: Content element not found.`)
      return
    }

    const sectionElements = [...content.value.querySelectorAll('section')]

    sectionElements.forEach((section) => {
      const isVertical = section.hasAttribute('vertical')
      const isHorizontal = section.hasAttribute('horizontal')

      if (isVertical && isHorizontal) {
        console.warn(`@components/LenisScroll.vue: Section cannot be both vertical and horizontal.`)
      }

      if (isVertical) {
        sections.push(new VerticalScrollSection(section))
      } else if (isHorizontal) {
        sections.push(new HorizontalScrollSection(section))
      }
    })
    computeSectionData({ scroll: 0 })
  }

  const computeGlobalData = (e) => {
    const { scroll, limit, velocity, direction } = e

    globalData.value.scroll = scroll
    globalData.value.limit = limit
    globalData.value.velocity = velocity
    globalData.value.direction = direction
    globalData.value.progress = limit > 0 ? scroll / limit : 0
  }

  const computeSectionData = (e) => {
    const { scroll } = e

    let sum = 0
    for (let i = 0; i < sections.length; i++) {
      sections[i].setGlobalScrollRange(sum, sum + sections[i].scrollableSize)
      sum += sections[i].scrollableSize
    }

    sections.forEach((section, i) => {
      sectionData.value[i] = section.getSectionData(scroll)
    })
  }

  const translateHorizontalSections = (e) => {
    sections.forEach((section) => {
      section.translateScrollX(section.getClampedCoveredScrollProgress(e.scroll))
    })
  }

  if (props.sections) {
    validateSections()
  }

  lenis = new Lenis({
    wrapper: wrapper.value,
    content: content.value,
    duration: 1,
    orientation: 'vertical',
    easing: (x) => 1 - Math.pow(1 - x, 5),
    smoothWheel: true,
    smoothTouch: false,
  })

  lenis.on('scroll', (e) => {
    computeGlobalData(e)
    computeSectionData(e)
    translateHorizontalSections(e)
  })

  const raf = (time) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  raf()

  const resizeObserver = new ResizeObserver(() => {
    sections.forEach((section) => {
      section.cleanUp()
    })
    sections = []
    validateSections()
    computeSectionData({ scroll: 0 })
  })

  resizeObserver.observe(content.value)
})

// onBeforeUnmount(() => {
//   cancelAnimationFrame(rafId)
//   if (lenis) {
//     lenis.destroy()
//   }
//   if (resizeObserver) {
//     resizeObserver.unobserve(content.value)
//   }
// })
</script>

<style scoped>
.lenis,
.lenis-wrapper {
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
}

.lenis-content {
  min-height: 100%;
}
</style>
