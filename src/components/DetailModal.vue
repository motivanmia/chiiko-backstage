<template>
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="modal-overlay"
      @click.self="$emit('close')"
    >
      <div class="modal-container">
        <h2 class="modal-header">{{ title }}</h2>

        <div class="modal-body">
          <!-- =================== 通知詳情 (Notification) =================== -->
          <!-- ✨ 關鍵修正：移除了多餘的 .notification 和 .report 前綴 -->
          <div v-if="type === 'notification'">
            <div class="info-row">
              <label>通知編號</label>
              <p>{{ data.notification_id }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>發送日期</label>
              <p>{{ data.sent_date }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>通知類型</label>
              <p>{{ data.notification_type }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>接收會員</label>
              <p>{{ data.recipient_id }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>狀態</label>
              <p>{{ data.is_read ? '已讀取' : '未讀取' }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>通知內容</label>
              <p class="comment-content">{{ data.content }}</p>
            </div>
          </div>

          <!-- =================== 檢舉詳情 (Report) =================== -->
          <div v-else-if="type === 'report'">
            <div class="info-row">
              <label>檢舉日期</label>
              <p>{{ data.report_date }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>檢舉會員編號</label>
              <p>{{ data.reporter_id }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>檢舉類型</label>
              <p>{{ data.report_category }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>留言會員編號</label>
              <p>{{ data.offender_id }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>留言內容</label>
              <p class="comment-content">{{ data.comment_content }}</p>
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
        </div>

        <div class="action-buttons">
          <template v-if="type === 'report'">
            <button
              class="btn btn-save"
              @click="handleSave"
            >
              儲存
            </button>
            <button
              class="btn btn-cancel"
              @click="$emit('close')"
            >
              取消
            </button>
          </template>
          <template v-if="type === 'notification'">
            <button
              class="btn btn-cancel"
              @click="$emit('close')"
            >
              關閉
            </button>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    show: { type: Boolean, required: true },
    type: {
      type: String,
      required: true,
      validator: (value) => ['report', 'notification'].includes(value),
    },
    title: { type: String, default: '詳細資訊' },
    data: { type: Object, default: () => ({}) },
  });

  const emit = defineEmits(['close', 'save']);

  // --- 只給「檢舉」類型用的邏輯 ---
  const statusOptions = ref([
    { value: 'pending', label: '待確認' },
    { value: 'removed', label: '已下架' },
    { value: 'reinstated', label: '已恢復' },
  ]);

  const localStatus = ref('');

  watch(
    () => props.data,
    (newData) => {
      if (props.type === 'report' && newData) {
        const foundOption = statusOptions.value.find((option) => option.label === newData.status);

        if (foundOption) {
          localStatus.value = foundOption.value;
        } else {
          localStatus.value = 'pending';
        }
      }
    },
    { immediate: true, deep: true },
  );

  function handleSave() {
    const id = props.type === 'report' ? props.data.number : props.data.notification_id;
    emit('save', { id: id, newStatus: localStatus.value });
  }
</script>

<style scoped lang="scss">
  /* 這裡貼上您完整的通用燈箱 CSS 樣式 */
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
    background-color: #fefbf1;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  .modal-header {
    font-size: 28px;
    font-weight: 600;
    text-align: left;
    margin-bottom: 32px;
    flex-shrink: 0;
  }
  .modal-body {
    flex-grow: 1;
    overflow-y: auto;
  }
  .info-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .info-row label {
    font-size: 18px;
    font-weight: 500;
  }
  .info-row p {
    font-size: 18px;
    margin-left: 10px;
  }
  .comment-content {
    line-height: 1.6;
    white-space: pre-wrap;
  }
  hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 20px 0;
  }
  .status-row {
    position: relative;
  }
  .status-row label {
    font-size: 16px;
    color: #888;
    margin-bottom: 8px;
  }
  .status-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    box-sizing: border-box;
    height: 48px;
    border: 1px solid #ccc;
    border-radius: 12px;
    font-size: 18px;
    background-color: white;
    padding: 0 48px 0 16px;
  }
  .status-row::after {
    content: '';
    position: absolute;
    right: 20px;
    top: 70%;
    width: 10px;
    height: 10px;
    border: solid #333;
    border-width: 0 3px 3px 0;
    transform: translateY(-50%) rotate(45deg);
    pointer-events: none;
  }
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
    color: #d97c48;
    border-color: #ccc;
  }
  .btn:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
  }
</style>
