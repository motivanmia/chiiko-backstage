<script setup>
  import Title from './Title.vue';
  import TheButton from './TheButton.vue';
  import ImageTip from '@/components/common/ImageTip.vue';

  const props = defineProps({
    title: { type: String, default: '請帶標題' },
    buttons: {
      type: Array,
      default: () => ['save', 'cancel'],
    },
    enableImageTip: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['save', 'create', 'cancel']);
</script>

<template>
  <div class="the-detail-header__wrap">
    <div class="the-detail-header__titlebox">
      <Title
        :title="title"
        class="the-detail-header__title"
      />
      <ImageTip v-if="enableImageTip" />
    </div>

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
    &__titlebox {
      @include flex();
      gap: 10px;
    }
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
