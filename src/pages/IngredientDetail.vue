<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  import DropMenu from '@/components/common/DropMenu.vue';
  import Search from '@/components/common/Search.vue';
  import MyTitle from '@/components/common/Title.vue';
  import IncreaseButton from '@/components/common/IncreaseButton.vue';
  import Table from '@/components/Table.vue';

  import { ingredients } from '@/constants/ingredients.js'; // 完整資料

  const route = useRoute();
  const selectedStatus = ref('');

  const columns = ref([
    { prop: 'number', label: '食材編號', width: 140 },
    { prop: 'category', label: '食材分類', width: 140 },
    { prop: 'name', label: '食材名稱', width: 200 },
    { prop: 'img', label: '食材圖片', type: 'image' },
    { prop: 'status', label: '狀態', type: 'status', width: 140 },
  ]);

  const detailcolumns = ref([
    { prop: 'number', label: '左側說明項目', width: 400 },
    { prop: 'category', label: '圖片', type: 'image' },
    { prop: 'name', label: '右側說明項目', width: 400 },
    { prop: 'img', label: '保存方法', width: 400 },
  ]);

  // 第一個表格的資料
  const tableData = ref([]);
  // 第二個表格的資料
  const detailData = ref([]);

  onMounted(() => {
    const id = route.params.id;
    const found = ingredients.find((item) => item.id === id);
    console.log(found);

    if (found) {
      // 第一個表格用完整資料的基本欄位
      tableData.value = [
        {
          number: found.id,
          category: found.category,
          name: found.name,
          img: found.img[0], // 第一張圖
          status: found.status || '',
        },
      ];

      detailData.value = [];

      found.lightbox.forEach((item, index) => {
        // 標題行
        detailData.value.push({
          number: item.goodtitle,
          category: index === 0 ? found.img[0] : index === 1 ? found.img[1] : '',
          name: item.badtitle,
          img: index === 0 ? found.preservation : '',
        });

        // 內文行
        detailData.value.push({
          number: item.goodcontent,
          category: '',
          name: item.badcontent,
          img: '',
        });
      });
    }
  });
  function spanMethod({ row, column, rowIndex, columnIndex }) {
    // 圖片欄（第二欄）
    if (columnIndex === 1) {
      if (rowIndex === 0) return { rowspan: 3, colspan: 1 }; // 第一張圖佔 3 列
      if (rowIndex === 3) return { rowspan: 3, colspan: 1 }; // 第二張圖佔 3 列
      return { rowspan: 0, colspan: 0 }; // 隱藏被合併的儲存格
    }

    // 保存方法欄（第四欄）
    if (columnIndex === 3) {
      if (rowIndex === 0) return { rowspan: 6, colspan: 1 }; // 保存方法佔 6 列
      return { rowspan: 0, colspan: 0 };
    }
  }
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
      @button-click="handleEdit"
    ></Table>
  </div>
  <div class="ingredient-board__manage">
    <MyTitle title="挑選指南"></MyTitle>
    <IncreaseButton></IncreaseButton>
  </div>
  <div class="ingredient-board__contents">
    <Table
      :table-data="detailData"
      :columns="detailcolumns"
      :span-method="spanMethod"
      @button-click="handleEdit"
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
