<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  import Table from '@/components/Table.vue';
  import TheHeader from '@/components/common/TheHeader.vue';
  import { useIngredientStore } from '@/stores/Ingredient';
  import { useIngredientCategoryStore } from '@/stores/IngredientCategory';
  const ingredient = useIngredientStore();
  const categoryStore = useIngredientCategoryStore();

  import switch_el from '@/components/Switch.vue';
  import Icon from '@/components/common/Icon.vue';

  const API_BASE = import.meta.env.VITE_API_URL;
  // console.log(API_BASE);

  async function deleteById(id) {
    const res = await fetch(
      `${API_BASE}/school/delete_ingredient.php?ingredient_id=${encodeURIComponent(String(id))}`,
      {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
        // 若後端用 cookie/session 驗證，加上：
        // credentials: 'include',
      },
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.status !== 'success') {
      throw new Error(json?.message || '刪除失敗');
    }
    return json;
  }

  onMounted(async () => {
    await Promise.all([ingredient.loadIngredients(), categoryStore.loadCategories()]);
  });

  const router = useRouter();
  function goToDetail(row) {
    // row 來自 tableRows，已經有 number
    router.push({ name: 'IngredientDetail', params: { id: row.number } });
  }
  function goCreate() {
    router.push({ name: 'IngredientDetail', params: { id: 'new' } });
  }
  const categoryOptions = computed(() => [
    { label: '全部', value: 'all' },
    ...categoryStore.selectOptions,
  ]);

  const searchOption = ref('all');
  const searchText = ref('');
  // console.log(selectOptions.value);

  const filteredTableData = computed(() => {
    const cat = String(searchOption.value || 'all');
    // console.log(cat);

    const kw = searchText.value.trim().toLowerCase();

    let rows = ingredient.tableRows; // ← 用 store
    if (cat !== 'all') rows = rows.filter((r) => r.categoryId === cat);

    if (!kw) return rows;
    return rows.filter((r) => {
      const nameHit = String(r.name).toLowerCase().includes(kw);
      const numberHit = String(r.number).toLowerCase().includes(kw);
      return nameHit || numberHit;
    });
  });

  // 表格欄位
  const columns = ref([
    { prop: 'number', label: '食材編號', width: 200 },
    { prop: 'category', label: '食材分類', width: 250 },
    { prop: 'name', label: '食材名稱' },
    { prop: 'img', label: '食材圖片', type: 'image' },
    { prop: 'status', label: '狀態', type: 'status', width: 200 },
    { prop: 'icon', label: '詳細', type: 'button-edit', width: 100 },
    { prop: 'del', label: '刪除', type: 'button-del', width: 100 },
  ]);

  let deleting = false;

  async function onDelete(row) {
    if (deleting) return;
    const id = row.number; // 或 row.id，看你後端的主鍵

    // 瀏覽器內建確認框
    const ok = window.confirm(`確認刪除編號「${id}」的食材？`);
    if (!ok) return;

    deleting = true;
    try {
      await deleteById(id); // 打後端 DELETE
      await ingredient.loadIngredients(); // 重新載入列表資料
      window.alert('刪除成功'); // 成功提示
    } catch (err) {
      window.alert(err?.message || '刪除失敗'); // 失敗提示
    } finally {
      deleting = false;
    }
  }
</script>

<template>
  <div class="ingredient-board">
    <TheHeader
      title="食材管理"
      v-model:searchOption="searchOption"
      v-model:searchText="searchText"
      :dropOptions="categoryOptions"
      @create="goCreate"
    />
  </div>

  <div class="ingredient-board__contents">
    <Table
      :table-data="filteredTableData"
      :columns="columns"
      :loading="ingredient.loading"
      @edit-click="goToDetail"
      @del-click="onDelete"
      yes="顯示"
      no="隱藏"
    >
      <template #status>
        <switch_el />
      </template>
      <template #del>
        <Icon
          class="del-button"
          icon-name="del"
        />
      </template>
    </Table>

    <p
      v-if="ingredient.error"
      class="error"
    >
      {{ ingredient.error }}
    </p>
  </div>
</template>

<style lang="scss" scoped></style>
