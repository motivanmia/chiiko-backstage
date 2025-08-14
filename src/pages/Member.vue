<script setup>
  import table_el from '@/components/Table.vue';
  import { ref } from 'vue';
  import TheHeader from '@/components/common/TheHeader.vue';

  const columns = ref([
    { prop: 'number', label: '會員編號', width: 200 },
    { prop: 'name', label: '姓名', width: 200 },
    { prop: 'text', label: '暱稱' },
    { prop: 'email', label: 'E-mail' },
    { prop: 'date', label: '加入日期' },
    { prop: 'status', label: '會員狀態', type: 'status', width: 200 },
    { prop: 'icon', label: '詳細', type: 'button-detail', width: 100 },
  ]);

  const categoryOptions = [
    { label: '全部', value: 'all' },
    { label: '正常', value: 'Active' },
    { label: '停權', value: 'Disabled' },
  ];

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
  const showDetail = ref(false);
  const currentRow = ref(null);

  // 開啟 / 關閉
  function openDetail(row) {
    currentRow.value = row;
    showDetail.value = true;
    // 可選：鎖住背景卷軸
    document.body.style.overflow = 'hidden';
  }
  function closeDetail() {
    showDetail.value = false;
    currentRow.value = null;
    document.body.style.overflow = '';
  }
</script>

<template>
  <TheHeader
    title="會員管理"
    :dropOptions="categoryOptions"
    v-model:searchOption="searchOption"
    v-model:searchText="searchText"
    :show-increase-button="false"
  />
  <table_el
    :table-data="tableData"
    :columns="columns"
    @button-click="openDetail"
  />
  <transition name="modal-fade">
    <div
      v-if="showDetail"
      class="modal-overlay"
      @click.self="closeDetail"
    >
      <div class="modal-content">
        <h2 class="modal-title">會員資料</h2>

        <div
          v-if="currentRow"
          class="modal-body"
        >
          <div class="row">
            會員編號：
            <span>{{ currentRow.number }}</span>
          </div>
          <div class="row">
            姓名：
            <span>{{ currentRow.name }}</span>
          </div>
          <div class="row">
            暱稱：
            <span>{{ currentRow.text }}</span>
          </div>
          <div class="row">
            Email：
            <span>{{ currentRow.email }}</span>
          </div>
          <div class="row">
            電話：
            <span>{{}}</span>
          </div>
          <div class="row">
            地址：
            <span>{{}}</span>
          </div>
          <div class="row">
            加入日期：
            <span>{{ currentRow.date }}</span>
          </div>
          <div class="row">
            會員狀態：
            <span>{{ currentRow.status }}</span>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn"
            @click="closeDetail"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
  /* Overlay */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 24px;
  }

  /* Panel */
  .modal-content {
    position: relative;
    width: min(500px, 100%);
    background: #fefbf1;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    border: 1px solid#d6b59c;
    color: color(text, dark);
  }

  /* Header */
  .modal-title {
    margin: 0;
    padding: 16px 56px 12px 20px;
    font-size: 20px;
    line-height: 1.2;
    color: color(text, dark);
    background: #d6b59c;
    border-bottom: 1px solid #eee;
  }

  /* Body / Footer */
  .modal-body {
    padding: 16px 20px;
  }
  .modal-body .row {
    display: flex;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid#d6b59c;
    margin-top: 5px;
  }
  .answer{
    margin-top: 10px;
    padding-left: 20px;
  }
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 20px 16px;
  }

  /* Button */
  .btn {
    padding: 8px 20px;
    border-radius: 20px;
    border: 1px solid #d97c48;
    background: #fff;
    color: color(button, main);
    cursor: pointer;
    margin: 0 auto;
  }
  .btn:hover {
    background: #d6b59c;
    color: color(text, light);
    border: 1px solid #d6b59c;
  }

  /* Transition */
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.18s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
</style>
