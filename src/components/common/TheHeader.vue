<script setup>
  import { computed } from 'vue';
  import Title from './Title.vue';
  import IncreaseButton from './IncreaseButton.vue';
  import DropMenu from './DropMenu.vue';
  import Search from './Search.vue';

  const props = defineProps({
    title: {
      type: String,
      default: '請帶標題',
    },
    searchOption: {
      type: [String, Array],
      default: '',
    },
    searchText: {
      type: String,
      default: '',
    },
    dropOptions: {
      type: Array,
      default: () => [],
    },
    showIncreaseButton: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(['update:searchOption', 'update:searchText', 'create']);

  const searchOption = computed({
    get: () => props.searchOption,
    set: (val) => {
      emit('update:searchOption', val);
    },
  });

  const searchInput = computed({
    get: () => props.searchText,
    set: (val) => {
      emit('update:searchText', val);
    },
  });
</script>

<template>
  <div class="the-header">
    <div class="the-header__wrap">
      <Title
        :title="title"
        class="the-header__title"
      />

      <IncreaseButton
        v-if="showIncreaseButton"
        @click="$emit('create')"
      />
    </div>
    <div class="the-header__wrap">
      <DropMenu
        :options="dropOptions"
        v-model="searchOption"
      />
      <Search v-model="searchInput" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .the-header {
    padding: 0 px(20);
    border-bottom: px(1) solid color(backgroundColor, recipe);
    margin-bottom: px(15);

    &__wrap {
      @include flex($jc: space-between);
      padding-bottom: px(20);
    }
  }
</style>
