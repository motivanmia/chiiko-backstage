<script setup>
  import Title from './Title.vue';
  import TheButton from './TheButton.vue';

  defineProps({
    title: {
      type: String,
      default: '請帶標題',
    },
  });
</script>

<template>
  <div class="the-detail-header__wrap">
    <Title
      title="訂單管理"
      class="the-detail-header__title"
    />
    <div class="the-detail-header__button-wrap">
      <TheButton />
      <TheButton
        text="取消"
        type="cancel"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .the-detail-header {
    &__wrap {
      @include flex($jc: space-between);
      padding: px(15) px(20);
    }

    &__button-wrap {
      @include flex();
      gap: px(25);
    }
  }
</style>
