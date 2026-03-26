<template>
  <main class="mobile">
    <slot />
  </main>
</template>

<style>
h1 {
  font-size: 120px;
  font-weight: 700;
  color: #fff;
}
._half h1 {
  font-size: 100px;
  color: #fff;
}
h2 {
  font-size: 60px;
  font-weight: 700;
  color: #fff;
}
._half h2 {
  font-size: 50px;
  color: #fff;
}
h2 span {
  font-size: 16px;
  font-weight: 500;
  color: #888;
  margin-left: var(--base2);
}
h3 {
  font-size: 20px;
  font-weight: 600;
  color: #ddd;
}
p {
  font-size: 16px;
  color: #aaa;
}
</style>
