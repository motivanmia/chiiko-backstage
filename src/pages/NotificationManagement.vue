<template>
  <div class="page-container">
    <div class="board-header">
      <MyTitle title="通知管理"></MyTitle>
    </div>

    <div class="board-query">
      <DropMenu
        v-model="selectedType"
        :options="notificationTypeOptions"
        class="query-item"
        placeholder="篩選通知類型"
      ></DropMenu>
      <Search
        v-model="searchText"
        placeholder="搜尋通知內容或會員ID"
        class="query-item"
      />
    </div>

    <div class="board-contents">
      <Table
        :table-data="filteredData"
        :columns="columns"
        @button-click="handleDetailClick"
      ></Table>
    </div>

    <!-- 關鍵：使用別名 NotificationModal 來引用通用燈箱元件 -->
    <NotificationModal
      :show="isModalVisible"
      :type="'notification'"
      :title="'通知詳細內容'"
      :data="selectedNotification"
      @close="isModalVisible = false"
    />
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import MyTitle from '@/components/common/Title.vue';
  import DropMenu from '@/components/common/DropMenu.vue';
  import Search from '@/components/common/Search.vue';
  import Table from '@/components/Table.vue';
  import { default as NotificationModal } from '@/components/DetailModal.vue';

  // --- 燈箱狀態控制 ---
  const isModalVisible = ref(false);
  const selectedNotification = ref(null);

  // --- 篩選與搜尋 ---
  const selectedType = ref('');
  const searchText = ref('');
  const notificationTypeOptions = ref([
    { value: 'all', label: '所有類型' },
    { value: '留言回覆', label: '留言回覆' },
    { value: '食譜留言', label: '食譜留言' },
    { value: '訂單狀態', label: '訂單狀態' },
  ]);

  // --- 表格欄位定義 ---
  const columns = ref([
    { prop: 'notification_id', label: '通知編號' },
    { prop: 'sent_date', label: '發送日期' },
    { prop: 'notification_type', label: '通知類型' },
    { prop: 'recipient_id', label: '接收會員' },
    { prop: 'content', label: '通知內容', width: 400 },
    { prop: 'is_read', label: '狀態' },
    { prop: 'actions', label: '詳細', type: 'button', width: 90 },
  ]);

  // --- 原始資料 ---
  const tableData = ref([
    {
      notification_id: 'N001',
      sent_date: '2025-08-01',
      notification_type: '留言回覆',
      recipient_id: 'U12345',
      content: '鹹魚 在您的留言「這個食譜太棒了！」下方回覆了：『真的！我也超愛！』',
      is_read: '已讀取',
    },
    {
      notification_id: 'N002',
      sent_date: '2025-08-02',
      notification_type: '食譜留言',
      recipient_id: 'U54321',
      content: '小當家 在您的食譜「黃金開口笑」底下留言：『請問麵粉可以用中筋的嗎？』',
      is_read: '未讀取',
    },
    {
      notification_id: 'N003',
      sent_date: '2025-08-03',
      notification_type: '訂單狀態',
      recipient_id: 'U98765',
      content: '您購買的商品「特級廚師菜刀」已出貨，預計3天內送達。',
      is_read: '未讀取',
    },
    {
      notification_id: 'N004',
      sent_date: '2025-08-04',
      notification_type: '訂單狀態',
      recipient_id: 'U12345',
      content: '您購買的商品「傳說中的廚具」已送達指定門市。',
      is_read: '已讀取',
    },
  ]);

  // --- 計算屬性：根據篩選和搜尋條件，動態產生要顯示在表格中的資料 ---
  const filteredData = computed(() => {
    return tableData.value.filter((item) => {
      const typeMatch =
        selectedType.value === 'all' ||
        !selectedType.value ||
        item.notification_type === selectedType.value;
      const searchMatch =
        !searchText.value ||
        item.content.includes(searchText.value) ||
        item.recipient_id.includes(searchText.value);
      return typeMatch && searchMatch;
    });
  });

  // --- 事件處理函式 ---
  function handleDetailClick(rowData) {
    selectedNotification.value = rowData;
    isModalVisible.value = true;
  }

  function handleNewNotification() {
    alert('準備發送一則新的全站通知！');
    // 在這裡可以打開另一個專門用來「新增」通知的燈箱或跳轉頁面
  }
</script>

<style lang="scss" scoped>
  .page-container {
    padding: 2rem;
  }
  .board-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.7rem;
  }

  /* ✨ 關鍵修正點：從這裡開始 */
  .board-query {
    display: flex; /* 維持 Flexbox 佈局 */
    justify-content: space-between; /* 關鍵！將子元素推向左右兩側 */
    align-items: center; /* 垂直置中 */

    /* 以下樣式保持不變 */
    padding-bottom: 30px;
    margin-bottom: 21px;
    border-bottom: 1px solid #e0e0e0;
  }

  .query-item {
    /* ✨ 修改點：移除固定的 min-width，讓元件寬度更自然 */
    /* min-width: 250px; (移除或註解掉) */
  }
  /* ✨ 關鍵修正點：結束 */

  .board-contents {
    margin-top: 1rem;
  }
</style>
