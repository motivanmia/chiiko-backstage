<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';

  import { ref } from 'vue';
  // import { Search } from '@element-plus/icons-vue';
  import DropMenu from '@/components/common/DropMenu.vue';

  import Search from '@/components/common/Search.vue';
  import MyTitle from '@/components/common/Title.vue';
  import IncreaseButton from '@/components/common/IncreaseButton.vue';
  import Table from '@/components/Table.vue';

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

  //內容

  const columns = ref([
    { prop: 'number', label: '食譜編號', width: 100 },
    { prop: 'category', label: '食譜分類', width: 100 },
    { prop: 'name', label: '食譜名稱' },
    { prop: 'author', label: '作者' },
    { prop: 'date', label: '新增日期' },
    { prop: 'status', label: '會員狀態', type: 'status' },
    { prop: 'icon', label: '詳細', type: 'button', width: 60 },
    { prop: 'del', label: '刪除', type: 'button', width: 60 },
  ]);

  const tableData = ref([
    {
      number: 'R01',
      category: '家庭聚餐',
      name: '法式焦糖布丁',
      author: '管理員',
      date: '2025-07-07',
      status: '草稿',
      icon: '',
      del: '',
    },
    {
      number: 'R01',
      category: '減糖料理',
      name: '櫛瓜豆皮蛋餅',
      author: '塔馬可吉',
      date: '2025-07-07',
      status: '待審核',
      icon: '',
      del: '',
    },
    {
      number: 'R01',
      category: '一人料理',
      name: '柚子胡椒雞肉蕎麥麵',
      author: '平台發布',
      date: '2025-07-07',
      status: '已發布',
      icon: '',
      del: '',
    },
  ]);
</script>

<template>
  <div class="recipe-board">
    <div class="recipe-board__manage">
      <MyTitle title="食譜管理"></MyTitle>
      <IncreaseButton></IncreaseButton>
    </div>

    <div class="recipe-board__query">
      <DropMenu
        v-model="selectedStatus"
        :options="recipeOptions"
        class="recipe-board__drop"
      ></DropMenu>
      <Search class="recipe-board__search" />
    </div>

    <div class="recipe-board__contents">
      <Table
        :table-data="tableData"
        :columns="columns"
      >
        <template #del><Icon class="del-button" icon-name="del" /></template>
      </Table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .recipe-board {
    &__manage {
      display: flex;
      justify-content: space-between;
      align-content: center;
    }

    &__query {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: auto;
      margin-top: 27px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: color(backgroundColor, recipe);
        bottom: -30px;
      }

      .recipe-board__drop {
        grid-column: 2/3;
        grid-row: 1;
        align-self: center;
      }
      .recipe-board__search {
        grid-column: 5/6;
        grid-row: 1;
      }
    }

    .recipe-board__contents {
      margin-top: 50px;
      
      .del-button{
          font-size: 20px;
          cursor: pointer;
        }
    }
  }
</style>
