<script>
  import { createRouter, createWebHistory } from 'vue-router';

  const routes = [
    // 其他路由...
    {
      path: '/product/:id', // 動態參數 :id
      name: 'ProductDetail', // 用 router.push 時會用這個 name
      component: ProductDetail,
    },
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  export default router;
</script>

<template>
  <div>
    <h1>商品詳情頁</h1>
    <p>商品 ID: {{ id }}</p>
  </div>
</template>

<script setup>
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const id = route.params.id; // 從 URL 讀取商品 ID
</script>
