<template>
  <div
    :href="props.href"
    :target="props.blank ? '_blank' : '_self'"
    :rel="props.blank ? 'noopener noreferrer' : undefined"
    class="app-link"
    @click.prevent="navigate"
    ref="el"
  >
    <slot></slot>
    <Teleport to="body">
      <Transition name="preview">
        <span v-if="showPreview && previewUrl" class="url-preview" role="tooltip">
          <span class="url-preview__icon">
            <svg v-if="props.blank" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M1 1h4V0H0v5h1V1zm2 2v7h7V3H3zm6 6H4V4h5v5z" />
            </svg>
            <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M6.5 1L5.8 1.7 8.1 4H0v1h8.1L5.8 7.3l.7.7L10 5z" />
            </svg>
          </span>
          {{ previewUrl }}
        </span>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCursorSnap } from '@/composables/useCursorSnap'

const props = defineProps({
  href: { type: String, required: true },
  blank: { type: Boolean, default: false },
})

const router = useRouter()
const { isSnapped, snappedEl } = useCursorSnap()

const el = ref(null)

/** Show preview when the cursor is snapped to this specific link element */
const showPreview = computed(() => {
  if (!snappedEl.value) return false
  if (snappedEl.value === el.value) return true
  let node = snappedEl.value
  while (node) {
    if (node === el.value) return true
    node = node.parentElement
  }
  return false
})

/** Normalised URL shown in the preview bar */
const previewUrl = computed(() => {
  if (!props.href) return ''
  try {
    if (/^https?:\/\//i.test(props.href)) return props.href
    if (props.href.startsWith('#'))
      return window.location.origin + window.location.pathname + props.href
    return window.location.origin + (props.href.startsWith('/') ? '' : '/') + props.href
  } catch {
    return props.href
  }
})

/** Scroll to an in-page anchor, retrying after a route change */
const scrollToAnchor = (targetId) => {
  const el = document.getElementById(targetId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return true
  }
  return false
}

const navigate = () => {
  if (!props.href) return

  if (props.blank || /^(https?:|mailto:|tel:)/.test(props.href)) {
    window.open(props.href, props.blank ? '_blank' : '_self', 'noopener,noreferrer')
    return
  }

  const [path, hash] = props.href.split('#')
  const anchor = hash?.split('?')[0]

  if (!path || path === window.location.pathname) {
    if (anchor && !scrollToAnchor(anchor)) {
      router.push({ path: path || window.location.pathname, hash: `#${anchor}` }).then(() => {
        let attempts = 0
        const interval = setInterval(() => {
          if (scrollToAnchor(anchor) || ++attempts >= 10) clearInterval(interval)
        }, 100)
      })
    }
    return
  }

  router.push({ path, hash: anchor ? `#${anchor}` : undefined }).then(() => {
    if (!anchor) return
    let attempts = 0
    const interval = setInterval(() => {
      if (scrollToAnchor(anchor) || ++attempts >= 10) clearInterval(interval)
    }, 100)
  })
}
</script>

<style scoped>
.app-link {
  display: inline;
}

/* ── URL preview tooltip ───────────────────────────────────────────── */
.url-preview {
  position: fixed;
  bottom: var(--base2);
  left: calc(var(--base2) + var(--nav-width));
  z-index: 999999;

  display: inline-flex;
  align-items: center;
  gap: calc(var(--base) / 2);
  max-width: var(--half-width);

  padding: calc(var(--base) / 2) var(--base);
  border-radius: calc(var(--base) / 2);
  background: var(--bg-color-l);
  color: #aaa;
  font-family: ui-monospace, 'SF Mono', Consolas, monospace;
  font-size: var(--base);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  box-shadow: 0 2px 8px #000000;
}

.url-preview__icon {
  flex-shrink: 0;
  opacity: 0.55;
  display: flex;
  align-items: center;
}

/* ── Transition ────────────────────────────────────────────────────── */
.preview-enter-active,
.preview-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.preview-enter-from,
.preview-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
