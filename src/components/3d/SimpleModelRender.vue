<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const props = defineProps({
  modelUrl: {
    type: String,
    required: true,
  },

  // Scroll progress from 0 → 1
  scrollProgress: {
    type: Number,
    default: null,
  },

  // Define start/end transforms for scroll animation
  scrollTransform: {
    type: Object,
    default: () => ({
      positionStart: [0, 0, 0],
      positionEnd: [0, 0, 0],
      rotationStart: [0, 0, 0],
      rotationEnd: [0, 0, 0],
      scaleStart: [1, 1, 1],
      scaleEnd: [1, 1, 1],
    }),
  },

  screenMeshName: { type: String, default: null },
  screenTextureUrl: { type: String, default: null },

  backgroundColor: { type: String, default: null },
  cameraPosition: { type: Array, default: () => [0, 1, 3] },
  lightIntensity: { type: Number, default: 1 },
  limitControls: { type: Boolean, default: false },
})

// ─── refs ──────────────────────────────────────────────────────────────────────
const container = ref(null)

// Three.js objects
let renderer, scene, camera, controls, frameId, model
let textureLoader = new THREE.TextureLoader()

// Video state
let videoElement = null
let videoTexture = null

// Loading canvas state
let loadingCanvas = null
let loadingCtx = null
let loadingTexture = null
let loadingRafId = null
let loadingStartTime = 0

// Cross-fade state
let fadeActive = false
let fadeStartTime = 0
let fadeDuration = 600 // ms
let fromMaterial = null
let toMaterial = null

// Mouse-pan state
let targetPanX = 0,
  targetPanY = 0
let panOffsetX = 0,
  panOffsetY = 0
let baseRotation = new THREE.Euler()

// Track the URL that is currently shown so we don't re-apply needlessly
let currentlyAppliedUrl = null

