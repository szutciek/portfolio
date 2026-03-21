<template>
  <!--
    DrawPath — uses GSAP DrawSVGPlugin to reveal any SVG <path> (or shape)
    that lives inside the default slot.

    Usage:
      <DrawPath path-id="myPath" :duration="2" ease="power2.inOut" :repeat="-1" yoyo>
        <svg viewBox="0 0 400 300" ...>
          <path id="myPath" d="M10 150 C100 20 300 20 390 150" stroke="#6366f1"
                stroke-width="3" fill="none" />
        </svg>
      </DrawPath>

    Props
      path-id     – id of the element to draw inside the slotted SVG  (required)
      duration    – seconds for one full draw                          (default 1.5)
      repeat      – GSAP repeat; -1 = infinite                        (default 0)
      ease        – GSAP easing string                                 (default "power2.inOut")
      yoyo        – reverse on alternate cycles                        (default false)
      delay       – seconds before the animation starts               (default 0)
      from        – DrawSVG start value, e.g. "0%" or "50%"           (default "0%")
      to          – DrawSVG end value, e.g. "100%" or "75%"           (default "100%")
      autoplay    – start immediately on mount                         (default true)
      progress    – 0–1 scrub value; when provided the tween is paused
                    and driven entirely by this prop. Bind to a slider,
                    scroll position, or any reactive value.
                    e.g. :progress="scrollY / maxScroll"

    Exposes (via template ref)
      play()   – play / resume
      pause()  – pause
      reverse()– reverse
      restart()– restart from beginning
      seek(p)  – seek to progress 0-1 imperatively
  -->
  <div ref="containerRef" style="position: relative; display: inline-block; line-height: 0">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  pathId: { type: String, required: true },
  duration: { type: Number, default: 1.5 },
  repeat: { type: Number, default: 0 },
  ease: { type: String, default: 'power2.inOut' },
  yoyo: { type: Boolean, default: false },
  delay: { type: Number, default: 0 },
  from: { type: String, default: '0%' },
  to: { type: String, default: '100%' },
  autoplay: { type: Boolean, default: true },
  // When provided, the tween is paused and driven by this value (0-1).
  // Omit the prop entirely to use autoplay / imperative API instead.
  progress: { type: Number, default: undefined },
})

const emit = defineEmits(['complete', 'repeat', 'start'])

const containerRef = ref(null)
let tween = null

// ── GSAP loader (loads from CDN if not already present) ──────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}

async function ensureGSAP() {
  if (!window.gsap) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js')
  }
  // DrawSVGPlugin is a Club GSAP plugin — load the free "DrawSVGPlugin" shim
  // bundled with GSAP 3 on the CDN (available under the "bonus" path on unpkg).
  // For production use, install gsap and import DrawSVGPlugin from 'gsap/DrawSVGPlugin'.
  if (!window.DrawSVGPlugin) {
    await loadScript('https://unpkg.com/gsap@3.12.5/dist/DrawSVGPlugin.js')
  }
  window.gsap.registerPlugin(window.DrawSVGPlugin)
}

function buildTween() {
  const container = containerRef.value
  if (!container) return
  const target = container.querySelector(`#${props.pathId}`)
  if (!target) {
    console.warn(`[DrawPath] No element with id="${props.pathId}" found in slot.`)
    return
  }

  tween?.kill()

  // Set starting state — fully hidden
  window.gsap.set(target, { drawSVG: props.from })

  tween = window.gsap.to(target, {
    drawSVG: `${props.from} ${props.to}`,
    duration: props.duration,
    ease: props.ease,
    repeat: props.repeat,
    yoyo: props.yoyo,
    delay: props.delay,
    // Pause immediately if progress prop is controlling the tween
    paused: props.progress !== undefined || !props.autoplay,
    onStart: () => emit('start'),
    onComplete: () => emit('complete'),
    onRepeat: () => emit('repeat'),
  })

  // Apply initial progress value if prop is already set
  if (props.progress !== undefined) {
    tween.progress(Math.min(1, Math.max(0, props.progress)))
  }
}

onMounted(async () => {
  await ensureGSAP()
  // Wait one RAF so the slotted SVG is fully rendered
  requestAnimationFrame(buildTween)
})

onBeforeUnmount(() => tween?.kill())

// Re-build if structural props change
watch(
  () => [props.pathId, props.duration, props.ease, props.repeat, props.yoyo, props.from, props.to],
  async () => {
    await ensureGSAP()
    buildTween()
  },
)

// Scrub tween when progress prop changes
watch(
  () => props.progress,
  (val) => {
    if (val === undefined || !tween) return
    tween.pause()
    tween.progress(Math.min(1, Math.max(0, val)))
  },
)

// Public API exposed to parent via template ref
defineExpose({
  play: () => tween?.play(),
  pause: () => tween?.pause(),
  reverse: () => tween?.reverse(),
  restart: () => tween?.restart(),
  seek: (p) => tween?.progress(p),
})
</script>
