<script setup>
  import axios from 'axios';
  import { defineProps, defineEmits } from 'vue';
  import { ref, watch } from 'vue';
  import InputField from '@/components/users/InputField.vue';

  // 1. 定義 props 和 emits
  const props = defineProps({
    showEdit: {
      type: Boolean,
      required: true,
    },
    currentRow: {
      type: Object,
      required: true,
    },
  });

  // 用來傳送提示訊息給父元件
  const emit = defineEmits(['close', 'edit-success', 'message']);

  // 2. 建立表單狀態
  const name = ref('');
  const account = ref('');
  const password = ref('');
  const passwordConfirm = ref('');
  const apiBase = import.meta.env.VITE_API_BASE;

  // 3. 監聽 currentRow 變化，自動填充表單
  watch(
    () => props.currentRow,
    (newVal) => {
      if (newVal) {
        name.value = '';
        account.value = '';
        password.value = '';
        passwordConfirm.value = '';
      }
    },
    { immediate: true },
  );

  // 4. 變更函式，發送 API 請求
  const editAdmin = async () => {
    // 進行基本的表單驗證
    if (password.value !== passwordConfirm.value) {
      emit('message', '兩次輸入的密碼不一致！', 'error');
      return;
    }
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (password.value && !regex.test(password.value)) {
      emit('message', '密碼必須中英混搭且至少6個字元！', 'error');
      return;
    }
    if (account.value && !regex.test(account.value)) {
      emit('message', '帳號必須中英混搭且至少6個字元！', 'error');
      return;
    }

    // 構建要發送的資料物件
    const payload = {
      manager_id: props.currentRow.manager_id,
    };

  // 檢查所有輸入欄位是否都為空
  if (!name.value && !account.value && !password.value && !passwordConfirm.value) {
    emit('message', '沒有任何變更。', 'info');
    return;
  }

  // 檢查是否有輸入值，如果有就加入 payload
  if (name.value) {
    payload.name = name.value;
  }
  if (account.value) {
    payload.account = account.value;
  }
  if (password.value) {
    payload.password = password.value;
  }

    try {
      const API_URL = `${apiBase}/update_admin_info.php`;

      const response = await axios.post(API_URL, payload, {
        withCredentials: true,
      });

      if (response.data.status === 'success') {
        emit('message', response.data.message || '管理員資料已更新！', 'success');
        emit('edit-success');
      } else {
        emit('message', response.data.message || '更新失敗，請稍後再試。', 'error');
      }
    } catch (error) {
      console.error('Failed to update admin info:', error);
      if (error.response && error.response.data) {
        emit('message', error.response.data.message, 'error');
      } else {
        emit('message', '無法連接到伺服器。', 'error');
      }
    }
  };

  // 5.關閉彈窗
  const closeEdit = () => {
    emit('close');
  };
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="showEdit"
      class="modal-overlay"
    >
      <div class="modal-content">
        <h2 class="modal-title">更改管理員帳號、密碼</h2>
        <form @submit.prevent="editAdmin">
          <div
            v-if="currentRow"
            class="modal-body"
          >
            <InputField
              v-model="name"
              type="text"
              label="新名稱"
              :placeholder="`原名稱 ${currentRow.name}`"
            />
            <InputField
              v-model="account"
              type="text"
              label="新帳號"
              :placeholder="`原帳號 ${currentRow.account}`"
            />
            <InputField
              v-model="password"
              label="更改密碼"
              type="password"
              placeholder="請輸入密碼"
            />
            <InputField
              v-model="passwordConfirm"
              label="確認密碼"
              type="password"
              placeholder="請再次輸入密碼"
            />
          </div>

          <div class="modal-footer">
            <button
              type="submit"
              id="btn_edit"
            >
              變更
            </button>
            <button
              class="btn"
              @click="closeEdit"
            >
              關閉
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
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

  .modal-body {
    padding: 16px 20px;
  }
  .old-value {
    color: #777;
    font-size: 14px;
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
  #btn_edit {
    padding: 8px 20px;
    border-radius: 20px;
    border: 1px solid #d97c48;
    background: #d97c48;
    color: color(text, light);
    cursor: pointer;
    margin: 0 auto;
    &:hover {
      background: #d6b59c;
      color: color(text, light);
      border: 1px solid #d6b59c;
    }
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
