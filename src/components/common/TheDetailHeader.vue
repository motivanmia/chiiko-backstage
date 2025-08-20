<script setup>
  import Title from './Title.vue';
  import TheButton from './TheButton.vue';

  const props = defineProps({
    title: { type: String, default: '請帶標題' },
    buttons: {
      type: Array,
      default: () => ['save', 'cancel'],
    },
  });
  const emit = defineEmits(['save', 'create', 'cancel']);
</script>

<template>
  <div class="the-detail-header__wrap">
    <Title
      :title="title"
      class="the-detail-header__title"
    />
    <div class="the-detail-header__button-wrap">
      <TheButton
        v-if="buttons.includes('save')"
        text="儲存"
        @click="emit('save')"
      />
      <TheButton
        v-if="buttons.includes('create')"
        text="新增"
        @click="emit('create')"
      />
      <TheButton
        v-if="buttons.includes('cancel')"
        text="取消"
        variant="cancel"
        @click="emit('cancel')"
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
