<template>
  <nav class="mobileNav">
    <Link href="/" class="logo" aria-label="Home">
      <p>KS</p>
    </Link>
    <button
      class="toggle"
      @click="isOpen = !isOpen"
      :aria-label="isOpen ? 'Close social links' : 'Open social links'"
      :aria-expanded="isOpen"
    >
      <svg v-if="!isOpen" width="20" height="13" viewBox="0 0 20 13" fill="none">
        <rect width="20" height="1" fill="#D9D9D9" />
        <rect x="10" y="12" width="10" height="1" fill="#D9D9D9" />
        <rect y="6" width="20" height="1" fill="#D9D9D9" />
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 1L15 15M15 1L1 15" stroke="#D9D9D9" stroke-width="1.2" />
      </svg>
    </button>
  </nav>

  <Transition name="fade">
    <div v-if="isOpen" class="backdrop" @click="isOpen = false"></div>
  </Transition>

  <div :class="['drawer', { open: isOpen }]" :inert="!isOpen">
    <NavigationSocials />
  </div>
</template>

<script setup>
const isOpen = ref(false)
</script>

<style scoped>
.mobileNav {
  position: fixed;
  z-index: 101;
  top: 0;
  left: 0;
  right: 0;
  padding: var(--base2);
  padding-top: calc(var(--base2) + env(safe-area-inset-top));
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}
.mobileNav > * {
  pointer-events: auto;
}

.logo p {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  background-color: var(--main-color-l);
}

.toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  background-color: var(--main-color-l);
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgb(0 0 0 / 0.5);
}

.drawer {
  position: fixed;
  z-index: 102;
  top: 0;
  left: 0;
  width: 80px;
  height: 100dvh;
  transform: translateX(-100%);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer.open {
  transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