// ─── helpers ──────────────────────────────────────────────────────────────────
function lerp(a, b, t) {
  return a + (b - a) * t
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function isVideoUrl(url) {
  if (!url) return false
  const lower = url.toLowerCase().split('?')[0]
  return lower.endsWith('.webm') || lower.endsWith('.mp4')
}

// ─── Loading-screen canvas texture ────────────────────────────────────────────
/**
 * Creates (or resets) a canvas that renders a looping loading animation and
 * returns the corresponding THREE.CanvasTexture.
 */
function createLoadingTexture() {
  disposeLoadingTexture()

  // 16:9 canvas so UV mapping fills the monitor without distortion
  const W = 910
  const H = 512
  loadingCanvas = document.createElement('canvas')
  loadingCanvas.width = W
  loadingCanvas.height = H
  loadingCtx = loadingCanvas.getContext('2d')

  loadingStartTime = performance.now()

  function drawFrame() {
    const now = performance.now()
    const elapsed = (now - loadingStartTime) / 1000
    const ctx = loadingCtx
    const cx = W / 2,
      cy = H / 2

    ctx.clearRect(0, 0, W, H)

    // ── Flat dark background ────────────────────────────────────────────────
    ctx.fillStyle = '#111418'
    ctx.fillRect(0, 0, W, H)

    // ── Shimmer sweep ───────────────────────────────────────────────────────
    // A wide diagonal band that sweeps left-to-right, filling ~80 % of the
    // screen width at its peak.  Diagonal slant is achieved by drawing the
    // gradient at an angle (rotated canvas transform).
    const cycle = 1.8 // seconds per full sweep
    const phase = (elapsed % cycle) / cycle // 0 → 1
    // Travel from fully off-left to fully off-right
    const sweepX = lerp(-W * 0.6, W * 1.6, phase)
    // Half-width of the bright band: ~55 % of canvas width
    const hw = W * 0.55

    // Rotate the canvas slightly so the band is diagonal
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(-0.18) // ~10° clockwise tilt
    ctx.translate(-cx, -cy)

    const shimmer = ctx.createLinearGradient(sweepX - hw, 0, sweepX + hw, 0)
    shimmer.addColorStop(0, 'rgba(255,255,255,0)')
    shimmer.addColorStop(0.35, 'rgba(255,255,255,0)')
    shimmer.addColorStop(0.48, 'rgba(255,255,255,0.07)')
    shimmer.addColorStop(0.5, 'rgba(255,255,255,0.13)')
    shimmer.addColorStop(0.52, 'rgba(255,255,255,0.07)')
    shimmer.addColorStop(0.65, 'rgba(255,255,255,0)')
    shimmer.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = shimmer
    // Draw a taller-than-canvas rect so the rotated band covers all edges
    ctx.fillRect(-W, -H, W * 3, H * 3)
    ctx.restore()

    // ── Small spinner ───────────────────────────────────────────────────────
    const R = Math.min(W, H) * 0.055 // relative to shorter dimension
    const angle = elapsed * Math.PI * 2.5
    const arcLen = Math.PI * 1.5

    // Track
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 2.5
    ctx.stroke()

    // Arc
    ctx.beginPath()
    ctx.arc(cx, cy, R, angle, angle + arcLen)
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.stroke()

    if (loadingTexture) loadingTexture.needsUpdate = true
    loadingRafId = requestAnimationFrame(drawFrame)
  }

  loadingRafId = requestAnimationFrame(drawFrame)

  loadingTexture = new THREE.CanvasTexture(loadingCanvas)
  loadingTexture.colorSpace = THREE.SRGBColorSpace
  // Apply same orientation transform used for real assets
  loadingTexture.center.set(0.5, 0.5)
  loadingTexture.rotation = -Math.PI / 2
  loadingTexture.flipY = false

  return loadingTexture
}

function disposeLoadingTexture() {
  if (loadingRafId) {
    cancelAnimationFrame(loadingRafId)
    loadingRafId = null
  }
  if (loadingTexture) {
    loadingTexture.dispose()
    loadingTexture = null
  }
  loadingCanvas = null
  loadingCtx = null
}

// ─── Video helpers ─────────────────────────────────────────────────────────────
function disposeVideoTexture() {
  if (videoElement) {
    videoElement.pause()
    videoElement.removeAttribute('src')
    videoElement.load()
    videoElement = null
  }
  if (videoTexture) {
    videoTexture.dispose()
    videoTexture = null
  }
}

// ─── Screen material builders ──────────────────────────────────────────────────
function buildMaterial(texture) {
  return new THREE.MeshStandardMaterial({
    map: texture,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: texture,
    emissiveIntensity: 1,
    transparent: true,
    opacity: 1,
  })
}

// ─── Cross-fade ────────────────────────────────────────────────────────────────
/**
 * Smoothly transition the screen mesh from `from` material to `to` material
 * by tweening opacity over `fadeDuration` ms.
 */
function startFade(screenMesh, toMat) {
  // Cancel any in-progress fade
  fadeActive = false

  if (fromMaterial && fromMaterial !== screenMesh.material) fromMaterial.dispose()
  fromMaterial = screenMesh.material // keep the current one alive during fade

  toMat.opacity = 0
  screenMesh.material = toMat
  toMaterial = toMat

  fadeActive = true
  fadeStartTime = performance.now()
}

// Called each frame from animate()
function tickFade(screenMesh) {
  if (!fadeActive || !toMaterial) return

  const t = Math.min((performance.now() - fadeStartTime) / fadeDuration, 1)
  const e = easeInOut(t)

  toMaterial.opacity = e

  if (t >= 1) {
    fadeActive = false
    if (fromMaterial) {
      fromMaterial.dispose()
      fromMaterial = null
    }
  }
}

// ─── Main asset loader ─────────────────────────────────────────────────────────
/**
 * Shows the loading canvas on the screen mesh, then loads the real asset.
 * Once the asset is fully ready, cross-fades it in.
 */
function applyScreenTexture(newUrl) {
  if (!model || !props.screenMeshName) return

  const url = newUrl ?? props.screenTextureUrl
  if (!url) return
  if (url === currentlyAppliedUrl) return // already showing this asset

  const screenMesh = model.getObjectByName(props.screenMeshName)
  if (!screenMesh) return

  // ── Step 1: show loading screen immediately ──────────────────────────────
  const loadingTex = createLoadingTexture()
  const loadingMat = buildMaterial(loadingTex)

  // If the mesh already has a material, cross-fade to loading screen;
  // otherwise just set it directly (first load).
  if (screenMesh.material) {
    startFade(screenMesh, loadingMat)
  } else {
    screenMesh.material = loadingMat
  }

  // Dispose previous real-asset state
  disposeVideoTexture()

  // ── Step 2: load the real asset in the background ────────────────────────
  if (isVideoUrl(url)) {
    loadVideoAsset(url, screenMesh)
  } else {
    loadImageAsset(url, screenMesh)
  }

  currentlyAppliedUrl = url
}

function loadImageAsset(url, screenMesh) {
  textureLoader.load(
    url,
    (texture) => {
      // Fully loaded
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      texture.center.set(0.5, 0.5)
      texture.rotation = -Math.PI / 2
      texture.flipY = false

      const realMat = buildMaterial(texture)

      disposeLoadingTexture()
      startFade(screenMesh, realMat)
    },
    undefined, // onProgress (not used)
    (err) => {
      console.error('[ThreeModelViewer] Image load failed:', err)
      // Leave loading screen up – or you could show an error texture here
    },
  )
}

function loadVideoAsset(url, screenMesh) {
  // Create the video element
  videoElement = document.createElement('video')
  videoElement.src = url
  videoElement.crossOrigin = 'anonymous'
  videoElement.muted = false
  videoElement.loop = false
  videoElement.playsInline = true
  videoElement.preload = 'auto'
  videoElement.load()

  // We wait for `canplaythrough` so the entire buffer is ready (no stutter on first frame)
  videoElement.addEventListener(
    'canplaythrough',
    () => {
      videoTexture = new THREE.VideoTexture(videoElement)
      videoTexture.colorSpace = THREE.SRGBColorSpace
      videoTexture.center.set(0.5, 0.5)
      videoTexture.rotation = -Math.PI / 2
      videoTexture.flipY = false

      const realMat = buildMaterial(videoTexture)

      disposeLoadingTexture()
      startFade(screenMesh, realMat)

      // Start playback after the fade has begun so first frame is visible
      videoElement.play().catch(() => {
        // Autoplay blocked – video will play on first user interaction
      })

      videoElement.addEventListener('ended', () => videoElement.pause())
    },
    { once: true },
  )

  videoElement.addEventListener('error', (err) => {
    console.error('[ThreeModelViewer] Video load failed:', err)
  })
}

// ─── Scene setup ───────────────────────────────────────────────────────────────
function applyScrollTransform(progress) {
  if (!model || progress === null || progress === undefined) return

  const t = THREE.MathUtils.clamp(progress, 0, 1)
  const cfg = props.scrollTransform

  model.position.set(
    lerp(cfg.positionStart[0], cfg.positionEnd[0], t),
    lerp(cfg.positionStart[1], cfg.positionEnd[1], t),
    lerp(cfg.positionStart[2], cfg.positionEnd[2], t),
  )

  baseRotation.set(
    lerp(cfg.rotationStart[0], cfg.rotationEnd[0], t),
    lerp(cfg.rotationStart[1], cfg.rotationEnd[1], t),
    lerp(cfg.rotationStart[2], cfg.rotationEnd[2], t),
  )

  model.scale.set(
    lerp(cfg.scaleStart[0], cfg.scaleEnd[0], t),
    lerp(cfg.scaleStart[1], cfg.scaleEnd[1], t),
    lerp(cfg.scaleStart[2], cfg.scaleEnd[2], t),
  )
}

function initScene() {
  scene = new THREE.Scene()

  if (props.backgroundColor !== null) {
    scene.background = new THREE.Color(props.backgroundColor)
  }

  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(...props.cameraPosition)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.value.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0xffffff, props.lightIntensity * 0.6)
  const directional = new THREE.DirectionalLight(0xffffff, props.lightIntensity)
  directional.position.set(5, 10, 7)
  scene.add(ambient, directional)

  if (!props.limitControls) {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
  } else {
    window.addEventListener('mousemove', onMouseMove)
  }

  loadModel()
  animate()
  window.addEventListener('resize', onResize)
}

