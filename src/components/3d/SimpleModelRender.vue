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

  screenMeshName: {
    type: String,
    default: null,
  },
  screenTextureUrl: {
    type: String,
    default: null,
  },

  backgroundColor: {
    type: String,
    default: null,
  },
  cameraPosition: {
    type: Array,
    default: () => [0, 1, 3],
  },
  lightIntensity: {
    type: Number,
    default: 1,
  },

  limitControls: {
    type: Boolean,
    default: false,
  },
})

const container = ref(null)
let renderer, scene, camera, controls, frameId, model
let textureLoader = new THREE.TextureLoader()

// Video texture state
let videoElement = null
let videoTexture = null

let mouseX = 0
let mouseY = 0

let targetPanX = 0
let targetPanY = 0

let panOffsetX = 0
let panOffsetY = 0

let baseRotation = new THREE.Euler()

function lerp(start, end, t) {
  return start + (end - start) * t
}

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
  scene.add(ambient)

  const directional = new THREE.DirectionalLight(0xffffff, props.lightIntensity)
  directional.position.set(5, 10, 7)
  scene.add(directional)

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

  const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1

  targetPanY = normalizedX * 0.05
  targetPanX = -normalizedY * 0.05
}

/**
 * Returns true if the given URL points to a video file (webm or mp4).
 */
function isVideoUrl(url) {
  if (!url) return false
  const lower = url.toLowerCase().split('?')[0] // strip query params before checking extension
  return lower.endsWith('.webm') || lower.endsWith('.mp4')
}

/**
 * Disposes the current video element and its Three.js texture, if any.
 */
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

/**
 * Creates a <video> element for the given URL, returns a THREE.VideoTexture.
 * The video plays once (no loop) and pauses on end.
 */
function createVideoTexture(url) {
  disposeVideoTexture()

  videoElement = document.createElement('video')
  videoElement.src = url
  videoElement.crossOrigin = 'anonymous'
  videoElement.muted = false // unmuted — adjust if autoplay policy requires muted
  videoElement.loop = false
  videoElement.playsInline = true

  // Play as soon as enough data is available
  videoElement.addEventListener(
    'canplay',
    () => {
      videoElement.play().catch(() => {
        // Autoplay may be blocked; the texture will still update once the user
        // interacts with the page and playback starts.
      })
    },
    { once: true },
  )

  // Pause at the last frame when the video ends (no black flash)
  videoElement.addEventListener('ended', () => {
    videoElement.pause()
  })

  videoElement.load()

  videoTexture = new THREE.VideoTexture(videoElement)
  videoTexture.colorSpace = THREE.SRGBColorSpace

  // Match the orientation tweaks used for static textures
  videoTexture.center.set(0.5, 0.5)
  videoTexture.rotation = -Math.PI / 2
  videoTexture.flipY = false

  return videoTexture
}

function applyScreenTexture() {
  if (!model || !props.screenMeshName || !props.screenTextureUrl) return

  const screenMesh = model.getObjectByName(props.screenMeshName)
  if (!screenMesh) return

  if (isVideoUrl(props.screenTextureUrl)) {
    // ── Video path ──────────────────────────────────────────────────────────
    const texture = createVideoTexture(props.screenTextureUrl)

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: texture,
      emissiveIntensity: 1,
    })

    screenMesh.material = material
  } else {
    // ── Static image path (original behaviour) ───────────────────────────
    disposeVideoTexture()

    textureLoader.load(props.screenTextureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

      texture.center.set(0.5, 0.5)
      texture.rotation = -Math.PI / 2
      texture.flipY = false

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: texture,
        emissiveIntensity: 1,
      })

      screenMesh.material = material
    })
  }
}

function loadModel() {
  const loader = new GLTFLoader()

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

    applyScreenTexture()
    applyScrollTransform(props.scrollProgress)
  })
}

function animate() {
  frameId = requestAnimationFrame(animate)

  if (controls) controls.update()

  if (videoTexture && videoElement && !videoElement.paused && !videoElement.ended) {
    videoTexture.needsUpdate = true
  }

  if (model) {
    if (props.limitControls) {
      panOffsetX += (targetPanX - panOffsetX) * 0.08
      panOffsetY += (targetPanY - panOffsetY) * 0.08
    }
    model.rotation.set(baseRotation.x, baseRotation.y + panOffsetY, baseRotation.z + panOffsetX)
  }

  renderer.render(scene, camera)
}

function onResize() {
  if (!container.value) return

  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()

  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

onMounted(initScene)

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', onResize)

  if (props.limitControls && container.value) {
    window.removeEventListener('mousemove', onMouseMove)
  }

  disposeVideoTexture()

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
