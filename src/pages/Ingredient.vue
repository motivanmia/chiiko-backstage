<script setup>
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';

  import Table from '@/components/Table.vue';
  import TheHeader from '@/components/common/TheHeader.vue';
  import { ingredients } from '@/constants/ingredients.js';
  import switch_el from '@/components/Switch.vue';

  // 原始資料
  const tableData = ref(
    ingredients.map((item) => ({
      number: item.id,
      category: item.category, // e.g. 'vegetables' | 'meat'
      name: item.name,
      img: item.img?.[0] || '',
      status: '',
      icon: '',
      del: '',
    })),
  );

  const router = useRouter();
  function goToDetail(rowOrPayload) {
    // 若你的 Table 會回傳 { type, row }，可以這樣分流：
    const row = rowOrPayload?.row ?? rowOrPayload;
    // if (rowOrPayload?.type && rowOrPayload.type !== 'icon') return;
    router.push({ name: 'IngredientDetail', params: { id: row.number } });
  }

  const categoryOptions = [
    { label: '全部', value: 'all' },
    { label: '植物性食材', value: 'vegetables' },
    { label: '動物性食材', value: 'meat' },
  ];

  const searchOption = ref('all');
  const searchText = ref('');

  const filteredTableData = computed(() => {
    const rawCat = searchOption.value;
    // console.log(rawCat);

    const cat = typeof rawCat === 'array' && rawCat !== null ? rawCat.value : String(rawCat || '');
    // console.log(cat);

    const kw = searchText.value.trim().toLowerCase();

    // 1) 先按分類（就算沒有關鍵字也要先篩）
    let rows = tableData.value;
    if (cat && cat !== 'all') {
      rows = rows.filter((r) => r.category === cat);
    }

    // 2) 再按關鍵字（這裡示範只搜名稱，要搜更多欄位就加）
    if (!kw) return rows;
    return rows.filter((r) => {
      const nameHit = String(r.name).toLowerCase().includes(kw);
      const numberHit = String(r.number).toLowerCase().includes(kw);
      return nameHit || numberHit;
    });
  });

  // 表格欄位
  const columns = ref([
    { prop: 'number', label: '食材編號', width: 140 },
    { prop: 'category', label: '食材分類', width: 140 },
    { prop: 'name', label: '食材名稱', width: 200 },
    { prop: 'img', label: '食材圖片', type: 'image' },
    { prop: 'status', label: '狀態', type: 'status', width: 140 },
    { prop: 'icon', label: '詳細', type: 'button', width: 60 },
    { prop: 'del', label: '刪除', type: 'button', width: 60 },
  ]);
</script>

<template>
  <div class="ingredient-board">
    <TheHeader
      title="食材管理"
      v-model:searchOption="searchOption"
      v-model:searchText="searchText"
      :dropOptions="categoryOptions"
      :show-increase-button="false"
    />
  </div>

  <div class="ingredient-board__contents">
    <Table
      :table-data="filteredTableData"
      :columns="columns"
      @button-click="goToDetail"
    >
      <template #status>
        <switch_el
          yes="顯示"
          no="隱藏"
        />
      </template>
      <template #del>
        <Icon
          class="del-button"
          icon-name="del"
        />
      </template>
    </Table>
  </div>
</template>

<style lang="scss" scoped></style>
