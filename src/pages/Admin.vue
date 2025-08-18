<script setup>
  import { ref } from 'vue';
  import { useFilter } from '@/composables/useFilter';
  import { columns } from '@/constants/admin';
  import { tableData as initialTableData } from '@/assets/data/adminData';
  import TheHeader from '@/components/common/TheHeader.vue';
  import table_el from '@/components/Table.vue';

  const tableData = ref(initialTableData);

  const searchOption = ref('all');
  const searchText = ref('');

  // 定義選項生成邏輯
  const optionsGenerator = (data) => {
    const uniqueStatuses = [...new Set(data.map((item) => item.status))];
    return uniqueStatuses.map((status) => ({
      label: status === 'Active' ? '正常' : '停權',
      value: status,
      childern: [],
    }));
  };

  // 定義篩選邏輯
  const filterKey = undefined;

  // 使用composable生成選項
  const { dropOptions, filterData } = useFilter(
    tableData,
    searchOption,
    searchText,
    optionsGenerator,
    filterKey,
  );

  const handleStatusToggle = ({ rowData, newStatus }) => {
    const item = tableData.value.find((item) => item.number === rowData.number);
    if (item) {
      item.status = newStatus;
    }
  };
</script>

<template>
  <TheHeader
    title="權限管理"
    v-model:searchOption="searchOption"
    v-model:searchText="searchText"
    :dropOptions="dropOptions"
  />
  <table_el
    yes="正常"
    no="停權"
    @toggle-status="handleStatusToggle"
    :table-data="filterData"
    :columns="columns"
  />
</template>

<style lang="scss" scoped></style>
