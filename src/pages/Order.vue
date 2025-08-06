<script setup>
  import { ref, computed, watch } from 'vue';
  import Title_el from '@/components/common/Title.vue';
  import DropMenu from '@/components/common/DropMenu.vue';
  import Search from '@/components/common/Search.vue';
  import Table_el from '@/components/Table.vue';

  const searchOption = ref('all');

  const dropOptions = ref([
    { value: 'all', label: '所有訂單' },
    { value: 'pending', label: '待確認' },
    { value: 'shipped', label: '已出貨' },
    { value: 'cancel', label: '取消' },
    { value: 'completed', label: '已完成' },
  ]);

  const columns = ref([
    { prop: 'order_id', label: '訂單編號' },
    { prop: 'member_id', label: '會員編號' },
    { prop: 'date', label: '訂單日期' },
    { prop: 'price', label: '金額' },
    { prop: 'status', label: '訂單狀態' },
    { prop: 'icon', label: '內容', type: 'button', width: 60 },
  ]);

  const tableData = ref([
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '已出貨',
    },
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '取消',
    },
    {
      order_id: '0025007003',
      member_id: 'G0002',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0002',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0002',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '已出貨',
    },
    {
      order_id: '0025007003',
      member_id: 'G0001',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '待確認',
    },
    {
      order_id: '0025007003',
      member_id: 'G0003',
      date: '2025-05-20',
      price: 'NT$ 1300',
      status: '已完成',
    },
  ]);

  const filteredTableData = computed(() => {
    let result = tableData.value;

    const selected = Array.isArray(searchOption.value) ? searchOption.value[0] : searchOption.value;

    // 篩選訂單狀態
    if (selected !== 'all') {
      const selectedOption = dropOptions.value.find((option) => option.value === selected);
      if (selectedOption) {
        result = result.filter((item) => item.status === selectedOption.label);
      }
    }

    return result;
  });
</script>

<template>
  <Title_el title="訂單管理" />
  <div class="order__wrap">
    <DropMenu
      :options="dropOptions"
      v-model="searchOption"
    />
    <Search />
  </div>
  <Table_el
    :table-data="filteredTableData"
    :columns="columns"
  />
</template>

<style lang="scss" scoped>
  .order {
    &__wrap {
      @include flex($jc: space-between);
      padding: px(20) 0;
      border-bottom: px(1) solid color(backgroundColor, recipe);
    }
  }
</style>
