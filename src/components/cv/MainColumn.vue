<template>
  <main class="main">
    <!-- Header -->
    <header class="cv-header">
      <h1>MACIEJ SZUTER</h1>
    </header>

    <div class="divider-line" />

    <!-- Education -->
    <SectionBlock title="Education">
      <TimelineEntry v-for="edu in education" :key="edu.title" v-bind="edu" />
    </SectionBlock>

    <!-- Work Experience -->
    <SectionBlock title="Work Experience">
      <TimelineEntry v-for="job in jobs" :key="job.title" v-bind="job" />
    </SectionBlock>

    <!-- Achievements -->
    <SectionBlock title="Achievements">
      <p class="body-text">
        Competed at the national level in swimming in Poland — demonstrating dedication and
        discipline while balancing strong academic performance and a passion for web development.
      </p>
    </SectionBlock>
  </main>
</template>

<script setup>
import SectionBlock from './SectionBlock.vue'
import TimelineEntry from './TimelineEntry.vue'

const education = [
  {
    period: '2024 - 2027',
    title: 'BSc Computer Science & Engineering',
    organisation: 'Eindhoven University of Technology',
    description:
      'Passed all courses to date with ~8.5/10 average grade. Electives include Computer Graphics, Algebra for Security, and Introduction to Cryptology.',
  },
  {
    period: '2022 - 2024',
    title: 'Secondary Education (IB Diploma)',
    organisation: 'American School of Warsaw',
    description: null,
  },
]

const jobs = [
  {
    period: '2020 – Present',
    title: 'Web / Game Developer',
    organisation: 'Self-Employed · Warsaw',
    description:
      'Developed a diverse range of web projects independently and for clients under formal agreements. Covers full-stack work, third-party API integrations, and collaborative codebases. Portfolio at portfolio.kanapka.eu.',
  },
  {
    period: 'Oct 2024 – Present',
    title: 'Baker',
    organisation: 'Albert Heijn · Eindhoven',
    description:
      'Part-time role maintained alongside university studies. Developed communication, time management, and professional dependability in a fast-paced environment.',
  },
]
</script>

<style scoped>
.main {
  background-color: #fff;
}
</style>
