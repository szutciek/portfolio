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
        <div class="content">
          <h1 style="color: var(--main-color-l); text-align: center">PROJECTS</h1>
        </div>
      </div>
    </section>
    <section vertical>
      <ProjectDemonstration>
        <template #head>
          <h2>Webcam Game</h2>
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
              <FullScreenableMedia text="A game of football">
                <img src="/images/wcgame/soccer.avif" alt="Webcam Game Soccer Game Mode" />
              </FullScreenableMedia>
              <p>A game of football</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[1]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/wcgame/amongus.avif" alt="Webcam Game Among Us Game Mode" />
              <p>A game of Among Us</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[1]?.markers[2]?.visibleProgress" velocity="1">
              <img src="/images/wcgame/sso.avif" alt="Webcam Game Integration with Kanapka SSO" />
              <p>Kanapka SSO Integration</p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
    <section vertical>
      <ProjectDemonstration>
        <template #head>
          <h2>Kanapka SSO</h2>
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
              <img src="/images/sso/trust.avif" alt="Kanapka SSO Trust App Prompt" />
              <p>First use of app</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[2]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/sso/2FA.avif" alt="Kanapka SSO 2FA & Email Provider Detection" />
              <p>2FA via email w/ inbox detection</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[2]?.markers[2]?.visibleProgress" velocity="1">
              <img src="/images/sso/email.avif" alt="Kanapka SSO 2FA Email" />
              <p>Custom email service</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[2]?.markers[3]?.visibleProgress" velocity="2">
              <FullScreenableMedia text="Add and switch between multiple accounts">
                <img src="/images/sso/accounts.avif" alt="Kanapka SSO Multiple Account Support" />
              </FullScreenableMedia>
              <p>Add and switch between multiple accounts</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[2]?.markers[4]?.visibleProgress" velocity="1">
              <img src="/images/sso/manage.avif" alt="Kanapka SSO Account Management Panel" />
              <p>Manage account details</p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
    <section vertical>
      <ProjectDemonstration>
        <template #head>
          <h2>MyAura Online Store</h2>
          <p>E-COMMERCE WEBSITE WITH PAYMENT INTEGRATION AND INVENTORY SYSTEM</p>
        </template>
        <template #buttons>
          <OpaqueButton @click="openUrl(`https://myaura.kanapka.eu`)">
            <AdjacentIcon>
              <p>Browse demo version</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </OpaqueButton>
          <TransparentButton @click="openUrl(`https://github.com/szutciek/myaura`)">
            <AdjacentIcon>
              <p>See source code</p>
              <p>&nearr;</p>
            </AdjacentIcon>
          </TransparentButton>
        </template>
        <template #client>
          <AdjacentIcon>
            <img src="/images/logo/myaura.avif" alt="MyAura Logo" />
            <p>MyAura</p>
          </AdjacentIcon>
        </template>
        <template #screenshots>
          <section marker>
            <ParallaxContent :progress="sections[3]?.markers[0]?.visibleProgress" velocity="1">
              <img src="/images/myaura/home.avif" alt="MyAura Home Page Slideshow" />
              <p>Aesthetic home page with adjustable slideshow</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[3]?.markers[1]?.visibleProgress" velocity="2">
              <FullScreenableMedia
                text="Modern checkout form offering clients flexibility & robust feedback"
              >
                <img src="/images/myaura/checkout.avif" alt="MyAura Checkout Form" />
              </FullScreenableMedia>
              <p>Modern checkout form offering clients flexibility<br />& robust feedback</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[3]?.markers[2]?.visibleProgress" velocity="1">
              <img src="/images/myaura/inpost.avif" alt="MyAura InPost Parcel Locker Selector" />
              <p>Built in InPost parcel locker selector for convenience</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[3]?.markers[3]?.visibleProgress" velocity="2">
              <img src="/images/myaura/payment.avif" alt="MyAura Secure Payments Integration" />
              <p>Secure payment provider integration</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[3]?.markers[4]?.visibleProgress" velocity="1">
              <FullScreenableMedia
                text="Order confirmation & update notifications via elegant HTML emails"
              >
                <img src="/images/myaura/email.avif" alt="MyAura HTML Notification Emails" />
              </FullScreenableMedia>
              <p>Order confirmation & update notifications<br />via elegant HTML emails</p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
    <section vertical>
      <ProjectDemonstration>
        <template #head>
          <h2>Cafeteria Kiosk</h2>
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
        <template #client>
          <AdjacentIcon>
            <img src="/images/logo/solivoda.avif" alt="Solivoda Logo" />
            <p>Solivoda Catering</p>
          </AdjacentIcon>
        </template>
        <template #screenshots>
          <section marker>
            <ParallaxContent :progress="sections[4]?.markers[0]?.visibleProgress" velocity="1">
              <FullScreenableMedia text="Clean interface optimized for interaction via touchscreen">
                <img src="/images/checkout/touchscreen.avif" alt="Checkout Station UI" />
              </FullScreenableMedia>
              <p>Clean interface optimized<br />for interaction via touchscreen</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[4]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/checkout/login.avif" alt="Checkout Station QR Code Login" />
              <p>Intuitive & fast checkout: scan QR code on phone when logged in</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[4]?.markers[2]?.visibleProgress" velocity="0.5">
              <FullScreenableMedia text="Satisfying animations">
                <VideoScrollSync :progress="sections[4]?.markers[2]?.visibleProgress">
                  <video
                    src="/videos/checkout/animations-compressed.webm"
                    alt="Checkout Station Smooth Animations Demo"
                    muted
                    playsinline
                  ></video>
                </VideoScrollSync>
              </FullScreenableMedia>
              <p>Satisfying animations</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[4]?.markers[3]?.visibleProgress" velocity="0.5">
              <VideoScrollSync :progress="sections[4]?.markers[3]?.visibleProgress">
                <video
                  src="/videos/checkout/panel-compressed.webm"
                  alt="Checkout Station Responsive Panel Demo"
                  muted
                  playsinline
                ></video>
              </VideoScrollSync>
              <p>Panels adjustable by touch</p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
    <section vertical>
      <ProjectDemonstration>
        <template #head>
          <h2>Roomganizer</h2>
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
        <template #client>
          <AdjacentIcon>
            <img src="/images/logo/asw.avif" alt="ASW Logo" />
            <p>American School of Warsaw</p>
          </AdjacentIcon>
        </template>
        <template #screenshots>
          <section marker>
            <ParallaxContent :progress="sections[5]?.markers[0]?.visibleProgress" velocity="1">
              <img src="/images/roomganizer/map.avif" alt="Roomganizer 3D Map of Facility" />
              <p>3D map layout of facility displaying availability</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[5]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/roomganizer/scheduler.avif" alt="Roomganizer Event Scheduler" />
              <p>Customizable event scheduler</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[5]?.markers[2]?.visibleProgress" velocity="1">
              <img src="/images/roomganizer/timeline.avif" alt="Roomganizer Timeline Element" />
              <p>Clean timeline of upcoming events</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[5]?.markers[3]?.visibleProgress" velocity="0.5">
              <FullScreenableMedia text="Satisfying animations">
                <VideoScrollSync :progress="sections[5]?.markers[3]?.visibleProgress">
                  <video
                    src="/videos/roomganizer/window-compressed.webm"
                    alt="Roomganizer Responsive Window Demo"
                    muted
                    playsinline
                  ></video>
                </VideoScrollSync>
              </FullScreenableMedia>
              <p>Dynamically adjusting window</p>
            </ParallaxContent>
          </section>
        </template>
      </ProjectDemonstration>
    </section>
    <section vertical>
      <ProjectDemonstration>
        <template #head>
          <h2>Turtle Game</h2>
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
            <ParallaxContent :progress="sections[6]?.markers[0]?.visibleProgress" velocity="1">
              <img src="/images/zolwie/game.avif" alt="Turtle Game Gameplay" />
              <p>A game of chasing turtles</p>
            </ParallaxContent>
          </section>
          <section marker>
            <ParallaxContent :progress="sections[6]?.markers[1]?.visibleProgress" velocity="2">
              <img src="/images/zolwie/menu.avif" alt="Turtle Game Lobby Creation Menu" />
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

const openUrl = (url) => {
  window.open(url)
}
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
