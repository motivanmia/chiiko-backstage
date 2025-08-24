<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';

  import Table from '@/components/Table.vue';
  import TheHeader from '@/components/common/TheHeader.vue';
  import { ingredients } from '@/constants/ingredients.js';
  import switch_el from '@/components/Switch.vue';

  const router = useRouter();
  const API_BASE = import.meta.env.VITE_API_BASE;
  const FILE_BASE = import.meta.env.VITE_FILE_URL;
  const GetProductData = async () => {
    const res = await axios.get(`${API_BASE}/product/get_product_detail.php`, {
      withCredentials: true,
    });
    return JSON.parse(res.data.data);
  };

  // 原始資料
  const useMockData = false;

  const tableData = ref([]);

  onMounted(async () => {
    try {
      const products = await GetProductData();
      tableData.value = products; // 直接灌進 ref
    } catch (err) {
      console.error('取得商品資料失敗', err);
    }
  });
  const categoryOptions = [
    { label: '已上架', value: 'on' },
    { label: '已下架', value: 'off' },
  ];

  const searchOption = ref('all');
  const searchText = ref('');

  const filteredTableData = computed(() => {
    const rawCat = searchOption.value;
    // console.log(rawCat);

    const cat = Array.isArray(rawCat) && rawCat !== null ? rawCat.value : String(rawCat || '');

    // console.log(cat);

    const kw = searchText.value.trim().toLowerCase();

    // 1) 先按分類（就算沒有關鍵字也要先篩）
    let rows = tableData.value;
    console.log('Test');
    rows.forEach((element) => {
      if (!element.preview_image.includes('http')) {
        element.preview_image = `${FILE_BASE}/${element.preview_image}`;
        console.log(element);
      }
    });
    if (cat && cat !== 'all') {
      rows = rows.filter((r) => r.category === cat);
    }

    // 2) 再按關鍵字（這裡示範只搜名稱，要搜更多欄位就加）
    if (!kw) return rows;
    return rows.filter((r) => {
      const nameHit = String(r.name).toLowerCase().includes(kw);
      const numberHit = String(r.number).toLowerCase().includes(kw);
      return nameHit || numberHit;
    });
  });

  // 表格欄位
  const columns = ref([
    { prop: 'product_id', label: '商品編號', width: 110 },
    { prop: 'category_name', label: '商品分類', width: 110 },
    { prop: 'preview_image', label: '商品預覽圖片', type: 'image' },
    { prop: 'product_name', label: '商品名稱', width: 200 },
    { prop: 'price', label: '單價', width: 100 },
    { prop: 'status', label: '商品狀態', type: 'status', width: 140 },
    { prop: 'icon', label: '編輯', type: 'button-detail', width: 60 },
    { prop: 'del', label: '刪除', type: 'button-del', width: 60 },
  ]);

  // const goToDetail = () => {
  //   router.push({ name: 'ProductDetail' });
  // };
  const goToDetail = () => {
    router.push({ name: 'ProductDetail', params: { id: 'new' } });
  };
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/products/${id}`, { status });
      const item = tableData.value.find((p) => p.number === id);
      if (item) item.status = status;
    } catch (err) {
      console.error('更新狀態失敗', err);
    }
  };

  const deleteProduct = async (row) => {
    console.log(row);
    if (!confirm(`確定刪除 ${row.name} 嗎？`)) return;
    try {
      const res = await axios.post(
        `${API_BASE}/product/delete_product.php`,
        { product_id: row.product_id }, // 一定要傳 product_id
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      console.log(res);
      // 刪除成功後更新 tableData
      tableData.value = tableData.value.filter((p) => p.product_id !== row.product_id);
    } catch (err) {
      console.error('刪除失敗', err.response?.data || err);
    }
  };
</script>

<template>
  <div class="ingredient-board">
    <TheHeader
      title="商品管理"
      v-model:searchOption="searchOption"
      v-model:searchText="searchText"
      :dropOptions="categoryOptions"
      :show-increase-button="true"
      @create="goToDetail"
    />
  </div>

  <div class="ingredient-board__contents">
    <Table
      :table-data="filteredTableData"
      :columns="columns"
      @button-click="goToDetail"
      @del-click="deleteProduct"
    >
      <template #img="{ row }">
        <img
          :src="row.preview_image"
          alt="商品圖片"
          class="product-img"
        />
      </template>
      <template #status="{ row }">
        <switch_el
          v-model="row.status"
          yes="上架"
          no="下架"
          @toggle="(v) => updateStatus(row.number, v)"
        />
      </template>
      <!-- 編輯按鈕 -->
      <template #icon="{ row }">
        <Icon @click="goToDetail(row)" />
      </template>
    </Table>
  </div>
</template>

<style scoped>
  .slider::after {
    content: '上架';
    position: absolute;
    right: 6px;
    top: 2px;
    font-size: 12px;
    color: white;
    pointer-events: none;
  }

  input:checked + .slider::after {
    content: '下架';
    left: 6px;
    right: auto;
  }
</style>
