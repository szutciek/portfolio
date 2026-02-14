<template>
  <div class="navContact contAreaGrid">
    <p>Contact me 🤙</p>
    <label for="subject">Subject</label>
    <input type="text" name="subject" ref="sub" placeholder="Portfolio Contact" />
    <label for="body">Message</label>
    <textarea type="text" name="body" ref="mes"></textarea>
    <!-- prettier-ignore -->
    <button @click="sendMessage">Send<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M476.59,227.05l-.16-.07L49.35,49.84A23.56,23.56,0,0,0,27.14,52,24.65,24.65,0,0,0,16,72.59V185.88a24,24,0,0,0,19.52,23.57l232.93,43.07a4,4,0,0,1,0,7.86L35.53,303.45A24,24,0,0,0,16,327V440.31A23.57,23.57,0,0,0,26.59,460a23.94,23.94,0,0,0,13.22,4,24.55,24.55,0,0,0,9.52-1.93L476.4,285.94l.19-.09a32,32,0,0,0,0-58.8Z"/></svg></button>
    <div class="seperator">
      <h6>or</h6>
    </div>
    <div class="altContact">
      <!-- prettier-ignore -->
      <div class="option" id="navContactMail"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M424,80H88a56.06,56.06,0,0,0-56,56V376a56.06,56.06,0,0,0,56,56H424a56.06,56.06,0,0,0,56-56V136A56.06,56.06,0,0,0,424,80Zm-14.18,92.63-144,112a16,16,0,0,1-19.64,0l-144-112a16,16,0,1,1,19.64-25.26L256,251.73,390.18,147.37a16,16,0,0,1,19.64,25.26Z"/></svg></div>
      <!-- prettier-ignore -->
      <div class="option" id="navContactSkype"><svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M467.16,303.6a205.69,205.69,0,0,0,4.9-45.15c0-116.32-95.69-210.7-213.79-210.7a221.83,221.83,0,0,0-36.52,3A123.58,123.58,0,0,0,155.93,32C87.55,32,32,86.72,32,154.15A119.56,119.56,0,0,0,49,216a211.16,211.16,0,0,0-4.32,42.35c0,116.44,95.69,210.7,213.67,210.7a214,214,0,0,0,39.09-3.5A125.45,125.45,0,0,0,356.07,480C424.57,480,480,425.28,480,357.85A118,118,0,0,0,467.16,303.6ZM368,359c-9.92,13.76-24.51,24.73-43.41,32.43S283.36,403,257.69,403c-30.69,0-56.36-5.37-76.55-15.87a101,101,0,0,1-35.24-30.8c-9.11-12.83-13.66-25.66-13.66-38,0-7.7,3-14.35,8.87-19.95,5.84-5.37,13.42-8.17,22.29-8.17,7.35,0,13.65,2.1,18.79,6.42,4.9,4.08,9.1,10.15,12.48,18.08A108.09,108.09,0,0,0,207,336.15q6.32,8.22,17.86,13.65c7.82,3.62,18.2,5.48,31,5.48,17.62,0,32.09-3.73,42.94-11.08,10.74-7.12,15.88-15.75,15.88-26.25,0-8.28-2.69-14.82-8.29-19.95-5.83-5.37-13.42-9.57-22.87-12.37-9.69-3-22.87-6.18-39.21-9.56-22.17-4.67-41-10.27-56-16.57-15.28-6.42-27.65-15.4-36.76-26.48-9.22-11.32-13.77-25.55-13.77-42.24a67.86,67.86,0,0,1,14.47-42.58c9.57-12.25,23.46-21.82,41.55-28.35,17.74-6.53,38.86-9.8,62.66-9.8,19.14,0,35.83,2.22,49.83,6.42s25.91,10.15,35.36,17.38,16.34,14.93,20.77,23,6.66,16.22,6.66,24c0,7.46-2.92,14.35-8.76,20.3a29.65,29.65,0,0,1-21.94,9.1c-7.93,0-14.12-1.87-18.43-5.6-4-3.5-8.17-8.87-12.72-16.69-5.37-9.91-11.79-17.85-19.14-23.45-7.24-5.36-19.14-8.16-35.71-8.16-15.29,0-27.77,3-37,9-8.87,5.72-13.19,12.37-13.19,20.18a18.26,18.26,0,0,0,4.32,12.25,38.13,38.13,0,0,0,12.72,9.57,90.14,90.14,0,0,0,17.15,6.53c6,1.64,15.87,4.09,29.53,7.12,17.38,3.62,33.25,7.82,47.26,12.13,14.24,4.55,26.49,10,36.52,16.45a72.93,72.93,0,0,1,24.16,25.09c5.72,10,8.64,22.63,8.64,37.1A75.09,75.09,0,0,1,368,359Z"/></svg></div>
    </div>
  </div>
</template>

<script setup>
const sub = ref(null)
const mes = ref(null)

const sendMessage = () => {
  const sE = encodeURIComponent(sub.value.value ? sub.value.value : sub.value.placeholder)
  const mE = encodeURIComponent(mes.value.value)
  window.open(`mailto:bossman@kanapka.eu?subject=${sE}&body=${mE}`)
}
</script>

<style scoped>
.navContact p {
  background-color: var(--main-color-l);
  width: fit-content;
  padding: 2px 8px;
  margin-top: -2px;
}
.navContact label {
  display: block;
  margin: 20px 0 5px 0;
  font-size: 15px;
  font-weight: 400;
  color: #c7c7c7;
}
.navContact input,
.navContact textarea {
  font-size: 20px;
  font-weight: 400;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid transparent;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  max-height: 1000px;
  min-height: 50px;
  padding: 10px;
  outline: none;
  font-family: 'Poppins', sans-serif;
}
.navContact input::placeholder {
  font-weight: 300;
  font-size: 16px;
}
.navContact input:focus,
.navContact textarea:focus {
  border: 1px solid #ffffff8a;
}
.navContact button {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 25px;
  padding: 5px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--main-color-l);
  border: none;
  border-bottom: 2px solid var(--main-color-l);
  background-color: transparent;
  cursor: pointer;
  transition: gap 0.2s;
}
.navContact button svg {
  position: relative;
  fill: var(--main-color-l);
  height: 20px;
}
.navContact button svg:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  border-bottom: 1px dotted red;
  width: 10px;
}
.navContact button:hover {
  gap: 100px;
}

.navContact .seperator {
  margin: 40px 0;
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.navContact .seperator h6 {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 10px;
  background-color: var(--bg-color-l);
  font-size: 16px;
  font-weight: 300;
  color: #c7c7c7;
}
.navContact .altContact {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-bottom: 100px;
}
.navContact .altContact .option {
  padding: 10px;
  height: 40px;
  width: 40px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  cursor: pointer;
}
.navContact .altContact .option svg {
  max-width: 100%;
  max-height: 100%;
  fill: var(--main-color-l);
}
</style>
