<!--
  CursorMorphDemo.vue — drop this alongside CursorMorph.vue to see it in action.
  Hides the real cursor globally; CursorMorph replaces it.
-->
<template>
  <div class="demo" style="cursor: none">
    <CursorMorph
      :size="14"
      color="rgba(120,80,255,0.18)"
      stroke-color="rgba(120,80,255,0.75)"
      :stroke-width="1.5"
      :stiffness="0.13"
      :attract-radius="90"
      :snap-radius="0"
    />

    <header class="demo-header">
      <span class="demo-label">CursorMorph</span>
      <span class="demo-sub">Hover the elements below</span>
    </header>

    <section class="demo-grid">
      <!-- Pill button — offset +8 (glows around it) -->
      <button class="btn-pill" data-cursor-target data-cursor-offset="8">Subscribe</button>

      <!-- Rounded rect button — offset +6 -->
      <button class="btn-rounded" data-cursor-target data-cursor-offset="6">Get started</button>

      <!-- Sharp rect — offset +4 -->
      <button class="btn-sharp" data-cursor-target data-cursor-offset="4">Learn more</button>

      <!-- Card with uneven corners — offset -6 (shrinks inside) -->
      <div class="card" data-cursor-target data-cursor-offset="-6">
        <p class="card-title">Asymmetric card</p>
        <p class="card-body">Cursor fills inward. Offset: −6 px.</p>
      </div>

      <!-- Wide banner — offset +10 -->
      <div class="banner" data-cursor-target data-cursor-offset="10">Wide banner · offset +10</div>

      <!-- Tiny icon button — offset +12 -->
      <button class="btn-icon" data-cursor-target data-cursor-offset="12" title="Star">★</button>

      <!-- Circle avatar — offset +5 -->
      <div class="avatar" data-cursor-target data-cursor-offset="5">AJ</div>
    </section>

    <footer class="demo-footer">
      Cursor morphs using per-corner <code>border-radius</code> read live from the DOM.
    </footer>
  </div>
</template>

<script setup>
import CursorMorph from './Cursor.vue'
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.demo {
  min-height: 100vh;
  background: #0d0d12;
  color: #e8e8f0;
  font-family: 'DM Sans', system-ui, sans-serif;
  padding: 3rem 2rem;
}

.demo-header {
  margin-bottom: 3rem;
}
.demo-label {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #c5b8ff;
  display: block;
}
.demo-sub {
  font-size: 0.9rem;
  color: #666;
}

.demo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}

/* Pill */
.btn-pill {
  background: transparent;
  border: 1.5px solid #5a3fff;
  color: #c5b8ff;
  padding: 0.65rem 2rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  cursor: none;
  letter-spacing: 0.01em;
}
.btn-pill:hover {
  background: rgba(90, 63, 255, 0.12);
}

/* Rounded rect */
.btn-rounded {
  background: #5a3fff;
  border: none;
  color: #fff;
  padding: 0.65rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: none;
}
.btn-rounded:hover {
  background: #6e52ff;
}

/* Sharp */
.btn-sharp {
  background: transparent;
  border: 1.5px solid #444;
  color: #aaa;
  padding: 0.65rem 1.5rem;
  border-radius: 2px;
  font-size: 0.95rem;
  cursor: none;
}
.btn-sharp:hover {
  border-color: #888;
  color: #eee;
}

/* Card with asymmetric corners */
.card {
  background: #16161f;
  border: 1px solid #2a2a3a;
  border-radius: 4px 20px 4px 20px;
  padding: 1.25rem 1.5rem;
  width: 220px;
  cursor: none;
}
.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.35rem;
  color: #e0d8ff;
}
.card-body {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

/* Banner */
.banner {
  background: #111118;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  padding: 1rem 2.5rem;
  font-size: 0.9rem;
  color: #888;
  width: 100%;
  text-align: center;
  cursor: none;
}

/* Icon button */
.btn-icon {
  background: #1a1a24;
  border: 1px solid #333;
  color: #c5b8ff;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
}

/* Avatar */
.avatar {
  width: 52px;
  height: 52px;
  border-radius: 9999px;
  background: #2a1e6e;
  color: #c5b8ff;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
}

.demo-footer {
  margin-top: 4rem;
  font-size: 0.8rem;
  color: #444;
}
.demo-footer code {
  color: #7a6fff;
  background: #1a1827;
  padding: 0.1em 0.4em;
  border-radius: 4px;
}
</style>
