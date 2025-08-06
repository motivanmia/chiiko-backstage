<script setup>
  // import { useAuthStore } from '@/stores/auth';
  import { useRoute } from 'vue-router';
  // const authStore = useAuthStore();
  import logo from '@/assets/images/logo.svg';

  const route = useRoute();

  const menuItems = [
    { index: '/', title: '後台人員管理' },
    { index: '/test1', title: '會員資料查詢' },
    { index: '/recipe', title: '食譜管理' },
    { index: '/member', title: '會員資料查詢' },
    { index: '/test2', title: '食譜管理' },
    { index: '/test3', title: '食材學堂管理' },
    { index: '/test4', title: '商品管理' },
    { index: '/test5', title: '訂單查詢' },
    { index: '/test6', title: '留言檢舉管理' },
    { index: '/test7', title: '通知管理' },
  ];
</script>

<template>
  <el-container class="layout-container">
    <el-aside>
      <router-link
        to="/"
        class="logo__link"
      >
        <div class="logo__container">
          <div class="logo__pic">
            <img
              :src="logo"
              alt=""
              class="logo__img"
            />
          </div>
          <h2 class="logo__title">後台管理系統</h2>
        </div>
      </router-link>
      <el-menu
        :default-active="route.path"
        router
      >
        <template
          v-for="item in menuItems"
          :key="item.index || item.id"
        >
          <el-menu-item :index="item.index">
            <span class="el-menu-title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="header">
          <div class="header-user">黃維尼</div>
          <button class="header-logout">登出</button>
        </div>
      </el-header>

      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
  .layout-container {
    height: 100vh;
  }

  .el {
    &-aside {
      width: px(300);
      padding: px(26) 0;
      background-color: color(backgroundColor, recipe);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-menu {
      width: fit-content;
      background-color: transparent;
      border-right: none;

      &-item {
        @include fontSet($size: px(24), $lh: 1.2, $color: color(text, light), $ls: 0.1em);
        border-radius: px(20);
        justify-content: center;
        transition:
          background-color 0.3s ease-in-out,
          color 0.3s ease-in-out;

        &.is-active,
        &:hover {
          color: color(text, dark);
          background-color: color(backgroundColor, beige);
        }

        & + & {
          margin-top: 20px;
        }
      }
    }
    &-header {
      background-color: color(backgroundColor, beige);
      @include headerBoxShadow;
      z-index: 1;
      height: auto;

      .header {
        @include flex($jc: flex-end);
        column-gap: px(30);
        margin-left: auto;
        padding: px(15) px(50);

        &-user {
          @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
        }

        &-logout {
          @include fontSet($size: px(18), $lh: 1.2, $color: color(button, main), $ls: 0.1em);

          background-color: color(backgroundColor, beige);
          padding: px(10) px(20);
          border: px(1) solid color(backgroundColor, recipe);
          border-radius: px(15);
        }
      }
    }

    &-main {
      overflow: auto;
      background-color: color(backgroundColor, beige);
      padding: px(20) px(30);
    }
  }

  .logo {
    &__link {
      text-decoration: none;
    }

    &__container {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: px(15);
      margin-bottom: px(90);
    }

    &__pic {
      width: 100px;
    }

    &__img {
      @include fit();
      aspect-ratio: 48 / 32;
    }

    &__title {
      @include fontSet($size: px(30), $lh: 1.2, $color: color(text, light), $ls: 0.1em);
    }
  }
</style>
