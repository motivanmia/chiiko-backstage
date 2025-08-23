<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  import TheHeader from '@/components/common/TheHeader.vue';
  import Table from '@/components/Table.vue';
  import { ingredients } from '@/constants/ingredients.js'; // 完整資料

  const route = useRoute();

  /** —— 表頭定義 —— */
  const ingredientInfoColumns = ref([
    { prop: 'productId', label: '商品編號', width: 140 },
    { prop: 'productCategory', label: '商品分類', width: 140 },
    { prop: 'productImage', label: '商品預覽圖片', type: 'image' },
    { prop: 'productName', label: '商品名稱', width: 200 },
    { prop: 'productPrice', label: '單價', width: 100 },
    { prop: 'productStatus', label: '商品狀態', type: 'status', width: 100 },
  ]);

  /** —— 表格資料 —— */
  const ingredientInfoData = ref([]); // 第一張表（基本資訊）
  const leftTableData = ref([]); // 第二張表左邊（圖片）
  const rightTableData = ref([]); // 第二張表右邊（內文）

  onMounted(() => {
    const id = route.params.id;
    const product = ingredients.find((p) => p.id === id);
    if (!product) return;

    // —— 商品基本資訊表（1 筆）——
    ingredientInfoData.value = [
      {
        productId: product.id,
        productCategory: product.category,
        productImage: product.img?.[0] || '',
        productName: product.name,
        productPrice: product.price,
        productStatus: product.status ?? '上架',
      },
    ];

    // —— 第二張表資料（拆左右）——
    const totalRows = product.lightbox?.length ? product.lightbox.length * 2 : 6;
    const half = Math.ceil(totalRows / 2);

    // 左邊：商品圖片
    leftTableData.value = Array.from({ length: totalRows }, (_, rowIndex) => ({
      comparisonImage:
        rowIndex === 0
          ? product.img?.[0] || ''
          : rowIndex === half
            ? product.img?.[1] || product.img?.[0] || ''
            : '',
    }));

    // 右邊：商品內文
    rightTableData.value = Array.from({ length: totalRows }, (_, rowIndex) => ({
      preservationText: rowIndex === 0 ? product.preservation || '' : '',
    }));
  });
</script>

<template>
  <div class="ingredient-board">
    <div class="ingredient-board__manage">
      <TheHeader
        title="商品編輯"
        :show-increase-button="false"
      />
    </div>

    <!-- 第一張表：商品基本資訊 -->
    <div class="ingredient-board__contents">
      <Table
        :table-data="ingredientInfoData"
        :columns="ingredientInfoColumns"
      />
    </div>

    <!-- 第二張表：拆成左右兩個 -->
    <div class="ingredient-board__contents ingredient-board__contents--split">
      <!-- 左邊：窄 -->
      <Table
        :table-data="leftTableData"
        :columns="[{ prop: 'comparisonImage', label: '商品圖片', type: 'image', width: 300 }]"
        style="flex: 1"
      />

      <!-- 右邊：寬 -->
      <Table
        :table-data="rightTableData"
        :columns="[{ prop: 'preservationText', label: '商品編輯', width: 605 }]"
        style="flex: 2"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .ingredient-board__contents + .ingredient-board__contents {
    margin-top: 16px;
  }

  .ingredient-board__contents--split {
    display: flex;
    gap: 16px;
  }
</style>
