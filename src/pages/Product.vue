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
      status: 'on',
      icon: '',
      del: '',
    })),
  );

  const router = useRouter();

  const categoryOptions = [
    { label: '已上架', value: 'on' },
    { label: '已下架', value: 'off' },
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
    { prop: 'number', label: '商品編號', width: 110 },
    { prop: 'category', label: '商品分類', width: 110 },
    { prop: 'img', label: '商品預覽圖片', type: 'image' },
    { prop: 'name', label: '商品名稱', width: 200 },
    { prop: 'price', label: '單價', width: 100 },
    { prop: 'status', label: '商品狀態', type: 'status', width: 140 },
    { prop: 'icon', label: '編輯', type: 'button-detail', width: 60 },
    { prop: 'del', label: '刪除', type: 'button-del', width: 60 },
  ]);
</script>

<template>
  <div class="ingredient-board">
    <TheHeader
      title="商品管理"
      v-model:searchOption="searchOption"
      v-model:searchText="searchText"
      :dropOptions="categoryOptions"
      :show-increase-button="true"
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
          yes="上架"
          no="下架"
        />
      </template>
      <template #del>
        <Icon
          class="del-button"
          icon-name="del"
        />
      </template>
      <template #icon="{ row }">
        <Icon @click="goToDetail(row)" />
      </template>
    </Table>
  </div>
</template>

<style scoped>
  .slider::after {
    content: '上架';
    position: absolute;
    right: 6px;
    top: 2px;
    font-size: 12px;
    color: white;
    pointer-events: none;
  }

  input:checked + .slider::after {
    content: '下架';
    left: 6px;
    right: auto;
  }
</style>
