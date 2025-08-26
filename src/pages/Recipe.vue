<template>
  <TheHeader
    title="食譜管理"
    v-model:searchOption="searchOption"
    v-model:searchText="searchText"
    :dropOptions="dropOptions"
    @create="handleCreateNew"
  />

  <Table
    :table-data="filterData"
    :columns="columns"
    @del-click="handleDeleteRecipe"
    @button-click="handleViewDetails"
  />

  <!-- 燈箱 A：給管理員編輯自己的文章 -->
  <RecipeEditorModal
    v-if="isEditorModalVisible"
    :initial-data="currentRecipeData"
    @close="handleCloseModal"
    @save-success="refreshTableData"
  />

  <!-- 燈箱 B：給管理員審核會員的文章 -->
  <DetailModal
    v-if="isDetailModalVisible"
    :show="isDetailModalVisible"
    type="recipe"
    title="審核食譜"
    :data="currentRecipeData"
    @close="handleCloseModal"
  />
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useFilter } from '@/composables/useFilter';
  import Table from '@/components/Table.vue';
  import TheHeader from '@/components/common/TheHeader.vue';
  import axios from 'axios';
  import RecipeEditorModal from '@/pages/RecipeEditPage.vue';
  import DetailModal from '@/components/DetailModal.vue';

  // --- 狀態管理 (保持不變) ---
  const isEditorModalVisible = ref(false);
  const isDetailModalVisible = ref(false);
  const currentRecipeData = ref(null);
  const tableData = ref([]);

  // --- useFilter 用的狀態 (保持不變) ---
  const searchOption = ref([]);
  const searchText = ref('');

  // --- 表格欄位定義 (保持不變) ---
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

  // 【✅ 核心修正 ✅】
  // 使用一個常數來管理 API 基礎路徑，避免重複打錯
  const API_BASE_URL = 'http://localhost:8888';

  // --- 資料獲取與刷新 ---
  const fetchRecipeList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/recipe/list_recipes.php`, {
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
  };
  onMounted(fetchRecipeList);
  const refreshTableData = () => fetchRecipeList();

  // --- useFilter (保持不變) ---
  const optionsGenerator = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const mainOptions = [
      { label: '管理員', value: '管理員' },
      { label: '會員', value: '會員' },
    ];
    return mainOptions.map((mainOpt) => {
      const sourceData = data.filter((item) => item.authorType === mainOpt.value);
      const uniqueStatuses = [...new Set(sourceData.map((item) => item.status))];
      const children = uniqueStatuses.map((status) => ({ label: status, value: status }));
      return { ...mainOpt, children };
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

  // --- 事件處理 ---
  const handleDeleteRecipe = async (row) => {
    const recipeId = row.number;
    const recipeName = row.name;
    if (!confirm(`您確定要刪除食譜「${recipeName}」(編號: ${recipeId}) 嗎？`)) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/admin/recipe/delete_recipe.php`,
        { recipe_id: recipeId },
        { withCredentials: true },
      );
      if (res.data.status === 'success') {
        alert('刪除成功！');
        fetchRecipeList();
      } else {
        alert(`刪除失敗：${res.data.message}`);
      }
    } catch (err) {
      console.error('API 刪除錯誤：', err);
      alert('刪除過程中發生錯誤。');
    }
  };

  const handleViewDetails = async (row) => {
    const recipeId = row.number;
    if (!recipeId) return alert('無效的食譜編號');
    try {
      // 確保這裡的 URL 也是正確的
      const res = await axios.get(
        `${API_BASE_URL}/admin/recipe/fetch_recipe_details.php?recipe_id=${recipeId}`,
        { withCredentials: true },
      );
      if (res.data.status === 'success') {
        currentRecipeData.value = res.data.data;
        if (row.authorType === '管理員') {
          isEditorModalVisible.value = true;
        } else {
          isDetailModalVisible.value = true;
        }
      } else {
        alert(`獲取詳細資料失敗：${res.data.message}`);
      }
    } catch (err) {
      console.error('API 獲取詳細資料錯誤：', err);
      alert('獲取詳細資料時發生錯誤。');
    }
  };

  const handleCreateNew = () => {
    currentRecipeData.value = null;
    isEditorModalVisible.value = true;
  };

  const handleCloseModal = () => {
    isEditorModalVisible.value = false;
    isDetailModalVisible.value = false;
    currentRecipeData.value = null;
  };
</script>

<style lang="scss" scoped></style>
