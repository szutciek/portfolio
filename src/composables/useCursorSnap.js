/**
 * useCursorSnap.js
 *
 * Shared reactive state for CursorMorph snap events.
 * Import in any component to read whether the cursor is currently snapped,
 * and which element it is snapped to.
 *
 * USAGE
 * -----
 * import { useCursorSnap } from '@/composables/useCursorSnap'
 *
 * const { isSnapped, snappedEl, snappedMode } = useCursorSnap()
 *
 * // isSnapped    — Ref<Boolean>  true while cursor is locked onto a target
 * // snappedEl    — Ref<Element|null>  the DOM element currently snapped to
 * // snappedMode  — Ref<String|null>  the active render mode ('fill'|'wireframe'|'underline')
 *
 * The state is module-level (singleton), so all components share the same refs.
 * CursorMorph is the only writer; everyone else is a reader.
 */

import { ref } from 'vue'

export const isSnapped = ref(false)
export const snappedEl = ref(null)
export const snappedMode = ref(null)

export function useCursorSnap() {
  return { isSnapped, snappedEl, snappedMode }
}
