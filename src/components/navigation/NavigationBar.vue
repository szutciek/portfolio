<template>
  <nav>
    <p>KS</p>
    <div>
      <ul>
        <li
          class="scrollToProjectsBtn"
          data-cursor-morph
          data-cursor-shape="pill"
          data-cursor-padding="14"
          data-cursor-bg="rgba(255, 255, 255, 0.12)"
        >
          Projects
        </li>
        <li
          class="scrollToProjectsBtn"
          data-cursor-morph
          data-cursor-shape="pill"
          data-cursor-padding="14"
          data-cursor-bg="rgba(255, 255, 255, 0.12)"
        >
          About
        </li>
      </ul>
      <button
        @click="$emit('open')"
        data-cursor-morph
        data-cursor-shape="rect"
        data-cursor-padding="10"
        data-cursor-bg="rgba(236, 120, 55, 0.22)"
      >
        <svg
          width="20"
          height="13"
          viewBox="0 0 20 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="20" height="1" fill="#D9D9D9" />
          <rect x="10" y="12" width="10" height="1" fill="#D9D9D9" />
          <rect y="6" width="20" height="1" fill="#D9D9D9" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  z-index: 100;
  width: calc(100vw - 160px);
  top: 0;
  left: 80px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

nav p {
  height: 60px;
  aspect-ratio: 1;
  text-align: center;
  padding: 3px 0;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  background-color: var(--main-color-l);
  pointer-events: none;
}

nav div {
  display: flex;
  gap: 30px;
}

nav ul {
  display: flex;
  align-items: center;
  gap: 30px;
}

nav li {
  list-style: none;
  cursor: pointer;
  position: relative;
  color: #e3e3e3;
  font-size: 18px;
  font-weight: 300;
  text-decoration: none;
}

nav li::after {
  content: '';
  position: absolute;
  bottom: -3px;
  height: 3px;
  background-color: var(--main-color-l);
}

nav li:hover {
  color: #ffffff;
}

nav li:hover::after {
  animation-name: liUnderline;
  animation-duration: 1s;
}

nav button {
  height: 40px;
  aspect-ratio: 1;
  border: none;
  cursor: pointer;
  background-color: var(--main-color-l);
  margin-right: 10px;
}

@keyframes liUnderline {
  0% {
    left: 0;
    width: 0%;
  }
  40% {
    left: 0;
    width: 100%;
  }
  60% {
    left: 0;
    width: 100%;
  }
  100% {
    left: 100%;
    width: 0;
  }
}
</style>
