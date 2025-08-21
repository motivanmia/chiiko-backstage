<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useFilter } from '@/composables/useFilter';
  import Table from '@/components/Table.vue';
  import TheHeader from '@/components/common/TheHeader.vue';
  import { useIngredientStore } from '@/stores/Ingredient';
  import { useIngredientCategoryStore } from '@/stores/IngredientCategory';
  const ingredient = useIngredientStore();
  const categoryStore = useIngredientCategoryStore();

  import switch_el from '@/components/Switch.vue';
  import Icon from '@/components/common/Icon.vue';

  const API_BASE = import.meta.env.VITE_API_BASE;
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
  const optionsGenerator = () =>
    categoryStore.selectOptions.map((o) => ({
      label: o.label,
      value: String(o.value),
      children: [],
    }));
  // console.log(categoryStore.selectOptions);

  const searchOption = ref(['all']);
  const searchText = ref('');

  // 提供 tableData 給 useFilter（保持 reactivity）
  const tableDataRef = computed(() => ingredient.tableRows);

  // 套用 useFilter（單層）
  const { dropOptions, filterData } = useFilter(
    tableDataRef, // tableDataRef
    searchOption, // searchOptionRef（陣列）
    searchText, // searchTextRef
    optionsGenerator, // 生成選項
    'categoryId', // 第一層對應欄位 key
    undefined, // 單層：第二層給 undefined
  );

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

  const updatingId = ref(null);
  async function updateStatus(ingredientNumber, newStatus) {
    if (updatingId.value === ingredientNumber) return; // 避免重複點擊
    updatingId.value = ingredientNumber;

    // 先改前端，失敗再回滾
    const row = ingredient.tableRows.find((r) => r.number === ingredientNumber);
    const prev = row ? row.status : null;
    if (row) row.status = newStatus;

    try {
      const res = await fetch(`${API_BASE}/school/patch_ingredient.php`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredient_id: Number(ingredientNumber), // 後端用 id
          status: Number(newStatus), // 0 / 1
        }),
      });
      const raw = await res.text();
      if (!res.ok) throw new Error(raw.slice(0, 200));
      const data = JSON.parse(raw);
      if (data.status !== 'success') throw new Error(data.message || '更新失敗');
    } catch (err) {
      if (row && prev != null) row.status = prev; // 回滾
      alert(`更新失敗：${err.message || err}`);
    } finally {
      updatingId.value = null;
    }
  }
</script>

<template>
  <div class="ingredient-board">
    <TheHeader
      title="食材管理"
      v-model:searchOption="searchOption"
      v-model:searchText="searchText"
      :dropOptions="dropOptions"
      @create="goCreate"
    />
  </div>

  <div class="ingredient-board__contents">
    <Table
      :table-data="filterData"
      :columns="columns"
      :loading="ingredient.loading"
      @edit-click="goToDetail"
      @del-click="onDelete"
      yes="顯示"
      no="隱藏"
    >
      <template #status="{ row }">
        <switch_el
          v-model="row.status"
          yes="顯示"
          no="隱藏"
          @toggle="(v) => updateStatus(row.number, v)"
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
