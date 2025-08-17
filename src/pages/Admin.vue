<script setup>
  import table_el from '@/components/Table.vue';
  import { ref, computed } from 'vue';
  import TheHeader from '@/components/common/TheHeader.vue';

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

  const columns = ref([
    { prop: 'number', label: '管理員編號', width: 200 },
    { prop: 'name', label: '管理員名稱' },
    { prop: 'email', label: '帳號' },
    { prop: 'authority', label: '管理權限' },
    { prop: 'status', label: '狀態', type: 'status', width: 200 },
    { prop: 'icon', label: '詳細', type: 'button-detail', width: 100 },
  ]);

  const categoryOptions = [
    { label: '全部', value: 'all' },
    { label: '正常', value: 'Active' },
    { label: '停權', value: 'Disabled' },
  ];

  const tableData = ref([
    {
      number: 'A0001',
      name: '王小明',
      email: 'flower@gmail.com',
      authority: '管理員',
    },
    {
      number: 'A0002',
      name: '陳小華',
      email: 'flower@gmail.com',
      authority: '管理員',
    },
    {
      number: 'A0003',
      name: '陳小華',
      email: 'flower@gmail.com',
      authority: '管理員',
    },
    {
      number: 'A0004',
      name: '陳小華',
      email: 'flower@gmail.com',
      authority: '管理員',
    },
    {
      number: 'A0005',
      name: '陳小華',
      email: 'flower@gmail.com',
      authority: '管理員',
    },
    {
      number: 'A0006',
      name: '陳小華',
      email: 'flower@gmail.com',
      authority: '管理員',
    },
    {
      number: 'A0007',
      name: '陳小華',
      email: 'flower@gmail.com',
      authority: '管理員',
    },
    {
      number: 'A0008',
      name: '陳小華',
      email: 'flower@gmail.com',
      authority: '管理員',
    },
  ]);
</script>

<template>
  <TheHeader
    title="權限管理"
    v-model:searchOption="searchOption"
    v-model:searchText="searchText"
    :dropOptions="categoryOptions"
  />
  <table_el
    :table-data="filteredTableData"
    :columns="columns"
  />
</template>

<style lang="scss" scoped></style>
