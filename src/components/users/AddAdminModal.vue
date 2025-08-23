<script setup>
  import { ref } from 'vue';
  import InputField from '@/components/users/InputField.vue';
  import axios from 'axios';

  const apiBase = import.meta.env.VITE_API_BASE;
  const emit = defineEmits(['close', 'add-success', 'add-failure', 'psw-error']);

  const account = ref('');
  const password = ref('');
  const name = ref('');
  const passwordConfirm = ref('');
  const role = ref('管理員');

  const signup = async () => {
    // 密碼確認
    if (password.value !== passwordConfirm.value) {
      emit('psw-error', '密碼與確認密碼不相符');
      return;
    }

    // 準備要送出的資料
    const formData = {
      name: name.value,
      account: account.value,
      password: password.value,
      role: role.value,
    };

    try {
      const API_URL = `${apiBase}/users/admin_signup.php`;
      const response = await axios.post(API_URL, formData);

      if (response.status >= 200 && response.status < 300) {
        // alert(response.data.message);
        emit('add-success');
        emit('close');
      }
    } catch (error) {
      // 處理錯誤
      if (error.response && error.response.data && error.response.data.message) {
        emit('add-failure', error.response.data.message);
      } else {
        alert('新增管理員失敗，請稍後再試。');
      }
    }
  };
</script>

<template>
  <transition name="modal-fade">
    <div class="modal-overlay">
      <div class="modal-content">
        <h2 id="modal-title">新增管理員</h2>
        <form @submit.prevent="signup">
          <InputField
            v-model="name"
            label="名稱"
            placeholder="新增管理員名稱"
            class="account"
            type="text"
          />
          <InputField
            v-model="account"
            label="帳號"
            placeholder="新增管理員帳號"
            class="account"
            type="text"
          />
          <InputField
            v-model="password"
            label="密碼"
            type="password"
            placeholder="請輸入密碼"
          />
          <InputField
            variant="signin"
            v-model="passwordConfirm"
            label="確認密碼"
            type="password"
            placeholder="請再次輸入密碼"
          />
          <InputField
            label="管理權限"
            :model-value="role"
            disabled
            type="text"
          />

          <div class="modal-footer">
            <button
              type="submit"
              id="btn_signin"
            >
              註冊
            </button>

            <button
              class="btn"
              @click="$emit('close')"
            >
              取消
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
    z-index: 100;
    padding: 24px;
  }
  .modal-content {
    position: relative;
    width: min(500px, 100%);
    background: #fcfcfc;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    border: 1px solid#d6b59c;
    color: color(text, dark);
  }
  form {
    padding: 0 20px;
  }
  #modal-title {
    margin: 0;
    padding: 16px 56px 12px 20px;
    font-size: 20px;
    line-height: 1.2;
    color: color(text, dark);
    background: #d6b59c;
    border-bottom: 1px solid #eee;
  }
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 20px 16px;
  }
  #btn_signin {
    padding: 8px 20px;
    border-radius: 20px;
    border: 1px solid #d97c48;
    background: #d97c48;
    color: color(text, light);
    cursor: pointer;
    margin: 0 auto;
  }
  #btn_signin:hover {
    background: #d6b59c;
    color: color(text, light);
    border: 1px solid #d6b59c;
  }
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
</style>
