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

  // Name of the mesh that should receive the dynamic texture
  screenMeshName: {
    type: String,
    default: null,
  },

  // Image or website render (must be an image)
  screenTextureUrl: {
    type: String,
    default: null,
  },

  backgroundColor: {
    type: String,
    default: '#111111',
  },
  cameraPosition: {
    type: Array,
    default: () => [0, 1, 3],
  },
  lightIntensity: {
    type: Number,
    default: 1,
  },

  // New cinematic interaction mode
  limitControls: {
    type: Boolean,
    default: false,
  },
})

const container = ref(null)
let renderer, scene, camera, controls, frameId, model
let textureLoader = new THREE.TextureLoader()

// Mouse tracking for subtle pan
let mouseX = 0
let mouseY = 0
let targetRotationY = 0
let currentRotationY = 0

function initScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(props.backgroundColor)

  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(...props.cameraPosition)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  container.value.appendChild(renderer.domElement)

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, props.lightIntensity * 0.6)
  scene.add(ambient)

  const directional = new THREE.DirectionalLight(0xffffff, props.lightIntensity)
  directional.position.set(5, 10, 7)
  scene.add(directional)

  // Orbit controls only when NOT in cinematic mode
  if (!props.limitControls) {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
  } else {
    container.value.addEventListener('mousemove', onMouseMove)
  }

  loadModel()
  animate()
  window.addEventListener('resize', onResize)
}

function onMouseMove(event) {
  const rect = container.value.getBoundingClientRect()

  // normalize between -1 and 1
  mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1

  // limit rotation to ~10 degrees
  targetRotationY = mouseX * 0.17
}

function applyScreenTexture() {
  if (!model || !props.screenMeshName || !props.screenTextureUrl) return

  const screenMesh = model.getObjectByName(props.screenMeshName)
  if (!screenMesh) return

  textureLoader.load(props.screenTextureUrl, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

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

    // Auto center + fit camera
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
  })
}

function animate() {
  frameId = requestAnimationFrame(animate)

  if (controls) controls.update()

  // cinematic mouse pan
  if (props.limitControls && model) {
    currentRotationY += (targetRotationY - currentRotationY) * 0.05
    model.rotation.y = currentRotationY
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
    container.value.removeEventListener('mousemove', onMouseMove)
  }

  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
  }

  if (controls) controls.dispose()
})

// Reload model if URL changes
watch(() => props.modelUrl, loadModel)

// Update screen texture dynamically
watch(() => props.screenTextureUrl, applyScreenTexture)
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
