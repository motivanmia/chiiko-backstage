<script setup>
  import { computed } from 'vue';
  import Icon from './Icon.vue';

  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['update:modelValue', 'search']);

  const inputValue = computed({
    get: () => props.modelValue,
    set: (val) => {
      emit('update:modelValue', val);
    },
  });

  const handleSearch = () => {
    emit('search', props.modelValue);
  };
</script>

<template>
  <div class="search-container">
    <el-input
      v-model="inputValue"
      placeholder="搜尋"
      clearable
      @keyup.enter="handleSearch"
    >
      <template #suffix>
        <Icon
          icon-name="search"
          class="search-btn"
          @click="handleSearch"
        />
      </template>
    </el-input>
  </div>
</template>

<style lang="scss" scoped>
  .search-container {
    width: 200px;
  }

  .el-input {
    --el-input-height: 40px;
    border-radius: 20px;

    :deep(.el-input__wrapper) {
      border-radius: 20px;
      box-shadow: none;
      border: 1px solid color(backgroundColor, recipe);
    }

    :deep(.el-input__suffix-inner) {
      display: flex;
      align-items: center;
    }
  }

  .search-btn {
    color: color(search, border);
    font-size: 20px;
    cursor: pointer;
  }
</style>
