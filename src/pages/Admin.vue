<script setup>
  import table_el from '@/components/Table.vue';
  import { ref } from 'vue';
  import TheHeader from '@/components/common/TheHeader.vue';

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
    :dropOptions="categoryOptions"
  />
  <table_el
    :table-data="tableData"
    :columns="columns"
  />
</template>

<style lang="scss" scoped></style>
