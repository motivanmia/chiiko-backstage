<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { columns } from '@/constants/order';
  import { getOrders } from '@/api/fetch';
  import { useFilter } from '@/composables/useFilter';
  import { useToastStore } from '@/stores/Toast';

  import TheHeader from '@/components/common/TheHeader.vue';
  import Table_el from '@/components/Table.vue';

  const router = useRouter();

  const toastStore = useToastStore();
  const { showToast } = toastStore;

  const searchOption = ref('all');
  const searchText = ref('');

  const tableData = ref([]);

  // 用 optionsGenerator 動態生成選項
  const optionsGenerator = (data) => {
    const uniqueStatuses = [...new Set(data.map((item) => item.status))];
    return uniqueStatuses.map((status) => ({
      label: status,
      value: status,
      children: [],
    }));
  };

  const { dropOptions, filterData } = useFilter(
    tableData,
    searchOption,
    searchText,
    optionsGenerator,
    'status',
    undefined,
  );

  const goOrderDetail = ({ order_id }) => {
    router.push({ path: `/order-detail/${order_id}` });
  };

  // 將 API 回傳資料格式映射成前端表格需要的欄位
  const formatOrders = (data) => {
    return data.map((item) => ({
      order_id: item.order_id,
      member_id: item.user_id,
      date: item.created_at.split(' ')[0],
      price: item.final_price,
      status: item.order_status_text,
    }));
  };

  const loadOrders = async () => {
    try {
      const { data } = await getOrders();
      if (data.status === 'success' && Array.isArray(data.data)) {
        tableData.value = formatOrders(data.data); // 格式化後放入表格
      } else {
        showToast('取得訂單資料格式錯誤', 'error');
        tableData.value = [];
      }
    } catch (error) {
      showToast('取得訂單資料失敗', 'error');
      tableData.value = [];
    }
  };

  onMounted(() => {
    loadOrders();
  });
</script>

<template>
  <div class="order">
    <TheHeader
      title="訂單管理"
      v-model:searchOption="searchOption"
      v-model:searchText="searchText"
      :dropOptions="dropOptions"
      :show-increase-button="false"
    />
    <Table_el
      :table-data="filterData"
      :columns="columns"
      @button-click="goOrderDetail($event)"
    ></Table_el>
  </div>
</template>

<style lang="scss" scoped></style>
