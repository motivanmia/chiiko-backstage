<script setup>
  import RecipeEditorModal from '@/pages/RecipeEditPage.vue';
  import { ref, onMounted } from 'vue';
  import { useFilter } from '@/composables/useFilter';
  import Table from '@/components/Table.vue';
  import TheHeader from '@/components/common/TheHeader.vue';
  import axios from 'axios';

  // --- script setup 區塊完全不需要修改 ---

  const isEditorModalVisible = ref(false);

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

  onMounted(async () => {
    try {
      const res = await axios.get('http://localhost:8888/admin/recipe/list_recipes.php', {
        withCredentials: true,
      });

      if (res.data.status === 'success') {
        tableData.value = res.data.data.map((item) => ({
          ...item,
          authorType: item.manager_id ? '管理員' : '會員',
        }));
      } else {
        console.error('撈資料失敗：', res.data.message);
      }
    } catch (err) {
      console.error('API 錯誤：', err);
    }
  });

  const handleDeleteRecipe = async (row) => {
    const recipeId = row.number;
    const recipeName = row.name;

    if (
      !confirm(
        `您確定要刪除食譜「${recipeName}」(編號: ${recipeId}) 嗎？\n此操作將一併刪除所有相關步驟與食材，且無法復原。`,
      )
    ) {
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8888/admin/recipe/delete_recipe.php',
        { recipe_id: recipeId },
        { withCredentials: true },
      );

      if (res.data.status === 'success') {
        alert('刪除成功！');
        const index = tableData.value.findIndex((item) => item.number === recipeId);
        if (index !== -1) {
          tableData.value.splice(index, 1);
        }
      } else {
        alert(`刪除失敗：${res.data.message}`);
      }
    } catch (err) {
      console.error('API 刪除錯誤：', err);
      alert('刪除過程中發生網路或伺服器錯誤，請查看 console。');
    }
  };

  const optionsGenerator = (data) => {
    const mainOptions = [
      { label: '管理員', value: '管理員' },
      { label: '會員', value: '會員' },
    ];

    return mainOptions.map((mainOpt) => {
      if (mainOpt.label === '會員') {
        return {
          ...mainOpt,
          children: [
            { label: '已審核', value: '已審護' },
            { label: '未審核', value: '未審核' },
          ],
        };
      }

      if (mainOpt.label === '管理員') {
        const sourceData = data.filter((item) => item.authorType === '管理員');
        const uniqueStatuses = [...new Set(sourceData.map((item) => item.status))];
        return {
          ...mainOpt,
          children: uniqueStatuses.map((status) => ({ label: status, value: status })),
        };
      }

      return mainOpt;
    });
  };

  const { dropOptions, filterData } = useFilter(
    tableData,
    searchOption,
    searchText,
    optionsGenerator,
    'authorType',
    'status',
  );
</script>

<template>
  <!-- 表頭 (維持不變) -->
  <TheHeader
    title="食譜管理"
    v-model:searchOption="searchOption"
    v-model:searchText="searchText"
    :dropOptions="dropOptions"
    @create="isEditorModalVisible = true"
  />

  <!-- 表格 -->
  <!-- ✅ 【唯一的修改】將 @delete-row 改為 @del-click -->
  <Table
    :table-data="filterData"
    :columns="columns"
    @del-click="handleDeleteRecipe"
  />

  <!-- 燈箱 (維持不變) -->
  <RecipeEditorModal
    v-if="isEditorModalVisible"
    @close="isEditorModalVisible = false"
  />
</template>

<style lang="scss" scoped></style>
