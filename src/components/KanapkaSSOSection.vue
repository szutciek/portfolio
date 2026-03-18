<template>
  <div class="project">
    <div class="text">
      <h1>Kanapka SSO</h1>
      <p>FLEXIBLE OAUTH2 SINGLE SIGN ON</p>
      <div class="actions">
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
      </div>
    </div>
    <div class="screenShots">
      <div></div>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[0]?.visibleProgress" velocity="1">
          <img src="/images/sso/trust.png" alt="" />
          <p>First use of app</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[1]?.visibleProgress" velocity="2">
          <img src="/images/sso/2FA.png" alt="" />
          <p>2FA via email w/ inbox detection</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[2]?.visibleProgress" velocity="1">
          <img src="/images/sso/email.png" alt="" />
          <p>Custom email service</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[3]?.visibleProgress" velocity="2">
          <img src="/images/sso/accounts.png" alt="" />
          <p>Add and switch between multiple accounts</p>
        </ParallaxContent>
      </section>
      <section marker>
        <ParallaxContent :progress="scroll?.markers[4]?.visibleProgress" velocity="1">
          <img src="/images/sso/manage.png" alt="" />
          <p>Manage account details</p>
        </ParallaxContent>
      </section>
      <div></div>
    </div>
  </div>
</template>
<script setup>
import OpaqueButton from './OpaqueButton.vue'
import TransparentButton from './TransparentButton.vue'
const props = defineProps({
  scroll: Object,
})
const openUrl = (url) => {
  window.open(url)
}
</script>
<style scoped>
.project {
  min-height: 100vh;
  padding: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.text {
  position: sticky;
  top: 80px;
  align-self: start;
}
.actions {
  margin-top: 40px;
  display: flex;
  gap: 20px;
}
.actions p {
  color: #fff;
}
.screenShots {
  display: grid;
  grid-template-rows: 40vh;
}
.screenShots img {
  max-height: calc(40vh - 2rem);
}
</style>
