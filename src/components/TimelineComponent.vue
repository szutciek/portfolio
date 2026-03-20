<template>
  <div class="tl-root">
    <!-- ── Top track: Education ───────────────────────────── -->
    <div class="track track-top">
      <div
        v-for="(ev, i) in topEvents"
        :key="'top-' + i"
        class="ev"
        :class="{ passed: isPassed(ev.position), active: isActive(ev.position) }"
        :style="{ left: ev.position + '%' }"
      >
        <div class="card card-top">
          <h4>{{ ev.title }}</h4>
          <p>{{ ev.period }}</p>
        </div>
        <div class="stem"></div>
        <div class="dot"></div>
      </div>
    </div>

    <!-- ── Spine ──────────────────────────────────────────── -->
    <div class="spine-outer">
      <div class="spine-track">
        <div class="spine-fill" :style="{ width: progress + '%' }"></div>

        <div
          v-for="(m, i) in yearMarkers"
          :key="'m-' + i"
          class="yr-tick"
          :class="{ lit: progress >= m.position }"
          :style="{ left: m.position + '%' }"
        >
          <span class="yr-label">{{ m.year }}</span>
        </div>
      </div>

      <div class="progress-head" :style="{ left: progress + '%' }"></div>
    </div>

    <!-- ── Bottom track: Other activities ────────────────── -->
    <div class="track track-bot">
      <div
        v-for="(ev, i) in bottomEvents"
        :key="'bot-' + i"
        class="ev"
        :class="{ passed: isPassed(ev.position), active: isActive(ev.position) }"
        :style="{ left: ev.position + '%' }"
      >
        <div class="dot"></div>
        <div class="stem"></div>
        <div class="card card-bot">
          <h4>{{ ev.title }}</h4>
          <p>{{ ev.period }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// ─────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────
const props = defineProps({
  /**
   * 0–100. Drive from your parent's horizontal scroll handler:
   *   scrollLeft / (scrollWidth - clientWidth) * 100
   */
  scroll: {
    type: Number,
    default: 0,
  },
})

const progress = computed(() => Math.min(100, Math.max(0, props.scroll * 100)))

// Active: the nub is within this many % units of the node
const ACTIVE_WINDOW = 3.5
const isPassed = (pos) => progress.value > pos
const isActive = (pos) => Math.abs(progress.value - pos) <= 0

// ─────────────────────────────────────────────────────────────────
// Data – replace with your own events
// ─────────────────────────────────────────────────────────────────

/**
 * topEvents    → Education (above the spine)
 * bottomEvents → Other activities (below the spine)
 *
 * Each event:
 *   position    {Number} 0–100  – horizontal placement along the spine
 *   label       {String}        – small category tag, e.g. "Education"
 *   title       {String}        – main heading
 *   description {String}        – one or two sentences
 *   period      {String}        – date or year range shown at the bottom
 */
const topEvents = [
  {
    position: 20,
    title: 'Start of IB Diploma Programme @ ASW',
    description: 'Transfer to the American School of Warsaw.',
    period: 'September 2022',
  },
  {
    position: 55,
    title: 'Graduation with IB Bilingual Diploma @ ASW',
    description: 'Successful graduation with the bilingual diploma.',
    period: 'May 2024',
  },
  {
    position: 65,
    title: 'Start of Computer Science & Engineering @ TU/e',
    description: 'Start of the first academic year at university.',
    period: 'September 2024',
  },
  {
    position: 95,
    title: 'Graduation Computer Science & Engineering @ TU/e*',
    description: 'Expected graduation from TU/e.',
    period: 'Summer 2027',
  },
]

const bottomEvents = [
  {
    position: 5,
    title: 'First Software Projects',
    description: 'I quit my swimming career to pursue higher education in Computer Science.',
    period: 'Late 2020',
  },
  {
    position: 45,
    title: 'Drivers License Obtained',
    description: 'I passed the drivers license text for B category vehicles.',
    period: 'October 2023',
  },
  {
    position: 80,
    title: 'Epic 4000m Tandem Skydive',
    description: 'I jumped out of a plane before it landed.',
    period: 'July 2025',
  },
]

const yearMarkers = [
  { year: '2022', position: 10 },
  { year: '2023', position: 30 },
  { year: '2024', position: 50 },
  { year: '2025', position: 70 },
  { year: '2026', position: 90 },
]
</script>

<style scoped>
/* ── Tokens ──────────────────────────────────────────────────── */
/* Scoped to .tl-root so Vue's scoped CSS can resolve them */
.tl-root {
  --accent: var(--main-color-l);
  --spine-off: var(--bg-color-l);
  --node-off: #777;
  --text-faint: #777;
  --text-mid: #ddd;
}

/* ── Root ────────────────────────────────────────────────────── */
.tl-root {
  position: relative;
  width: 100%;
  min-width: 1100px;
  padding: 0 var(--base8);
  background: transparent;
}

/* ── Spine ───────────────────────────────────────────────────── */
.spine-outer {
  position: relative;
  height: var(--base);
}

.spine-track {
  position: absolute;
  inset: 0;
  background: var(--spine-off);
  border-radius: var(--base);
  overflow: visible;
}

.spine-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--accent);
  border-radius: var(--base);
  transition: width 0.3s;
}

