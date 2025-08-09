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
  import TheHeader from '@/components/common/TheHeader.vue';

  const route = useRoute();
  const selectedStatus = ref('');

  /** —— 第一張表：食材基本資訊 —— */
  const ingredientInfoColumns = ref([
    { prop: 'ingredientId', label: '食材編號', width: 140 },
    { prop: 'ingredientCategory', label: '食材分類', width: 140 },
    { prop: 'ingredientName', label: '食材名稱', width: 200 },
    { prop: 'ingredientImage', label: '食材圖片', type: 'image' },
    { prop: 'ingredientStatus', label: '狀態', type: 'status', width: 140 },
  ]);

  /** —— 第二張表：挑選指南 —— */
  const ingredientGuideColumns = ref([
    { prop: 'goodText', label: '左側說明項目', width: 400 },
    { prop: 'comparisonImage', label: '圖片', type: 'image' },
    { prop: 'badText', label: '右側說明項目', width: 400 },
    { prop: 'preservationText', label: '保存方法', width: 400 },
  ]);

  // 第一個表格的資料
  const ingredientInfoData = ref([]);
  // 第二個表格的資料
  const ingredientGuideData = ref([]);

  onMounted(() => {
    const id = route.params.id;
    const found = ingredients.find((item) => item.id === id);
    // console.log(found);

    if (found) {
      // —— 食材基本資訊表 ——（1 筆）
      ingredientInfoData.value = [
        {
          ingredientId: found.id,
          ingredientCategory: found.category,
          ingredientName: found.name,
          ingredientImage: found.img?.[0] || '',
          ingredientStatus: found.status || '',
        },
      ];

      // —— 挑選指南表 ——（每個 lightbox 2 列：標題列 + 內文列）
      ingredientGuideData.value = [];

      found.lightbox.forEach((item, index) => {
        // 標題行（好/壞標題，第一組放好圖與保存方法）
        ingredientGuideData.value.push({
          goodText: item.goodtitle,
          comparisonImage: index === 0 ? found.img?.[0] || '' : '',
          badText: item.badtitle,
          preservationText: index === 0 ? found.preservation || '' : '',
        });

        // 內文行（好/壞內文，第二組放壞圖）
        ingredientGuideData.value.push({
          goodText: item.goodcontent,
          comparisonImage: index === 1 ? found.img?.[1] || '' : '',
          badText: item.badcontent,
          preservationText: '',
        });
      });
    }
  });

  /**
   * 表格合併：對第二張表（挑選指南）使用
   * - 圖片欄：分上下兩塊，各佔一半列數（例：6 列 → 0~2, 3~5）
   * - 保存方法欄：第一列開始合併整欄（例：6 列 → 0~5）
   */
  function spanMethod({ rowIndex, columnIndex }) {
    const total = ingredientGuideData.value.length; // 例如 6
    const half = Math.ceil(total / 2); // 例如 3

    // 圖片欄（第二欄，index=1）
    if (columnIndex === 1) {
      if (rowIndex === 0) return { rowspan: half, colspan: 1 }; // 上半
      if (rowIndex === half) return { rowspan: total - half, colspan: 1 }; // 下半
      return { rowspan: 0, colspan: 0 };
    }

    // 保存方法欄（第四欄，index=3）
    if (columnIndex === 3) {
      if (rowIndex === 0) return { rowspan: total, colspan: 1 }; // 佔滿全部列
      return { rowspan: 0, colspan: 0 };
    }
  }
</script>

<template>
  <div class="ingredient-board">
    <div class="ingredient-board__manage">
      <TheHeader
        title="食材項目編輯"
        :show-increase-button="false"
      />
    </div>
  </div>

  <div class="ingredient-board__contents">
    <Table
      :table-data="ingredientInfoData"
      :columns="ingredientInfoColumns"
    />
  </div>

  <div class="ingredient-board__manage">
    <TheHeader
      title="食材燈箱編輯"
      :show-increase-button="false"
    />
  </div>

  <div class="ingredient-board__contents">
    <Table
      :table-data="ingredientGuideData"
      :columns="ingredientGuideColumns"
      :span-method="spanMethod"
    />
  </div>
</template>

<style lang="scss" scoped></style>
