<template>
  <div class="page-container">
    <TheHeader
      title="留言檢舉管理"
      :dropOptions="reportStatusOptions"
      :showIncreaseButton="false"
      v-model:searchOption="selectedStatus"
      v-model:searchText="searchText"
    />

    <Table
      :table-data="filteredTableData"
      :columns="columns"
      @button-click="handleDetailClick"
    />

    <DetailModal
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
  import 'element-plus/theme-chalk/el-cascader.css';
  import { ref, computed } from 'vue';
  import TheHeader from '@/components/common/TheHeader.vue';
  import Table from '@/components/Table.vue';
  import DetailModal from '@/components/DetailModal.vue';

  const isModalVisible = ref(false);
  const selectedReport = ref(null);

  const selectedStatus = ref('all');
  const searchText = ref('');

  const filteredTableData = computed(() => {
    let filteredItems = [...tableData.value];

    if (selectedStatus.value && selectedStatus.value !== 'all') {
      const selectedLabel = reportStatusOptions.value.find(
        (option) => option.value === selectedStatus.value,
      )?.label;

      if (selectedLabel) {
        filteredItems = filteredItems.filter((item) => item.status === selectedLabel);
      }
    }

    if (searchText.value.trim() !== '') {
      const lowerCaseSearchText = searchText.value.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.number.toLowerCase().includes(lowerCaseSearchText) ||
          item.reporter_id.toLowerCase().includes(lowerCaseSearchText) ||
          item.offender_id.toLowerCase().includes(lowerCaseSearchText) ||
          item.comment_content.toLowerCase().includes(lowerCaseSearchText),
      );
    }

    return filteredItems;
  });

  const reportStatusOptions = ref([
    { value: 'all', label: '全部狀態' },
    { value: 'pending', label: '待處理' },
    { value: 'in_progress', label: '處理中' },
    { value: 'resolved', label: '已解決' },
    { value: 'rejected', label: '不成立' },
  ]);

  const columns = ref([
    { prop: 'number', label: '案件編號', width: 200 },
    { prop: 'report_date', label: '檢舉日期' },
    { prop: 'reporter_id', label: '檢舉會員編號' },
    { prop: 'report_category', label: '檢舉類型' },
    { prop: 'offender_id', label: '留言會員編號' },
    { prop: 'comment_content', label: '留言內容' },
    { prop: 'status', label: '處理狀況', width: 200 },
    { prop: 'actions', label: '詳細', type: 'button-detail', width: 100 },
  ]);

  const tableData = ref([
    {
      number: 'REP001',
      report_date: '2025-08-01',
      reporter_id: 'U10234',
      report_category: '仇恨言論',
      offender_id: 'U88001',
      comment_content: '幹你娘雞掰你媽死了是不是，去火化啦。',
      status: '待處理',
    },
    {
      number: 'REP002',
      report_date: '2025-08-02',
      reporter_id: 'U55678',
      report_category: '謾罵和騷擾',
      offender_id: 'U91023',
      comment_content: '樓主是智商沒上線嗎？煮這什麼洨？ㄆㄨㄣ？',
      status: '處理中',
    },
    {
      number: 'REP003',
      report_date: '2025-08-03',
      reporter_id: 'U11223',
      report_category: '暴力言論',
      offender_id: 'U44556',
      comment_content: '你再繼續講，信不信我找到你家地址送你去死。',
      status: '已解決',
    },
    {
      number: 'REP004',
      report_date: '2025-08-04',
      reporter_id: 'U77889',
      report_category: '侵犯隱私',
      offender_id: 'U66778',
      comment_content: '我知道你是誰，也知道你讀哪個班，這是我倆之間的秘密，你最好不要說出去。',
      status: '已解決',
    },
    {
      number: 'REP005',
      report_date: '2025-08-05',
      reporter_id: 'U33445',
      report_category: '垃圾內容',
      offender_id: 'U99999',
      comment_content: '想快速賺錢嗎？點擊我的個人資料連結，保證月入十萬！明天早上出發緬甸！',
      status: '處理中',
    },
  ]);

  function handleDetailClick(rowData) {
    selectedReport.value = rowData;
    isModalVisible.value = true;
  }

  function handleSaveChanges(updateInfo) {
    const reportToUpdate = tableData.value.find((item) => item.number === updateInfo.id);
    if (reportToUpdate) {
      const statusObj = reportStatusOptions.value.find((opt) => opt.value === updateInfo.newStatus);
      if (statusObj) {
        reportToUpdate.status = statusObj.label;
      }
    }
    isModalVisible.value = false;
  }
</script>

<style lang="scss" scoped></style>
