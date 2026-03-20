<template>
  <div class="_projectDemonstration">
    <div class="text">
      <slot name="head" />
      <div class="actions">
        <slot name="buttons" />
      </div>
    </div>
    <div class="screenShots">
      <slot name="screenshots" />
    </div>
  </div>
</template>

<style>
._projectDemonstration {
  min-height: 100vh;
  padding: var(--base8);
  padding-bottom: 40vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
._projectDemonstration .text {
  position: sticky;
  top: var(--base8);
  align-self: start;
}
._projectDemonstration .actions {
  margin-top: var(--base3);
  display: flex;
  gap: var(--base2);
}
._projectDemonstration .actions p {
  color: #fff;
}
._projectDemonstration .screenShots {
  display: grid;
  grid-template-rows: 40vh;
}
._projectDemonstration .screenShots img,
._projectDemonstration .screenShots video {
  max-height: calc(40vh - 2rem);
}
</style>
