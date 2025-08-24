<script setup>
  import table_el from '@/components/Table.vue';
  import { ref, onMounted } from 'vue';
  import TheHeader from '@/components/common/TheHeader.vue';
  import { getMember, patchMember } from '@/api/fetch';
  import { useFilter } from '@/composables/useFilter';

  // 訊息提示相關的 ref
  const showError = ref(false);
  const errorMessage = ref('');

  const columns = ref([
    { prop: 'user_id', label: '會員編號', width: 200 },
    { prop: 'name', label: '姓名', width: 200 },
    { prop: 'nickname', label: '暱稱' },
    { prop: 'account', label: 'E-mail' },
    { prop: 'created_at', label: '加入日期' },
    { prop: 'status', label: '會員狀態', type: 'status', width: 200 },
    { prop: 'icon', label: '詳細', type: 'button-detail', width: 100 },
  ]);

  const handleMessage = (message) => {
    showError.value = true;
    errorMessage.value = message;
    setTimeout(() => (showError.value = false), 2000);
  };

  const tableData = ref([]);
  const searchOption = ref([]);
  const searchText = ref('');

  const showDetail = ref(false);
  const currentRow = ref(null);

  // 統一狀態的值
  const memberStatus = (data) => {
    return data.map((item) => {
      // 檢查各種可能的正常狀態 (0, '0', false)
      const isNormal = item.status === 0 || item.status === '0' || item.status === false;
      const processedStatus = isNormal ? 0 : 1;
      return {
        ...item,
        status: processedStatus,
      };
    });
  };

  // 引入api獲得會員資料
  async function fetchData() {
    try {
      const response = await getMember();
      if (response && response.data && response.data.status === 'success') {
        tableData.value = memberStatus(response.data.data);
      } else {
        console.error('API 錯誤: 回傳資料格式不正確或為空');
        handleMessage('無法載入會員資料。');
      }
    } catch (error) {
      console.error('取得資料時發生錯誤:', error);
      handleMessage('無法連接到伺服器。');
    }
  }

  // 元件掛載後自動呼叫fetchData
  onMounted(() => {
    fetchData();
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

  // 狀態切換
  const handleStatusToggle = async ({ rowData, newStatus }) => {
    const item = tableData.value.find((item) => item.user_id === rowData.user_id);

    if (!item) return;
    // 修改前端資料
    item.status = newStatus;

    try {
      // 引入api
      const response = await patchMember({
        user_id: item.user_id,
        status: newStatus,
      });

      // 檢查api回傳的狀態
      if (response.data.status === 'success') {
        handleMessage(response.data.message || '狀態更新成功！');
      } else {
        // api回傳失敗狀態
        item.status = originalStatus;
        handleMessage(response.data.message || '狀態更新失敗。');
      }
    } catch (error) {
      console.error('更新資料時發生錯誤:', error);
      // 錯誤時將狀態回復並顯示訊息
      if (item) item.status = originalStatus;
      if (error.response && error.response.data) {
        handleMessage(error.response.data.message);
      } else {
        handleMessage('無法連接到伺服器。');
      }
    }
  };

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
    v-model:searchOption="searchOption"
    v-model:searchText="searchText"
    :dropOptions="dropOptions"
    :show-increase-button="false"
  />
  <table_el
    yes="正常"
    no="停權"
    @toggle-status="handleStatusToggle"
    :table-data="filterData"
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
            <span>{{ currentRow.user_id }}</span>
          </div>
          <div class="row">
            姓名：
            <span>{{ currentRow.name }}</span>
          </div>
          <div class="row">
            暱稱：
            <span>{{ currentRow.nickname }}</span>
          </div>
          <div class="row">
            Email：
            <span>{{ currentRow.account }}</span>
          </div>
          <div class="row">
            電話：
            <span>{{ currentRow.phone }}</span>
          </div>
          <div class="row">
            地址：
            <span>{{ currentRow.address }}</span>
          </div>
          <div class="row">
            加入日期：
            <span>{{ currentRow.created_at }}</span>
          </div>
          <div class="row">
            會員狀態：
            <span>{{ currentRow.status === 0 ? '正常' : '停權' }}</span>
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
  .answer {
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
