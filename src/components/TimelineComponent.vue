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
          <p class="ev-label">{{ ev.label }}</p>
          <h3 class="ev-title">{{ ev.title }}</h3>
          <p class="ev-desc">{{ ev.description }}</p>
          <span class="ev-period">{{ ev.period }}</span>
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
          <p class="ev-label">{{ ev.label }}</p>
          <h3 class="ev-title">{{ ev.title }}</h3>
          <p class="ev-desc">{{ ev.description }}</p>
          <span class="ev-period">{{ ev.period }}</span>
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
const isPassed = (pos) => progress.value > pos + ACTIVE_WINDOW / 2
const isActive = (pos) => Math.abs(progress.value - pos) <= ACTIVE_WINDOW

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
    position: 10,
    label: 'Education',
    title: 'School name',
    description: 'A short description of this stage of your education goes here.',
    period: '20XX – 20XX',
  },
  {
    position: 38,
    label: 'Education',
    title: 'School name',
    description: 'A short description of this stage of your education goes here.',
    period: '20XX – 20XX',
  },
  {
    position: 65,
    label: 'Education',
    title: 'Degree title',
    description: 'University or institution name. Area of study or specialisation.',
    period: '20XX – 20XX',
  },
  {
    position: 88,
    label: 'Education',
    title: 'Degree title',
    description: 'University or institution name. Area of study or specialisation.',
    period: '20XX – 20XX',
  },
]

const bottomEvents = [
  {
    position: 18,
    label: 'Sport',
    title: 'Activity name',
    description: 'Brief description of the sport or activity and your involvement.',
    period: '20XX – 20XX',
  },
  {
    position: 44,
    label: 'Sport',
    title: 'Activity name',
    description: 'Brief description of the sport or activity and your involvement.',
    period: '20XX – 20XX',
  },
  {
    position: 70,
    label: 'Work',
    title: 'Job title',
    description: 'Company or organisation name. What you worked on.',
    period: '20XX – 20XX',
  },
  {
    position: 92,
    label: 'Work',
    title: 'Job title',
    description: 'Company or organisation name. What you worked on.',
    period: '20XX – 20XX',
  },
]

const yearMarkers = [
  { year: '20XX', position: 0 },
  { year: '20XX', position: 20 },
  { year: '20XX', position: 40 },
  { year: '20XX', position: 60 },
  { year: '20XX', position: 80 },
  { year: '20XX', position: 100 },
]
</script>

<style scoped>
/* ── Tokens ──────────────────────────────────────────────────── */
/* Scoped to .tl-root so Vue's scoped CSS can resolve them */
.tl-root {
  --accent: var(--main-color-l);
  --spine-off: var(--bg-color-l);
  --node-off: #c8cfd9;
  --text-faint: #9ba8b8;
  --text-mid: #5a6880;
  --text-dark: #1a2236;
  --card-border: #e2e6ec;
  --card-bg: #ffffff;
  --tag-bg: #eef2fb;
  --tag-color: #1a56f0;
}

/* ── Root ────────────────────────────────────────────────────── */
.tl-root {
  position: relative;
  width: 100%;
  min-width: 1100px;
  padding: 0 80px;
  box-sizing: border-box;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  background: transparent;
}

/* ── Spine ───────────────────────────────────────────────────── */
.spine-outer {
  position: relative;
  height: 4px;
}

.spine-track {
  position: absolute;
  inset: 0;
  background: var(--spine-off);
  border-radius: 2px;
  overflow: visible;
}

.spine-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.04s linear;
}

.progress-head {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1.5px var(--accent);
  transition: left 0.04s linear;
  z-index: 5;
}

/* ── Year ticks ──────────────────────────────────────────────── */
.yr-tick {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
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
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 0.05em;
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
  height: 210px;
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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--node-off);
  border: 2px solid #ffffff;
  outline: 1.5px solid var(--node-off);
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
  outline-width: 2px;
  outline-offset: 2px;
}

.stem {
  width: 1px;
  height: 30px;
  flex-shrink: 0;
  background: var(--node-off);
  transition: background 0.3s;
}

.ev.passed .stem,
.ev.active .stem {
  background: var(--accent);
}

.card {
  width: 196px;
  padding: 12px 14px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  transition:
    border-color 0.3s,
    transform 0.3s;
}

.ev.active .card {
  border-color: var(--accent);
}

.track-top .ev.active .card {
  transform: translateY(-3px);
}
.track-bot .ev.active .card {
  transform: translateY(3px);
}

.ev-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--tag-color);
  background: var(--tag-bg);
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  margin: 0 0 6px;
}

.ev-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-faint);
  margin: 0 0 4px;
  line-height: 1.3;
  transition: color 0.3s;
}

.ev.passed .ev-title,
.ev.active .ev-title {
  color: var(--text-dark);
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
