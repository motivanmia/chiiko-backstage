<script setup>
  import { ref } from 'vue';
  import { Search } from '@element-plus/icons-vue';
  import Icon from './Icon.vue';

  const searchText = ref('');

  const handleSearch = () => {};
</script>

<template>
  <div class="search-container">
    <el-input
      v-model="searchText"
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
