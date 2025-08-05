<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';

  import { ref } from 'vue';
  // import { Search } from '@element-plus/icons-vue';
  import DropMenu from '@/components/common/DropMenu.vue';
  
  import Search from '@/components/common/Search.vue';
  import MyTitle from '@/components/common/Title.vue';
  import IncreaseButton from '@/components/common/IncreaseButton.vue';

  const selectedStatus = ref(''); // 用於儲存使用者選擇的結果

  const recipeOptions = [
    {
      value: 'draft',
      label: '草稿',
    },
    {
      value: 'approved',
      label: '已審核',
    },
    {
      value: 'pending',
      label: '待審核',
    },
    {
      value: 'remove',
      label: '已下架',
    },
  ];

  // 搜尋
  const searchText = ref('');

  const handleSearch = () => {};
</script>

<template>
  <!-- <div class="recipe">
    <div class="recipe-board">
      <<h1>食譜管理</h1>>
      <el-button
        type="warning"
        round
      >
        + 新增
      </el-button>
    </div>
    <div class="recipe-board__menu">
      <DropMenu
        v-model="selectedStatus"
        :options="recipeOptions"
      ></DropMenu>
      <el-input
        class="custom-search-input"
        v-model="searchText"
        placeholder="搜尋"
        :suffix-icon="Search"
        clearable
        @keyup.enter="handleSearch"
      ></el-input>
    </div>

    <div class=""></div>
  </div> -->
<MyTitle title="食譜管理"></MyTitle>
  <Search/>
  <IncreaseButton></IncreaseButton>
</template>

<style lang="scss" scoped>
</style>
