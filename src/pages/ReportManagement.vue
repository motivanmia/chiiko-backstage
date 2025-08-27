<template>
  <div class="page-container">
    <TheHeader
      title="留言檢舉管理"
      :dropOptions="dropOptions"
      :showIncreaseButton="false"
      v-model:searchOption="searchOption"
      v-model:searchText="searchText"
    />

    <!-- Table 組件現在顯示的是來自 useFilter 的 filterData -->
    <Table
      :table-data="filterData"
      :columns="columns"
      :is-loading="isLoading"
      @button-click="handleDetailClick"
    >
      <template #empty>
        <div v-if="error">{{ error }}</div>
        <div v-else>暫無檢舉資料</div>
      </template>
    </Table>

    <DetailModal
      v-if="isModalVisible && selectedReport"
      :show="isModalVisible"
      :type="'report'"
      :title="'留言檢舉管理'"
      :data="selectedReport"
      @close="isModalVisible = false"
      @save="handleSaveChanges"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useFilter } from '@/composables/useFilter'; // 引入您的 composable
  import axios from 'axios';
  import TheHeader from '@/components/common/TheHeader.vue';
  import Table from '@/components/Table.vue';
  import DetailModal from '@/components/DetailModal.vue';
  import request from '@/utils/request';
  // --- 狀態管理 ---
  const isModalVisible = ref(false);
  const selectedReport = ref(null);
  const reports = ref([]); // 儲存從後端拿到的原始資料
  const isLoading = ref(true);
  const error = ref(null);

  // --- useFilter 所需的狀態 ---
  const searchOption = ref([]); // 用於篩選條件
  const searchText = ref(''); // 用於搜尋文字

  // --- 表格欄位定義 (根據您的要求) ---
  const columns = ref([
    { prop: 'display_id', label: '案件編號', width: 200 },
    { prop: 'created_at', label: '檢舉日期' },
    { prop: 'reporter_user_id', label: '檢舉會員編號' },
    { prop: 'type', label: '檢舉類型' },
    { prop: 'offender_user_id', label: '留言會員編號' },
    { prop: 'comment_content', label: '留言內容' },
    {
      prop: 'status_label',
      label: '處理狀況',
      width: 200,
      formatter: (row) => mapReportStatus(row.status), // 顯示中文
    },
    { prop: 'actions', label: '詳細', type: 'button-detail', width: 100 },
  ]);

  // --- 資料獲取 ---
  onMounted(async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await request.get('/recipe/get_comment_reports.php');

      if (res.data.status === 'success') {
        // 將後端資料轉換成前端表格需要的格式
        reports.value = res.data.data.map((item) => ({
          ...item,
          report_id: item.report_id, // 保留數字
          display_id: `REP${String(item.report_id).padStart(3, '0')}`, // 顯示用
          created_at: item.report_date,
          reporter_user_id: item.reporter_user_id, // 保留數字
          offender_user_id: item.offender_user_id,
          type: mapReportType(item.report_type),
          comment_content: item.comment_content,
          status: item.status, // 保留數字 0/1/2
          status_label: mapReportStatus(item.status),
        }));
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error('API 錯誤：', err);
      error.value = '無法載入檢舉資料。';
    } finally {
      isLoading.value = false;
    }
  });

  // --- 事件處理 ---
  function handleDetailClick(rowData) {
    const originalReport = reports.value.find((r) => r.report_id === rowData.report_id);

    selectedReport.value = originalReport;
    isModalVisible.value = true;
  }

  async function handleSaveChanges(updateInfo) {
    // updateInfo 來自燈箱，是 { id: 原始數字ID, newStatus: 原始數字狀態 }

    // 1. 從原始資料陣列 `reports` 中找到要更新的項目
    const reportToUpdate = reports.value.find((item) => item.report_id === updateInfo.id);
    if (!reportToUpdate) {
      console.error('在前端找不到要更新的檢舉項目，ID:', updateInfo.id);
      return;
    }

    try {
      // 2. 【✅ 核心修正 ✅】
      //    發送給後端的 report_id，必須是 updateInfo.id (原始的、未經格式化的數字 ID)
      await request.post('/recipe/update_report_status.php', {
        report_id: updateInfo.id,
        new_status: parseInt(updateInfo.newStatus, 10),
      });

      // 3. API 成功後，直接在前端更新狀態，畫面會自動響應
      //    我們更新的是原始資料陣列 `reports` 中的 status
      reportToUpdate.status = parseInt(updateInfo.newStatus, 10);

      // 4. (可選) 顯示成功訊息
      alert('狀態更新成功！');
    } catch (err) {
      console.error('更新狀態失敗:', err);
      alert(err.response?.data?.message || '更新失敗，請查看主控台。');
    } finally {
      isModalVisible.value = false;
    }
  }
  // --- Helper 函式 ---
  function mapReportType(type) {
    const types = { 1: '仇恨言論', 2: '謾罵和騷擾', 3: '暴力言論', 4: '侵犯隱私', 5: '垃圾內容' };
    return types[type] || '未知';
  }

  function mapReportStatus(status) {
    const statuses = { 0: '待處理', 1: '已下架', 2: '已恢復' };
    return statuses[status] || '未知';
  }

  // --- Composable: useFilter ---
  // 動態生成下拉選單的選項
  const optionsGenerator = (data) => {
    const uniqueStatuses = [...new Set(data.map((item) => item.status))];
    return [
      {
        label: '全部狀態',
        value: '全部狀態', // 或者是一個特殊值
        children: uniqueStatuses.map((status) => ({ label: status, value: status })),
      },
    ];
  };

  // 使用 useFilter
  const { dropOptions, filterData } = useFilter(
    reports, // 將原始資料傳入
    searchOption,
    searchText,
    optionsGenerator,
    'status', // 主要篩選的欄位
    null, // 如果您的 useFilter 支持單層篩選，第二個 key 可以是 null
  );
</script>

<style lang="scss" scoped>
  /* 您的樣式 */
</style>
