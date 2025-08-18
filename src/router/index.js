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
          path: '/',
          redirect: {
            name: 'admin',
          },
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('@/pages/Admin.vue'),
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
          path: '/ingredient',
          name: 'ingredient',
          component: () => import('@/pages/Ingredient.vue'),
        },
        {
          path: '/ingredient/:id',
          name: 'IngredientDetail',
          component: () => import('@/pages/IngredientDetail.vue'),
          props: true,
        },
        {
          path: '/product',
          name: 'product',
          component: () => import('@/pages/Product.vue'),
        },
        {
          path: '/product/:id',
          name: 'ProductDetail',
          component: () => import('@/pages/ProductDetail.vue'),
          props: true,
        },
        {
          path: '/report',
          name: 'ReportManagement',
          component: () => import('@/pages/ReportManagement.vue'),
          props: true,
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
