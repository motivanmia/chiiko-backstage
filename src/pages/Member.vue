<script setup>
  import table_el from '@/components/Table.vue';
  import { ref } from 'vue';

  const columns = ref([
    { prop: 'number', label: '會員編號', width: 100 },
    { prop: 'name', label: '姓名', width: 100 },
    { prop: 'text', label: '暱稱' },
    { prop: 'email', label: 'E-mail' },
    { prop: 'date', label: '加入日期' },
    { prop: 'status', label: '會員狀態', type: 'status' },
    { prop: 'icon', label: '詳細', type: 'button', width: 60 },
  ]);

  const tableData = ref([
    {
      number: 'US001',
      name: '王小明',
      text: '花媽媽烹飪教室',
      email: 'flower@gmail.com',
      date: '2025-05-20',
    },
    {
      number: 'US002',
      name: '陳小華',
      text: '花媽媽烹飪教室',
      email: 'flower@gmail.com',
      date: '2025-05-20',
    },
    {
      number: 'US003',
      name: '陳小華',
      text: '花媽媽烹飪教室',
      email: 'flower@gmail.com',
      date: '2025-05-20',
    },
    {
      number: 'US004',
      name: '陳小華',
      text: '花媽媽烹飪教室',
      email: 'flower@gmail.com',
      date: '2025-05-20',
    },
    {
      number: 'US005',
      name: '陳小華',
      text: '花媽媽烹飪教室',
      email: 'flower@gmail.com',
      date: '2025-05-20',
    },
    {
      number: 'US006',
      name: '陳小華',
      text: '花媽媽烹飪教室',
      email: 'flower@gmail.com',
      date: '2025-05-20',
    },
    {
      number: 'US007',
      name: '陳小華',
      text: '花媽媽烹飪教室',
      email: 'flower@gmail.com',
      date: '2025-05-20',
    },
    {
      number: 'US008',
      name: '陳小華',
      text: '花媽媽烹飪教室',
      email: 'flower@gmail.com',
      date: '2025-05-20',
    },
  ]);
</script>

<template>
  <table_el
    :table-data="tableData"
    :columns="columns"
  />
</template>

<style lang="scss" scoped></style>
