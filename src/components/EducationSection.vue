<template>
  <section marker class="education _half">
    <section marker class="phantomMarker"></section>
    <div class="container">
      <HorizontalSticky :stick="scroll?.coveredProgress">
        <AdjacentIcon class="title _subsectionTitle" overrideGap="var(--base3)">
          <!-- prettier-ignore -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 160c16-63.16 76.43-95.41 208-96a15.94 15.94 0 0116 16v288a16 16 0 01-16 16c-128 0-177.45 25.81-208 64-30.37-38-80-64-208-64-9.88 0-16-8.05-16-17.93V80a15.94 15.94 0 0116-16c131.57.59 192 32.84 208 96zM256 160v288" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
          <h2>Education & Experience<span>/ About me</span></h2>
        </AdjacentIcon>
      </HorizontalSticky>
      <div class="media">
        <HorizontalSticky :stick="scroll?.coveredProgress">
          <div class="photoArea">
            <div class="center" ref="slideTarget"></div>
          </div>
        </HorizontalSticky>
      </div>
      <TimelineComponent :scroll="scroll?.markers[0]?.coveredProgress" :events :markers />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  scroll: Object,
})

const events = {
  top: [
    {
      position: 10,
      title: 'End of Swimming Career',
      period: 'Summer 2021',
      // images: [
      //   '/images/timeline/race.avif',
      //   '/images/timeline/gim92.avif',
      //   '/images/timeline/dive.avif',
      // ],
    },
    {
      position: 32.5,
      title: 'Graduation - IB Bilingual Diploma',
      period: 'May 2024',
      images: [
        '/images/timeline/ib.avif',
        '/images/timeline/polin.avif',
        '/images/timeline/asw.avif',
      ],
    },
    {
      position: 47.5,
      title: 'Start of Studies - CSE @ TU/e',
      period: 'September 2024',
      images: ['/images/timeline/tue.avif', '/images/timeline/campus.avif'],
    },
    {
      position: 90,
      title: 'Graduation - Computer Science & Engineering',
      period: 'Expected Summer 2027',
    },
  ],
  bottom: [
    {
      position: 5,
      title: 'First Software Projects',
      period: 'Late 2020',
    },
    {
      position: 22.5,
      title: 'Drivers License Obtained',
      period: 'October 2023',
    },
    {
      position: 67.5,
      title: 'Joined Totem Game Dev',
      period: 'September 2025',
    },
  ],
}

const markers = [
  { year: 2021, position: 10 },
  { year: '...', position: 20 },
  { year: 2024, position: 30 },
  { year: 2025, position: 50 },
  { year: 2026, position: 70 },
  { year: 2027, position: 90 },
]

const generateMarkers = (startYear, nYears) => {
  nYears++
  for (let i = 0; i < nYears; i++) {
    markers.push({ year: `${startYear + i}`, position: ((i + 0.5) * 100) / nYears })
    console.log(`{ year: ${startYear + i}, position: ${((i + 0.5) * 100) / nYears}}`)
  }
}
// generateMarkers(2021, 4)

const slideTarget = ref(null)
let currentEvent = null

const deployImages = (imgs, initialX, initialY, dir) => {
  if (!imgs?.length || !slideTarget.value) return

  const rect = slideTarget.value.getBoundingClientRect()
  const segment = rect.width / imgs.length

  imgs.forEach((element, i) => {
    const finalX = i * segment + segment / 2
    const finalY = rect.height / 2
    element.style.position = 'absolute'
    element.style.opacity = 1
    element.style.left = `calc(${finalX}px - ${50 / imgs.length}%)`
    element.style.top = `${finalY}px`
    element.style.maxWidth = `80px`
    element.style.maxHeight = `40vh`
    element.style.objectFit = 'contain'
    const globalFinalX = rect.x + finalX
    const globalFinalY = rect.y + finalY
    element.style.transform = `translate(${initialX - globalFinalX}px, ${initialY - globalFinalY}px) rotate(${dir * 70}deg)`
    element.style.transition = 'none'

    slideTarget.value.appendChild(element)
    element.getBoundingClientRect()

    const randomAngle = Math.random() * 10 - 5

    element.style.maxWidth = `${100 / imgs.length}%`
    element.style.transition = `1s cubic-bezier(0.22, 1, 0.36, 1)`
    element.style.transform = `translate(0, -50%) rotate(${randomAngle}deg)`
  })
}

const hideImages = () => {
  slideTarget.value.querySelectorAll('img').forEach((element) => {
    element.style.opacity = 0
    element.style.transform = `translate(0, -50%) scale(0.1) rotate(0)`
    element.addEventListener('transitionend', () => element.remove(), { once: true })
  })
}

const handleScroll = () => {
  const curPos = props.scroll?.markers[0]?.coveredProgress * 100
  let newestEvent = null
  for (let i = 0; i < events.top.length; i++) {
    if (events.top[i].position <= curPos) {
      newestEvent = events.top[i]
    }
  }
  if (!newestEvent) return
  if (!newestEvent.images || !newestEvent.images.length) return
  if (currentEvent?.position !== newestEvent.position) {
    let direction = 1
    if (currentEvent?.position > newestEvent.position) {
      direction = -1
    }

    currentEvent = newestEvent

    hideImages()

    const query = `div._eventSlide[data-position="${newestEvent.position}"]`
    const eventElement = document.querySelector(query)
    const rect = eventElement.getBoundingClientRect()

    deployImages(newestEvent?._imageElements, rect.x + rect.width / 2, rect.y, direction)
  }
}

const preloadEventImages = (events) => {
  events.forEach((event) => {
    if (!event.images?.length) return
    event._imageElements = event.images.map((src) => {
      const img = document.createElement('img')
      img.src = src
      return img
    })
  })
}

onMounted(() => {
  preloadEventImages(events.top)
})

watch(() => props.scroll, handleScroll)
</script>

<style scoped>
.education {
  height: 100vh;
  position: relative;
  min-width: 100vw;
}

.title {
  padding: var(--base8);
  width: 100vw;
}

.phantomMarker {
  position: absolute;
  left: calc(var(--full-width) / -2);
  width: calc(100%);
}

.container {
  height: 100vh;
  display: grid;
  grid-template-rows: min-content 6fr 4fr;
  align-items: center;
}

.media {
  width: 100%;
  height: 100%;
  position: relative;
}

.media .absolute {
  position: absolute;
  inset: 0;
  width: 100%;
}

.photoArea {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.center {
  width: 50vw;
  height: 20%;
  position: relative;
}

@media (max-height: 1200px) {
  .container {
    height: 100vh;
    display: grid;
    grid-template-rows: min-content 5fr 5fr;
    align-items: center;
  }
}
</style>
