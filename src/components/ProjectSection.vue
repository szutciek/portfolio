<template>
  <div class="projects">
    <section vertical>
      <div class="transition">
        <div class="background">
          <ScrollText
            :texts="[`PROJECTS`]"
            :color="`var(--bg-color-l)`"
            :gap="8"
            :progress="sections[0]?.visibleProgress"
            :scrollRange="10"
          />
        </div>
        <div class="content"></div>
      </div>
    </section>
    <section vertical>
      <!-- <WebcamGameSection :scroll="sections[1]" /> -->
      <ProjectDemonstration>
        <template #head>
          <h1>Webcam Game</h1>
          <p>SEEING YOUR ENEMY, REDEFINED</p>
        </template>
        <template #buttons>
          <OpaqueButton @click="openUrl(`https://webcamgame.kanapka.eu`)">
            <AdjacentIcon>
              <p>Try it out</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </OpaqueButton>
          <TransparentButton @click="openUrl(`https://github.com/szutciek/webcam-game`)">
            <AdjacentIcon>
              <p>See source code</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </TransparentButton>
        </template>
        <template #screenshots>
          <section marker>
            <ParallaxContent :progress="sections[1]?.markers[0]?.visibleProgress" velocity="1">
              <img src="/images/wcgame/soccer.png" alt="" />
              <p>A game of football</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[1]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/wcgame/amongus.png" alt="" />
              <p>A game of suspicious</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[1]?.markers[2]?.visibleProgress" velocity="1">
              <img src="/images/wcgame/sso.png" alt="" />
              <p>Kanapka SSO Integration</p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
    <section vertical>
      <!-- <KanapkaSSOSection :scroll="sections[2]" /> -->
      <ProjectDemonstration>
        <template #head>
          <h1>Kanapka SSO</h1>
          <p>FLEXIBLE OAUTH2 SINGLE SIGN ON</p>
        </template>
        <template #buttons>
          <OpaqueButton @click="openUrl(`https://sso.kanapka.eu/en/register`)">
            <AdjacentIcon>
              <p>Create account</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </OpaqueButton>
          <TransparentButton @click="openUrl(`https://github.com/szutciek/sso`)">
            <AdjacentIcon>
              <p>See source code</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </TransparentButton>
        </template>
        <template #screenshots>
          <section marker>
            <ParallaxContent :progress="sections[2]?.markers[0]?.visibleProgress" velocity="1">
              <img src="/images/sso/trust.png" alt="" />
              <p>First use of app</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[2]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/sso/2FA.png" alt="" />
              <p>2FA via email w/ inbox detection</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[2]?.markers[2]?.visibleProgress" velocity="1">
              <img src="/images/sso/email.png" alt="" />
              <p>Custom email service</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[2]?.markers[3]?.visibleProgress" velocity="2">
              <img src="/images/sso/accounts.png" alt="" />
              <p>Add and switch between multiple accounts</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[2]?.markers[4]?.visibleProgress" velocity="1">
              <img src="/images/sso/manage.png" alt="" />
              <p>Manage account details</p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
    <section vertical>
      <!-- <CheckoutSection :scroll="sections[3]" /> -->
      <ProjectDemonstration>
        <template #head>
          <h1>Cafeteria Kiosk</h1>
          <p>MCDONALDS STYLE DISPLAY FOR TAKING ORDERS AT A SCHOOL</p>
        </template>
        <template #buttons>
          <OpaqueButton @click="openUrl(`https://checkout.kanapka.eu/station-client`)">
            <AdjacentIcon>
              <p>Try it out</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </OpaqueButton>
        </template>
        <template #screenshots>
          <section marker>
            <ParallaxContent :progress="sections[3]?.markers[0]?.visibleProgress" velocity="1">
              <img src="/images/checkout/login.png" alt="" />
              <p>Intuitive & fast checkout: scan QR code on phone when logged in</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[3]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/checkout/touchscreen.png" alt="" />
              <p>Clean interface optimized<br />for interaction via touchscreen</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[3]?.markers[2]?.visibleProgress" velocity="0.5">
              <VideoScrollSync :progress="sections[3]?.markers[2]?.visibleProgress">
                <video src="/videos/checkout/animations.mp4" muted playsinline></video>
              </VideoScrollSync>
              <p>Satisfying animations</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[3]?.markers[3]?.visibleProgress" velocity="0.5">
              <VideoScrollSync :progress="sections[3]?.markers[3]?.visibleProgress">
                <video src="/videos/checkout/panel.mp4" muted playsinline></video>
              </VideoScrollSync>
              <p>Panels adjustable by touch</p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
    <section vertical>
      <!-- <RoomganizerSection :scroll="sections[4]" /> -->
      <ProjectDemonstration>
        <template #head>
          <h1>Roomganizer</h1>
          <p>REVOLUTIONARY FACILITY MANAGEMENT SYSTEM</p>
        </template>
        <template #buttons>
          <OpaqueButton @click="openUrl(`https://roomganizer.kanapka.eu/`)">
            <AdjacentIcon>
              <p>Try it out</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </OpaqueButton>
          <TransparentButton @click="openUrl(`https://github.com/szutciek/roomganizer`)">
            <AdjacentIcon>
              <p>See source code</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </TransparentButton>
        </template>
        <template #screenshots>
          <section marker>
            <ParallaxContent :progress="sections[4]?.markers[0]?.visibleProgress" velocity="1">
              <img src="/images/roomganizer/map.png" alt="" />
              <p>3D map layout of facility displaying availability</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[4]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/roomganizer/scheduler.png" alt="" />
              <p>Customizable event scheduler</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[4]?.markers[2]?.visibleProgress" velocity="1">
              <img src="/images/roomganizer/timeline.png" alt="" />
              <p>Clean timeline of upcoming events</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[4]?.markers[3]?.visibleProgress" velocity="0.5">
              <VideoScrollSync :progress="sections[4]?.markers[3]?.visibleProgress">
                <video src="/videos/roomganizer/window.mp4" muted playsinline></video>
              </VideoScrollSync>
              <p>Dynamically adjusting window</p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
    <section vertical>
      <!-- <ZolwieSection :scroll="sections[5]" /> -->
      <ProjectDemonstration>
        <template #head>
          <h1>Turtle Game</h1>
          <p>ONLINE MULTIPLAYER VERSION OF POPULAR BOARD GAME</p>
        </template>
        <template #buttons>
          <OpaqueButton @click="openUrl(`https://zolwie.kanapka.eu/start`)">
            <AdjacentIcon>
              <p>Host a game</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </OpaqueButton>
          <TransparentButton @click="openUrl(`https://github.com/szutciek/zolwie`)">
            <AdjacentIcon>
              <p>See source code</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </TransparentButton>
        </template>
        <template #screenshots>
          <section marker>
            <ParallaxContent :progress="sections[5]?.markers[0]?.visibleProgress" velocity="1">
              <img src="/images/zolwie/game.png" alt="" />
              <p>A game of chasing turtles</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[5]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/zolwie/menu.png" alt="" />
              <p>
                Customize turtles,<br />
                level and cards
              </p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
  </div>
</template>

<script setup>
import ScrollText from '@/components/effects/ScrollText.vue'

const props = defineProps({
  sections: Array,
})
</script>

<style scoped>
.transition {
  position: relative;
  height: 50vh;
  width: var(--full-width);
  padding: var(--base4);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.transition .background {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.transition .content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
