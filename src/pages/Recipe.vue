<script setup>
  // 1. 引入改造後的燈箱元件，並改個更適合的名字
  import RecipeEditorModal from '@/pages/RecipeEditPage.vue';
  import { ref } from 'vue';
  import { useFilter } from '@/composables/useFilter';
  import Table from '@/components/Table.vue';
  import TheHeader from '@/components/common/TheHeader.vue';

  // 2. 建立一個 ref 來控制燈箱的顯示/隱藏
  const isEditorModalVisible = ref(false);

  // --- 您原本的 script 內容維持不變 ---
  const searchOption = ref([]);
  const searchText = ref('');
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
  const tableData = ref([]);
  const optionsGenerator = (data) => {
    const mainOptions = [
      { label: '管理員', value: '管理員' },
      { label: '會員', value: ['not', '管理員'] },
    ];
    return mainOptions.map((mainOpt) => {
      const sourceData =
        mainOpt.value === '管理員'
          ? data.filter((item) => item.author === '管理員')
          : data.filter((item) => item.author !== '管理員');
      const uniqueStatuses = [...new Set(sourceData.map((item) => item.status))];
      return {
        ...mainOpt,
        children: uniqueStatuses.map((status) => ({ label: status, value: status })),
      };
    });
  };
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
  <!-- 3. 將 @create 事件的行為，從「路由跳轉」改成「打開燈箱」 -->
  <TheHeader
    title="食譜管理"
    v-model:searchOption="searchOption"
    v-model:searchText="searchText"
    :dropOptions="dropOptions"
    @create="isEditorModalVisible = true"
  />
  <Table
    :table-data="filterData"
    :columns="columns"
  />

  <!-- 4. 在頁面底部放置燈箱元件，並用 v-if 控制 -->
  <!--    監聽從燈箱內部發射出來的 @close 事件，來關閉燈箱 -->
  <RecipeEditorModal
    v-if="isEditorModalVisible"
    @close="isEditorModalVisible = false"
  />
</template>

<style lang="scss" scoped></style>