.progress-head {
  display: none;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--base);
  height: var(--base);
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid #fff;
  box-shadow: 0 0 0 1.5px var(--accent);
  transition: left 0.3s;
  z-index: 5;
}

/* ── Year ticks ──────────────────────────────────────────────── */
.yr-tick {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--node-off);
  transition: background 0.3s;
  z-index: 2;
}

.yr-tick.lit {
  background: var(--accent);
}

.yr-label {
  position: absolute;
  top: var(--base2);
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--base);
  color: var(--text-faint);
  white-space: nowrap;
  user-select: none;
  transition: color 0.3s;
}

.yr-tick.lit .yr-label {
  color: var(--text-mid);
}

/* ── Tracks ──────────────────────────────────────────────────── */
.track {
  position: relative;
  height: 100%;
  background-color: red;
}

/* ── Event nodes ─────────────────────────────────────────────── */
.ev {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
  z-index: 4;
}

.track-top .ev {
  bottom: 0;
}
.track-bot .ev {
  top: 0;
}

.dot {
  display: none;
  width: calc(var(--base) * 1.5);
  height: calc(var(--base) * 1.5);
  border-radius: 50%;
  background: var(--node-off);
  border: 3px solid #ffffff;
  outline: 2px solid var(--node-off);
  flex-shrink: 0;
  z-index: 2;
  transition:
    background 0.3s,
    outline-color 0.3s;
}

.ev.passed .dot,
.ev.active .dot {
  background: var(--accent);
  outline-color: var(--accent);
}

.ev.active .dot {
  outline-width: 3px;
  outline-offset: 3px;
}

.stem {
  width: 5px;
  height: 30px;
  flex-shrink: 0;
  background: var(--spine-off);
  transition: background 0.1s;
}

.ev.passed .stem,
.ev.active .stem {
  background: var(--accent);
}

.card {
  max-width: calc((150vw - var(--base8) * 2) / 10 - var(--base2));
  padding: var(--base2);
  border: 1px solid var(--bg-color-l);
  transition: 0.3s;
}

.ev.passed .card,
.ev.active .card {
  background: var(--bg-color-l);
  border: 1px solid var(--main-color-l);
}

.ev h4 {
  color: #777;
  transition: 0.3s;
}
.ev p {
  color: #444;
  transition: 0.3s;
}

.ev.passed h4,
.ev.active h4 {
  color: #fff;
}

.ev.passed p,
.ev.active p {
  color: #777;
}

.ev-desc {
  font-size: 10.5px;
  line-height: 1.55;
  color: var(--text-faint);
  margin: 0 0 7px;
  transition: color 0.3s;
}

.ev.passed .ev-desc,
.ev.active .ev-desc {
  color: var(--text-mid);
}

.ev-period {
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--text-faint);
  transition: color 0.3s;
}

.ev.passed .ev-period,
.ev.active .ev-period {
  color: var(--accent);
}
</style>
