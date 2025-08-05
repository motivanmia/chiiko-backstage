import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      behavior: 'smooth',
    };
  },
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/pages/Index.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/Home.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
    },
  ],
});

export default router;
