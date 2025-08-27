<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Table from '@/components/Table.vue';
  import TheHeader from '@/components/common/TheHeader.vue';
  import { useFilter } from '@/composables/useFilter';
  import { useToastStore } from '@/stores/Toast';
  import { getProducts, patchProductsActive } from '@/api/fetch';

  const toastStore = useToastStore();
  const { showToast } = toastStore;

  const router = useRouter();
  function goToDetail(row) {
    // row 來自 tableRows，已經有 product_id
    console.log('收到的 row 資料:', row);
    router.push({ name: 'ProductDetail', params: { id: row.product_id } });
  }
  function goCreate() {
    router.push({ name: 'ProductDetail', params: { id: 'new' } });
  }

  // 原始資料
  const useMockData = false;

  const tableData = ref([]);
  const searchOption = ref([]);
  const searchText = ref('');

  // 表格欄位
  const columns = ref([
    { prop: 'product_id', label: '商品編號', width: 200 },
    { prop: 'category_name', label: '商品分類', width: 250 },
    { prop: 'preview_image', label: '商品預覽圖片', type: 'image' },
    { prop: 'name', label: '商品名稱' },
    { prop: 'unit_price', label: '單價' },
    { prop: 'is_active', label: '狀態', type: 'status', width: 200 },
    { prop: 'icon', label: '編輯', type: 'button-edit', width: 100 },
  ]);

  // 訊息提示相關的 ref
  const showError = ref(false);
  const errorMessage = ref('');

  const handleMessage = (message) => {
    showError.value = true;
    errorMessage.value = message;
    setTimeout(() => (showError.value = false), 2000);
  };

  // 定義選項生成邏輯
  const optionsGenerator = (data) => {
    // 定義主選項
    const mainOptions = [
      { label: '鍋具/鍋鏟', value: '鍋具/鍋鏟' },
      { label: '烤箱/氣炸鍋', value: '烤箱/氣炸鍋' },
      { label: '刀具/砧板', value: '刀具/砧板' },
      { label: '廚房小物', value: '廚房小物' },
    ];

    // 為每個主選項生成子選項
    const secOptions = mainOptions.map((mainOpt) => {
      // 過濾出與主選項相符的資料
      const filteredData = data.filter((item) => item.category_name === mainOpt.value);

      // 根據過濾後的資料生成status子選項
      const uniqueStatus = [...new Set(filteredData.map((item) => item.is_active))];

      const subChildren = uniqueStatus.map((is_active) => ({
        label: is_active === 0 ? '上架' : '下架',
        value: is_active,
      }));
      return {
        ...mainOpt,
        children: subChildren,
      };
    });
    return secOptions;
  };

  // 使用composable生成選項
  const { dropOptions, filterData } = useFilter(
    tableData,
    searchOption,
    searchText,
    optionsGenerator,
    'category_name',
    'is_active',
  );

  // 統一狀態的值
  const productsStatus = (data) => {
    return data.map((item) => {
      // 檢查各種可能的正常狀態 (0, '0', false)
      const isNormal = item.is_active === 0 || item.is_active === '0' || item.is_active === false;
      const processedStatus = isNormal ? 0 : 1;
      return {
        ...item,
        is_active: processedStatus, // ✨ 這裡從 'status' 改為 'is_active'
      };
    });
  };

  // 引入api獲得商品資料
  async function fetchData() {
    try {
      const response = await getProducts();
      if (response && response.data && response.data.status === 'success') {
        tableData.value = productsStatus(response.data.data);
      } else {
        console.error('API 錯誤: 回傳資料格式不正確或為空');
        handleMessage('無法載入商品資料。');
      }
    } catch (error) {
      console.error('取得資料時發生錯誤:', error);
      handleMessage('無法連接到伺服器。');
    }
  }

  // 元件掛載後自動呼叫fetchData
  onMounted(() => {
    fetchData();
  });

  // 狀態切換
  const handleStatusToggle = async ({ rowData, newStatus }) => {
    const item = tableData.value.find((item) => item.product_id === rowData.product_id);

    if (!item) return;

    const originalStatus = item.is_active;
    item.is_active = newStatus;

    try {
      // ✨ 使用新的 patchProductsActive 函式，並傳遞正確的參數
      const response = await patchProductsActive(item.product_id, {
        product_id: item.product_id,
        is_active: newStatus,
      });

      if (response.data.status === 'success') {
        showToast(response.data.message || '狀態更新成功！');
      } else {
        item.is_active = originalStatus;
        showToast(response.data.message || '狀態更新失敗。');
      }
    } catch (error) {
      console.error('更新資料時發生錯誤:', error);
      if (item) item.is_active = originalStatus;
      if (error.response && error.response.data) {
        showToast(error.response.data.message);
      } else {
        showToast('無法連接到伺服器。');
      }
    }
  };
</script>

<template>
  <div class="ingredient-board">
    <TheHeader
      title="商品管理"
      v-model:searchOption="searchOption"
      v-model:searchText="searchText"
      :dropOptions="dropOptions"
      :show-increase-button="true"
      @create="goCreate"
    />
  </div>

  <div class="ingredient-board__contents">
    <Table
      yes="上架"
      no="下架"
      @toggle-status="handleStatusToggle"
      :table-data="filterData"
      :columns="columns"
      @edit-click="goToDetail"
    ></Table>
  </div>
</template>

<style scoped></style>
