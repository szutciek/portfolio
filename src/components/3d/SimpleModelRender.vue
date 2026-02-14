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

let mouseX = 0
let targetRotationY = 0
let baseRotation = new THREE.Euler()
let panOffsetY = 0

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
  mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
  targetRotationY = mouseX * 0.05
}

function applyScreenTexture() {
  if (!model || !props.screenMeshName || !props.screenTextureUrl) return

  const screenMesh = model.getObjectByName(props.screenMeshName)
  if (!screenMesh) return

  textureLoader.load(props.screenTextureUrl, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

    texture.center.set(0.5, 0.5) // rotate around center
    texture.rotation = -Math.PI / 2 // rotate -90°
    texture.flipY = false // important for glTF

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: texture,
      emissiveIntensity: 1,
    })

    screenMesh.material = material
  })
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

  if (model) {
    if (props.limitControls) {
      panOffsetY += (targetRotationY - panOffsetY) * 0.05
    }

    model.rotation.set(baseRotation.x, baseRotation.y + panOffsetY, baseRotation.z)
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
