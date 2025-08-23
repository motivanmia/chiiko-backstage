<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  import TheHeader from '@/components/common/TheHeader.vue';
  import Table from '@/components/Table.vue';
  import { ingredients } from '@/constants/ingredients.js';

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

  /** —— 資料 —— */
  const ingredientInfoData = ref([]); // 第一張表
  const productImages = ref([]); // 左側圖片
  const preservationText = ref(''); // 右側內文

  onMounted(() => {
    const id = route.params.id;
    const product = ingredients.find((p) => p.id === id);
    if (!product) return;

    // 商品基本資訊（第一張表）
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

    // 左側圖片
    productImages.value = product.img || [];

    // 右側內文
    preservationText.value = product.preservation || '';
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

    <!-- 第一張表格 -->
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

  <!-- 主體 -->
  <div class="ingredient-board__guide-body">
    <!-- 左側圖片清單 -->
    <div class="ingredient-board__images">
      <div
        v-for="(img, index) in productImages"
        :key="index"
        class="ingredient-board__image"
      >
        <img :src="img" alt="商品圖片" />
        <button class="select-btn">選擇擇定</button>
      </div>
    </div>

    <!-- 右側文字編輯 -->
    <div class="ingredient-board__text">
      <textarea
        v-model="preservationText"
        placeholder="輸入商品內文..."
      ></textarea>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.ingredient-board__guide {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ingredient-board__guide-header {
  display: grid;
  grid-template-columns: 200px 1fr;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px 6px 0 0;

  .header-cell {
    padding: 8px;
    font-weight: bold;
    text-align: center;
    border-right: 1px solid #ddd;

    &:last-child {
      border-right: none;
    }
  }
}

.ingredient-board__guide-body {
  display: flex;
  gap: 16px;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 6px 6px;
  padding: 12px;
}

.ingredient-board__contents + .ingredient-board__contents {
  margin-top: 16px;
}

.ingredient-board__images {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 200px;
}

.ingredient-board__image {
  img {
    width: 100%;
    border-radius: 6px;
    border: 1px solid #ddd;
  }

  .select-btn {
    margin-top: 6px;
    width: 100%;
    padding: 4px 0;
    font-size: 14px;
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}

.ingredient-board__text {
  flex: 1;

  textarea {
    width: 100%;
    height: 100%;
    min-height: 400px;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    resize: vertical;
  }
}

</style>
