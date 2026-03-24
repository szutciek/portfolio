<template>
  <LenisScroll v-slot="{ global, sections }" sections>
    <div class="container">
      <h2>Mobile Version Still Cooking</h2>
      <p>Visit this page on a bigger screen</p>
      <!-- ADD OPTION TO EMAIL PAGE LINK -->
    </div>
  </LenisScroll>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
}
</style>

<style>
h1 {
  font-size: 100px;
  color: #fff;
}
h2 {
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
