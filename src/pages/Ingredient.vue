<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';

  import { ref } from 'vue';
  import DropMenu from '@/components/common/DropMenu.vue';

  import Search from '@/components/common/Search.vue';
  import MyTitle from '@/components/common/Title.vue';
  import IncreaseButton from '@/components/common/IncreaseButton.vue';
  import Table from '@/components/Table.vue';
  import { useRouter } from 'vue-router';
  import { ingredients } from '@/constants/ingredients.js';

  const tableData = ref(
    ingredients.map((item) => ({
      number: item.id,
      category: item.category,
      name: item.name,
      img: item.img[0],
      status: item.status || '',
      icon: '',
      del: '',
    })),
  );
  // console.log(tableData);

  const router = useRouter();

  function goToDetail(row) {
    router.push({
      name: 'IngredientDetail',
      params: { id: row.number },
    });
  }
  const selectedStatus = ref(''); // 用於儲存使用者選擇的結果

  const IngredientOptions = [
    {
      value: 'draft',
      label: '植物性食材',
    },
    {
      value: 'approved',
      label: '動物性食材',
    },
  ];

  // 搜尋
  const searchText = ref('');

  const handleSearch = () => {};

  //內容

  const columns = ref([
    { prop: 'number', label: '食材編號', width: 140 },
    { prop: 'category', label: '食材分類', width: 140 },
    { prop: 'name', label: '食材名稱', width: 200 },
    { prop: 'img', label: '食材圖片', type: 'image' },
    { prop: 'status', label: '狀態', type: 'status', width: 140 },
    { prop: 'icon', label: '詳細', type: 'button', width: 60 },
    { prop: 'del', label: '刪除', type: 'button', width: 60 },
  ]);
</script>

<template>
  <div class="ingredient-board">
    <div class="ingredient-board__manage">
      <MyTitle title="食材管理"></MyTitle>
      <IncreaseButton></IncreaseButton>
    </div>

    <div class="ingredient-board__query">
      <DropMenu
        v-model="selectedStatus"
        :options="IngredientOptions"
        class="ingredient-board__drop"
      ></DropMenu>
      <Search class="ingredient-board__search" />
    </div>
  </div>

  <div class="ingredient-board__contents">
    <Table
      :table-data="tableData"
      :columns="columns"
      @button-click="goToDetail"
    ></Table>
  </div>
</template>

<style lang="scss" scoped>
  .ingredient-board {
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
        background-color: color(backgroundColor, ingredient);
        bottom: -30px;
      }

      .ingredient-board__drop {
        grid-column: 2/3;
        grid-row: 1;
        align-self: center;
      }
      .ingredient-board__search {
        grid-column: 5/6;
        grid-row: 1;
      }
    }

    .ingredient-board__contents {
      margin-top: 50px;
    }
  }
</style>
