<script setup>
  import { ref } from 'vue';
  import { useFilter } from '@/composables/useFilter';
  import { columns } from '@/constants/admin';
  import { tableData as initialTableData } from '@/assets/data/adminData';
  import TheHeader from '@/components/common/TheHeader.vue';
  import table_el from '@/components/Table.vue';
  // 引入新增的彈窗元件
  import AddAdminModal from '@/components/users/AddAdminModal.vue';

  const showSignin = ref(false); // 顯示新增成功提示
  const showError = ref(false);//新增錯誤提示訊息
  const errorMessage = ref('');

  const signinSuccess = () => {
    showSignin.value = true;
    setTimeout(() => {
      showSignin.value = false;
    }, 2000);
  };

  const handleMessage = (message) => {
    showError.value = true;
    errorMessage.value = message;
    setTimeout(() => (showError.value = false), 2000);
  };

  const tableData = ref(initialTableData);

  const searchOption = ref([]);
  const searchText = ref('');

  const isModalVisible = ref(false); //控制新增的彈窗顯示

  // 定義選項生成邏輯
  const optionsGenerator = (data) => {
    const uniqueStatuses = [...new Set(data.map((item) => item.status))];
    return uniqueStatuses.map((status) => ({
      label: status === 'Active' ? '正常' : '停權',
      value: status,
      childern: [],
    }));
  };

  // 使用composable生成選項
  const { dropOptions, filterData } = useFilter(
    tableData,
    searchOption,
    searchText,
    optionsGenerator,
    'status',
    undefined,
  );

  const handleStatusToggle = ({ rowData, newStatus }) => {
    const item = tableData.value.find((item) => item.number === rowData.number);
    if (item) {
      item.status = newStatus;
    }
  };
</script>

<template>
  
  <TheHeader
    title="權限管理"
    v-model:searchOption="searchOption"
    v-model:searchText="searchText"
    :dropOptions="dropOptions"
    @create="isModalVisible = true"
  />
  <table_el
    yes="正常"
    no="停權"
    @toggle-status="handleStatusToggle"
    :table-data="filterData"
    :columns="columns"
  />
  <AddAdminModal
    v-if="isModalVisible"
    @close="isModalVisible = false"
    @add-success="signinSuccess"
    @add-failure="handleMessage"
    @psw-error="handleMessage"
    id="AddAdminModal"
  />
  <transition name="fade">
    <div
      v-if="showSignin"
      id="showSignin_message"
    >
      <div class="toast">新增成功！</div>
    </div>
  </transition>
  <transition name="fade">
    <div v-if="showError" class="toast_error">{{ errorMessage }}</div>
  </transition>
</template>

<style lang="scss" scoped>
  // #showSignin_message {
  //   position: fixed;
  //   z-index: 20;
  //   background-color: rgb(0, 0, 0, 0.3);
  //   width: 100%;
  //   height: 100vh;
  // }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
  .toast {
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    background: color(text, dark);
    color: color(text, light);
    padding: 0.6em 1.2em;
    border-radius: 0.4em;
    font-size: 20px;
    pointer-events: none;
    z-index: 20;
  }
  .toast_error{
    z-index: 100;
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    background: color(text, dark);
    color: color(text, light);
    padding: 0.6em 1.2em;
    border-radius: 0.4em;
    font-size: 20px;
    pointer-events: none;
    width: auto;
  }
</style>
