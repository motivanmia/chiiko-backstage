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
        {
          path: '/order-detail',
          name: 'order-detail',
          component: () => import('@/pages/OrderDetail.vue'),
        },
        {
          path: '/Report-Management',
          name: 'Report-Management',
          component: () => import('@/pages/ReportManagement.vue'),
        },
        {
          path: '/Recipe-DetailAdmin',
          name: 'RecipeDetailAdmin',
          component: () => import('@/pages/RecipeDetailAdmin.vue'),
        },
        {
          path: '/Notification-Management',
          name: 'Notification-Management',
          component: () => import('@/pages/NotificationManagement.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFound.vue'),
    },
  ],
});

export default router;