function onMouseMove(event) {
  const rect = container.value.getBoundingClientRect()
  const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1
  targetPanY = nx * 0.05
  targetPanX = -ny * 0.05
}

function loadModel() {
  const loader = new GLTFLoader()
  currentlyAppliedUrl = null // reset so the texture is re-applied after reload

  loader.load(props.modelUrl, (gltf) => {
    if (model) scene.remove(model)

    model = gltf.scene
    scene.add(model)

    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3()).length()
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(center)

    camera.near = size / 100
    camera.far = size * 100
    camera.updateProjectionMatrix()
    camera.lookAt(0, 0, 0)

    if (controls) {
      controls.target.set(0, 0, 0)
      controls.update()
    }

    applyScreenTexture(props.screenTextureUrl)
    applyScrollTransform(props.scrollProgress)
  })
}

function animate() {
  frameId = requestAnimationFrame(animate)

  if (controls) controls.update()

  // Keep video texture alive
  if (videoTexture && videoElement && !videoElement.paused && !videoElement.ended) {
    videoTexture.needsUpdate = true
  }

  // Model rotation + mouse pan
  if (model) {
    if (props.limitControls) {
      panOffsetX += (targetPanX - panOffsetX) * 0.08
      panOffsetY += (targetPanY - panOffsetY) * 0.08
    }
    model.rotation.set(baseRotation.x, baseRotation.y + panOffsetY, baseRotation.z + panOffsetX)
  }

  // Cross-fade tick
  if (fadeActive && model && props.screenMeshName) {
    const screenMesh = model.getObjectByName(props.screenMeshName)
    if (screenMesh) tickFade(screenMesh)
  }

  renderer.render(scene, camera)
}

function onResize() {
  if (!container.value) return
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(initScene)

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', onResize)
  if (props.limitControls) window.removeEventListener('mousemove', onMouseMove)

  disposeLoadingTexture()
  disposeVideoTexture()
  if (fromMaterial) {
    fromMaterial.dispose()
    fromMaterial = null
  }
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
  }
  if (controls) controls.dispose()
})

watch(() => props.modelUrl, loadModel)
watch(() => props.screenTextureUrl, applyScreenTexture)
watch(() => props.scrollProgress, applyScrollTransform)
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
