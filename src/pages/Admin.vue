<script setup>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useFilter } from '@/composables/useFilter';
  import { columns } from '@/constants/admin';
  import TheHeader from '@/components/common/TheHeader.vue';
  import table_el from '@/components/Table.vue';
  import AddAdminModal from '@/components/users/AddAdminModal.vue';
  import { useAuthStore } from '@/stores/Auth';

  const authStore = useAuthStore();
  const apiBase = import.meta.env.VITE_API_BASE;

  const showSignin = ref(false); // 顯示新增成功提示
  const showError = ref(false); //新增錯誤提示訊息
  const errorMessage = ref('');

  const signinSuccess = () => {
    showSignin.value = true;
    setTimeout(() => {
      showSignin.value = false;
    }, 2000);
    fetchAdminData();
  };

  const handleMessage = (message) => {
    showError.value = true;
    errorMessage.value = message;
    setTimeout(() => (showError.value = false), 2000);
  };

  // const tableData = ref(initialTableData);

  const tableData = ref([]); // ✅ 將初始值設定為空陣列
  const searchOption = ref([]);
  const searchText = ref('');
  const isModalVisible = ref(false); //控制新增的彈窗顯示

  // ✅ 建立非同步函式來發送 API 請求
  const fetchAdminData = async () => {
    try {
      const API_URL = `${apiBase}/admin_list.php`;
      const response = await axios.get(API_URL, { withCredentials: true });

      if (response.data.status === 'success') {
        const processedData = response.data.data.map((item) => {
          return {
            ...item, // 複製所有原始屬性
            role: roleToText(item.role), // 將 role 數字轉換為中文
            // status: item.status === 0 ? true : false,
          };
        });
        // ✅ 成功取得資料後，更新 tableData
        tableData.value = processedData;
      } else {
        handleMessage(response.data.message || '無法載入管理員資料。');
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      if (error.response && error.response.data) {
        handleMessage(error.response.data.message);
      } else {
        handleMessage('無法連接到伺服器。');
      }
    }
  };

  // ✅ 在元件載入後立即執行資料抓取
  onMounted(() => {
    fetchAdminData();
  });

  // 定義選項生成邏輯
  const optionsGenerator = (data) => {
    const uniqueStatuses = [...new Set(data.map((item) => item.status))];
    return uniqueStatuses.map((status) => ({
      label: status === 0 ? '正常' : '停權',
      value: status,
      children: [],
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

  const handleStatusToggle = async ({ rowData, newStatus }) => {
    const item = tableData.value.find((item) => item.manager_id === rowData.manager_id);
    const originalStatus = item.status;
    if (item) {
      item.status = newStatus;
    }

    try {
      const API_URL = `${apiBase}/update_admin_status.php`; //

      const response = await axios.post(
        API_URL,
        {
          manager_id: item.manager_id,
          status: newStatus, // 💡 直接傳遞數字
        },
        { withCredentials: true },
      );
      if (response.data.status === 'success') {
        handleMessage(response.data.message || '狀態更新成功！');
      } else {
        // 錯誤時，將狀態回滾並顯示訊息
        if (item) item.status = originalStatus;
        handleMessage(response.data.message || '狀態更新失敗。');
      }
    } catch (error) {
      console.error('Failed to update admin status:', error); // 錯誤時，將狀態回滾
      if (item) item.status = originalStatus;
      if (error.response && error.response.data) {
        handleMessage(error.response.data.message);
      } else {
        handleMessage('無法連接到伺服器。');
      }
    }
  };

  const roleToText = (role) => {
    switch (role) {
      case 0:
        return '超級管理員';
      case 1:
        return '管理員';
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
    <div
      v-if="showError"
      class="toast_error"
    >
      {{ errorMessage }}
    </div>
  </transition>
</template>

<style lang="scss" scoped>
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
  .toast_error {
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
