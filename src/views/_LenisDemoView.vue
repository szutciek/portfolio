<template>
  <LenisScroll v-slot="{ global, sections }" sections>
    <section vertical>
      <div class="mW1200 split">
        <div class="text" style="height: 100vh">
          <h1>Welcome to the Home View</h1>
        </div>
        <ParallaxPicture :progress="sections[0]?.visibleProgress">
          <img
            src="https://gaming.kanapka.eu/profiles/2F-agressive-turtle.png"
            alt=""
            velocity="0.5"
          />
        </ParallaxPicture>
      </div>
    </section>

    <section vertical>
      <div class="split" style="height: 20vh">
        <div class="split" style="height: 20vh">
          <ParallaxPicture :progress="sections[1]?.visibleProgress">
            <img
              src="https://gaming.kanapka.eu/profiles/2F-agressive-turtle.png"
              alt=""
              offset="-100"
              velocity="2"
            />
          </ParallaxPicture>
          <ParallaxPicture :progress="sections[1]?.visibleProgress">
            <img
              src="https://gaming.kanapka.eu/profiles/2F-agressive-turtle.png"
              alt=""
              velocity="1"
            />
          </ParallaxPicture>
        </div>
        <div class="split" style="height: 20vh">
          <ParallaxPicture :progress="sections[1]?.visibleProgress">
            <img
              src="https://gaming.kanapka.eu/profiles/2F-agressive-turtle.png"
              alt=""
              offset="-100"
              velocity="2"
            />
          </ParallaxPicture>
          <ParallaxPicture :progress="sections[1]?.visibleProgress">
            <img
              src="https://gaming.kanapka.eu/profiles/2F-agressive-turtle.png"
              alt=""
              velocity="1"
            />
          </ParallaxPicture>
        </div>
      </div>
    </section>

    <section vertical>
      <div class="split">
        <section marker>
          <VideoScrollSync :progress="sections[2]?.visibleProgress">
            <video src="/videos/Skydive.webm" muted playsinline></video>
          </VideoScrollSync>
        </section>
        <ParallaxPicture :progress="sections[2]?.visibleProgress">
          <img src="/images/car.png" alt="" velocity="1" />
        </ParallaxPicture>
      </div>
    </section>

    <section horizontal>
      <section marker>
        <div class="text" style="height: 100vh; width: 100vw">
          <h1>Section 1, scroll {{ sections[3]?.markers[0]?.visibleProgress }}</h1>
        </div>
      </section>
      <section marker>
        <div class="text" style="height: 100vh; width: 100vw">
          <h1>Section 2, scroll {{ sections[3]?.markers[1]?.visibleProgress }}</h1>
        </div>
      </section>
    </section>

    <section vertical>
      <section marker>
        <div class="text" v-for="i in 3" :key="i" style="height: 100vh">
          <h1>Section {{ i }}, scroll {{ sections[4]?.markers[0]?.visibleProgress }}</h1>
        </div>
      </section>
      <section marker>
        <div class="text" v-for="i in 3" :key="i" style="height: 100vh">
          <h1>Section {{ i }}, scroll {{ sections[4]?.markers[1]?.visibleProgress }}</h1>
        </div>
      </section>
    </section>
  </LenisScroll>
</template>

<style scoped>
div.text {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script setup>
import LenisScroll from '@/components/scroll/LenisScroll.vue'
import ParallaxPicture from '@/components/scroll/ParallaxPicture.vue'
import VideoScrollSync from '@/components/scroll/VideoScrollSync.vue'
</script>
