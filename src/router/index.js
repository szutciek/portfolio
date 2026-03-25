import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/ResponsiveHomeView.vue'),
    },
    {
      path: '/resume',
      name: 'ResumePrint',
      component: () => import('@/views/ResumePrint.vue'),
    },
    {
      path: '/src/:pathMatch(.*)*',
      name: 'Source Redirect',
      redirect: '/',
    },
    {
      path: '/utm_source/:pathMatch(.*)*',
      name: 'Source Redirect UTM',
      redirect: '/',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

export default router
