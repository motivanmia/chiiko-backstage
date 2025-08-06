<template>
  <div class="page-container">
    <div class="recipe-board">
      <div class="recipe-board__manage">
        <MyTitle title="留言檢舉管理"></MyTitle>
      </div>

      <div class="recipe-board__query">
        <DropMenu
          v-model="selectedStatus"
          :options="reportStatusOptions"
          class="recipe-board__drop"
          placeholder="請選擇處理狀況"
        ></DropMenu>
        <Search class="recipe-board__search" />
      </div>
    </div>

    <div class="recipe-board__contents">
      <Table
        :table-data="tableData"
        :columns="columns"
        @button-click="handleDetailClick"
      ></Table>
    </div>

    <!-- ✨ 修改點 1：將元件標籤改為 DetailModal -->
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
  import { ref } from 'vue';
  import DropMenu from '@/components/common/DropMenu.vue';
  import Search from '@/components/common/Search.vue';
  import MyTitle from '@/components/common/Title.vue';
  import Table from '@/components/Table.vue';
  import DetailModal from '@/components/DetailModal.vue';

  // --- 燈箱狀態控制 ---
  const isModalVisible = ref(false);
  const selectedReport = ref(null);

  // --- 您原有的 Script 內容 ---
  const selectedStatus = ref('');
  const reportStatusOptions = ref([
    { value: 'pending', label: '待處理' },
    { value: 'in_progress', label: '處理中' },
    { value: 'resolved', label: '已解決' },
    { value: 'rejected', label: '不成立' },
  ]);

  const searchText = ref('');

  const columns = ref([
    { prop: 'number', label: '案件編號' },
    { prop: 'report_date', label: '檢舉日期' },
    { prop: 'reporter_id', label: '檢舉會員編號' },
    { prop: 'report_category', label: '檢舉類型' },
    { prop: 'offender_id', label: '留言會員編號' },
    { prop: 'comment_content', label: '留言內容', width: 0 },
    { prop: 'status', label: '處理狀況' },
    { prop: 'actions', label: '詳細', type: 'button', width: 90 },
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

  // --- 事件處理函式 ---
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

<style lang="scss" scoped>
  .page-container {
    padding: 2rem;
  }
  .recipe-board {
    &__manage {
      display: flex;
      justify-content: space-between;
      align-items: center; /* 使用 align-items 更適合單行 flex 佈局 */
    }

    /* ✨ 關鍵修正點：從這裡開始 */
    &__query {
      display: flex; /* 改回使用 Flexbox，因為它對這種兩端對齊的簡單佈局更直觀 */
      justify-content: space-between; /* 關鍵！將下拉選單和搜尋框推向左右兩側 */
      align-items: center; /* 讓它們垂直置中 */

      margin-top: 27px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #eee;
        bottom: -30px;
      }

      /* 
        我們不再需要 grid-column 的設定了，
        justify-content: space-between 會自動處理對齊。
      */
      // .recipe-board__drop { ... } (移除)
      // .recipe-board__search { ... } (移除)
    }
    /* ✨ 關鍵修正點：結束 */

    &__contents {
      margin-top: 50px;
    }
  }
</style>
