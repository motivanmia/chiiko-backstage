<script setup>
  import { useRouter } from 'vue-router';
  import TheButton from '@/components/common/TheButton.vue';

  const router = useRouter();

  const goHome = () => {
    router.push({ path: '/' });
  };
</script>

<template>
  <el-result
    title="404"
    sub-title="Sorry, request error"
  >
    <template #icon>
      <div class="not-found__pic">
        <img
          class="not-found__img"
          src="../assets/images/logo.svg"
          alt=""
        />
      </div>
    </template>
    <template #extra>
      <TheButton
        text="回首頁"
        @click="goHome"
      />
    </template>
  </el-result>
</template>

<style lang="scss" scoped>
  :deep(.el-result__title p) {
    @include fontSet($size: px(64), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
  }

  :deep(.el-result__subtitle p) {
    @include fontSet($size: px(32), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
  }

  .not-found {
    &__pic {
      width: 300px;
    }

    &__img {
      @include fit();
    }
  }
</style>
