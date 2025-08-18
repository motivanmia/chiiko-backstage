<script setup>
  import { ref } from 'vue';
  import { useFilter } from '@/composables/useFilter';
  import Table from '@/components/Table.vue';
  import TheHeader from '@/components/common/TheHeader.vue';

  const searchOption = ref([]);
  const searchText = ref('');

  // 內容
  const columns = ref([
    { prop: 'number', label: '食譜編號', width: 200 },
    { prop: 'category', label: '食譜分類', width: 150 },
    { prop: 'name', label: '食譜名稱' },
    { prop: 'author', label: '作者' },
    { prop: 'date', label: '新增日期', width: 150 },
    { prop: 'status', label: '狀態', width: 200 },
    { prop: 'icon', label: '詳細', type: 'button-detail', width: 100 },
    { prop: 'del', label: '刪除', type: 'button-del', width: 100 },
  ]);

  const tableData = ref([
    {
      number: 'R01',
      category: '家庭聚餐',
      name: '法式焦糖布丁',
      author: '管理員',
      date: '2025-07-07',
      status: '草稿',
    },
    {
      number: 'R01',
      category: '減糖料理',
      name: '櫛瓜豆皮蛋餅',
      author: '塔馬可吉',
      date: '2025-07-07',
      status: '待審核',
    },
    {
      number: 'R01',
      category: '一人料理',
      name: '柚子胡椒雞肉蕎麥麵',
      author: '管理員',
      date: '2025-07-07',
      status: '已發布',
    },
  ]);

  // 定義選項生成邏輯
  const optionsGenerator = (data) => {
    // 定義主選項
    const mainOptions = [
      { label: '管理員', value: '管理員' },
      { label: '會員', value: ['not', '管理員'] },
    ];

    // 為每個主選項生成子選項
    const secOptions = mainOptions.map((mainOpt) => {
      let subChildren = [];

      if (mainOpt.value === '管理員') {
        // 主選項是admin時 篩選出author為管理員的資料
        const adminData = data.filter((item) => item.author === '管理員');
        // 依據資料項目生成子選項(狀態)
        const uniqueName = [...new Set(adminData.map((item) => item.status))];
        subChildren = uniqueName.map((status) => ({
          label: status,
          value: status,
        }));
      } else if (mainOpt.value !== '管理員') {
        // 主選項是non-admin時 篩選出author不是管理員的資料
        const nonAdminData = data.filter((item) => item.author !== '管理員');
        // 依據資料項目生成子選項(狀態)
        const uniqueName = [...new Set(nonAdminData.map((item) => item.status))];
        subChildren = uniqueName.map((status) => ({
          label: status,
          value: status,
        }));
      }
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
    'author',
    'status',
  );
</script>

<template>
  <TheHeader
    title="食譜管理"
    v-model:searchOption="searchOption"
    v-model:searchText="searchText"
    :dropOptions="dropOptions"
  />
  <Table
    :table-data="filterData"
    :columns="columns"
  />
</template>

<style lang="scss" scoped></style>
