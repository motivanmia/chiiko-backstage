import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';

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
          meta: { requiresAuth: true, requiresRole: 0 }, // 🔑 需要登入
        },
        {
          path: '/recipe',
          name: 'recipe',
          component: () => import('@/pages/Recipe.vue'),
          meta: { requiresAuth: true }, // 🔑 需要登入
        },
        {
          path: '/member',
          name: 'member',
          component: () => import('@/pages/Member.vue'),
          meta: { requiresAuth: true }, // 🔑 需要登入
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/pages/Order.vue'),
          meta: { requiresAuth: true }, // 🔑 需要登入
        },
        {
          path: '/order-detail/:id',
          name: 'order-detail',
          component: () => import('@/pages/OrderDetail.vue'),
          meta: { requiresAuth: true }, // 🔑 需要登入
        },
        {
          path: '/ingredient',
          name: 'ingredient',
          component: () => import('@/pages/Ingredient.vue'),
          meta: { requiresAuth: true }, // 🔑 需要登入
        },
        {
          path: '/ingredient/:id',
          name: 'IngredientDetail',
          component: () => import('@/pages/IngredientDetail.vue'),
          props: true,
          meta: { requiresAuth: true }, // 🔑 需要登入
        },
        {
          path: '/product',
          name: 'product',
          component: () => import('@/pages/Product.vue'),
          meta: { requiresAuth: true }, // 🔑 需要登入
        },
        {
          path: '/product/:id',
          name: 'ProductDetail',
          component: () => import('@/pages/ProductDetail.vue'),
          props: true,
          meta: { requiresAuth: true }, // 🔑 需要登入
        },
        {
          path: '/report',
          name: 'ReportManagement',
          component: () => import('@/pages/ReportManagement.vue'),
          props: true,
          meta: { requiresAuth: true }, // 🔑 需要登入
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isLogin) {
    try {
      await authStore.checkSession();
    } catch (error) {
      // 處理 Session 檢查失敗的情況，例如伺服器錯誤
      console.error('Session check failed:', error);
    }
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresRole = to.meta.requiresRole;

  if (requiresAuth && !authStore.isLogin) {
    //這個頁面需要登入 但若還未登入 直接導到登入頁
    next({
      path: '/login',
      query: { redirect: to.fullPath }, //登入後導回原頁面
    });
  }
  //  檢查權限是否足夠
  else if (requiresRole !== undefined) {
    if (authStore.user && authStore.user.role === requiresRole) {
      next();
    } else {
      // 權限不符
      alert('您的權限不足，無法進入此頁面。');
      next('/member');
    }
  } else {
    // 頁面不需要特定權限，直接通過
    next();
  }
});

export default router;
