<template>
  <!-- 使用 Transition 元件讓燈箱有淡入淡出的動畫效果 -->
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="modal-overlay"
      @click.self="handleCancel"
    >
      <div class="modal-container">
        <h2 class="modal-header">留言檢舉管理</h2>

        <div class="modal-body">
          <div class="info-row">
            <label>檢舉日期</label>
            <p>{{ report.report_date }}</p>
          </div>
          <hr />
          <div class="info-row">
            <label>檢舉會員編號</label>
            <p>{{ report.reporter_id }}</p>
          </div>
          <hr />
          <div class="info-row">
            <label>檢舉類型</label>
            <p>{{ report.report_category }}</p>
          </div>
          <hr />
          <div class="info-row">
            <label>留言會員編號</label>
            <p>{{ report.offender_id }}</p>
          </div>
          <hr />
          <div class="info-row">
            <label>留言內容</label>
            <p class="comment-content">{{ report.comment_content }}</p>
          </div>
          <hr />
          <div class="info-row status-row">
            <label>處理狀況</label>
            <select
              v-model="localStatus"
              class="status-select"
            >
              <option
                v-for="option in statusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="action-buttons">
          <button
            class="btn btn-save"
            @click="handleSave"
          >
            儲存
          </button>
          <button
            class="btn btn-cancel"
            @click="handleCancel"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { ref, watch } from 'vue';

  // 1. 定義接收的 Props
  const props = defineProps({
    show: {
      type: Boolean,
      required: true,
    },
    report: {
      // 接收一整包的檢舉資料
      type: Object,
      // 提供一個預設值，避免在 report 為 null 時出錯
      default: () => ({}),
    },
  });

  // 2. 定義會觸發的事件
  const emit = defineEmits(['close', 'save']);

  // 3. 定義下拉選單的選項
  const statusOptions = ref([
    { value: 'pending', label: '待確認' },
    { value: 'removed', label: '已下架' },
    { value: 'reinstated', label: '已恢復' },
  ]);

  // 4. 建立一個本地 ref 來儲存下拉選單的狀態，避免直接修改 prop
  const localStatus = ref('');

  // 5. 監聽傳入的 report prop，當它改變時，更新本地的 localStatus
  //    這樣才能確保每次打開燈箱時，下拉選單都顯示正確的當前狀態
  watch(
    () => props.report,
    (newReport) => {
      if (newReport && newReport.status) {
        localStatus.value = newReport.status;
      } else {
        // 如果沒有傳入狀態，給一個預設值
        localStatus.value = 'pending';
      }
    },
    { immediate: true, deep: true }, // immediate: 元件一載入就立刻執行一次
  );

  // 6. 定義按鈕的處理函式
  function handleSave() {
    // 觸發 save 事件，並將 report 的 id 和新的狀態傳回給父元件
    emit('save', { id: props.report.number, newStatus: localStatus.value });
    // 可以在這裡選擇性地直接關閉燈箱，或者交由父元件處理
    // emit('close');
  }

  function handleCancel() {
    emit('close'); // 觸發 close 事件
  }
</script>

<style scoped lang="scss">
  /* =================================================================== */
  /*                       燈箱背景與容器 (含動畫)                        */
  /* =================================================================== */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-container {
    width: 550px;
    height: 630px;
    background-color: #fefbf1;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 40px;
    box-sizing: border-box;
    /* 使用 Flexbox 讓內容垂直排列，並將按鈕推到底部 */
    display: flex;
    flex-direction: column;
  }

  /* 淡入淡出動畫 */
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }

  /* =================================================================== */
  /*                          燈箱內部內容樣式                           */
  /* =================================================================== */

  .modal-header {
    font-size: 28px;
    font-weight: 600;
    text-align: left;
    margin-bottom: 32px;
    flex-shrink: 0; /* 防止標題被壓縮 */
  }

  .modal-body {
    flex-grow: 1; /* 讓內容區塊佔滿所有可用空間 */
    overflow-y: auto; /* 如果內容太多，可以滾動 */
  }

  .info-row {
    display: flex;
    flex-direction: column;
    gap: 5px; /* 標籤和內容之間的間距 */
  }

  .info-row label {
    font-size: 18px;
    color: #000000;
    font-weight: 500;
  }

  .info-row p {
    font-size: 18px;
    color: #333;
    margin-left: 10px;
  }

  hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 5px auto 15px auto;
  }

  .status-row {
    position: relative;
  }

  .status-row label {
    font-size: 16px;
    color: #888;
    margin-bottom: 8px;
  }

  /* 2. 處理下拉選單本身 */
  .status-select {
    /* 隱藏原生箭頭 */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    /* 樣式設定 */
    width: 100%;
    box-sizing: border-box;
    height: 48px;
    border: 1px solid #ccc;
    border-radius: 12px;
    font-size: 18px;
    background-color: white;

    /* 增加右側內距，為新箭頭留出空間 */
    padding: 0 48px 0 16px;
  }

  /* 3. ✨ 使用 ::after 偽元素，畫出您指定的 V 形箭頭 */
  .status-row::after {
    content: '';
    position: absolute;

    /* 您提供的參數 */
    right: 20px;
    top: 70%;
    width: 10px;
    height: 10px;
    border: solid #333;
    border-width: 0 3px 3px 0;
    transform: translateY(-50%) rotate(45deg);

    /* 確保點擊可以穿透 */
    pointer-events: none;
  }

  /* =================================================================== */
  /*                          底部按鈕樣式 (保持不變)                     */
  /* =================================================================== */

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 32px;
    flex-shrink: 0;
  }

  .btn {
    padding: 12px 48px;
    border-radius: 20px;
    border: 1px solid transparent;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .btn-save {
    background-color: #d97c48;
    color: white;
    border-color: #d97c48;
  }

  .btn-cancel {
    background-color: #fefbf1;
    color: #333;
    border-color: #ccc;
  }

  .btn:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
  }
</style>
