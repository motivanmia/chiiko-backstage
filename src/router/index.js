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
          path: '/home',
          name: 'home',
          component: () => import('@/pages/Home.vue'),
        },
        {
          path: '/recipe',
          name: 'recipe',
          component: () => import('@/pages/Recipe.vue'),
        },
        {
          path: '/member',
          name: 'member',
          component: () => import('@/pages/Member.vue'),
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/pages/Order.vue'),
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
