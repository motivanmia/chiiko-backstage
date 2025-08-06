<script setup>
  import logo from '@/assets/image/logo.svg';
  import InputField from '@/components/login/InputField.vue';
  import { ref } from 'vue';

  import { useRouter } from 'vue-router';
  const router = useRouter();

  // const emit = defineEmits(['close', 'login-success']);

  // 假帳號密碼
  const FAKE_ACCOUNT = 'test123';
  const FAKE_PASSWORD = 'test123';

  const account = ref('');
  const password = ref('');

  // 控制 toast 顯示
  const showSuccess = ref(false);

  const noSuccess = ref(false);

  // 範例 login 函式：驗證是否與假帳密吻合
  const login = () => {
    //清空提示
    showSuccess.value = false;
    noSuccess.value = false;

    if (account.value === FAKE_ACCOUNT && password.value === FAKE_PASSWORD) {
      showSuccess.value = true;

      // ✅ 儲存登入者資料
      const user = { name: '黃維尼' };
      localStorage.setItem('user', JSON.stringify(user));

      setTimeout(() => {
        showSuccess.value = false;
        router.push('/');
      }, 1000);
    } else {
      noSuccess.value = true;
      setTimeout(() => {
        noSuccess.value = false;
      }, 2000);
    }
  };
</script>

<template>
  <div id="background">
    <div id="header">
      <img
        :src="logo"
        alt=""
      />
      <h1>後臺管理系統</h1>
    </div>
    <div id="login-box">
      <h2>管理員登入</h2>
      <form @submit.prevent="login">
        <InputField
          v-model="account"
          label="帳號"
          placeholder="請輸入管理員帳號"
          class="account"
          type="account"
        />
        <InputField
          v-model="password"
          label="密碼"
          type="password"
          placeholder="請輸入密碼"
        />
        <button id="btn_login">登入</button>
      </form>
    </div>
    <div class="copyright">
      本網站為緯育TibaMe前端設計工程師班第 92 期學員專題成果作品，本平台僅供學習、展示之用。
      <br />
      若有抵觸有關著作權,或有第三人主張侵害智慧財產權等情事,均由學員負法律上責任,緯育公司概不負責。
      <br />
      若有侵權疑慮,您可以私訊
      <a
        href="https://www.facebook.com/TibaMe"
        class="tibame__link"
      >
        緯育TibaMe
      </a>
      , 後續會由專人協助處理。
      <br />
      © 2025 Chiiko. All rights reserved.
    </div>
    <transition name="fade">
      <div
        v-if="noSuccess"
        class="noSuccess"
      >
        請輸入正確的帳號密碼！
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showSuccess"
        class="showSuccess"
      >
        登入成功
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
  #background {
    background-color: #fefbf1;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    #header {
      background: color(backgroundColor, recipe);
      display: flex;
      align-items: center;
      img {
        width: 100px;
        margin: 10px 20px;
      }
      h1 {
        color: color(text, light);
        font-size: 30px;
        letter-spacing: 0.3rem;
      }
    }
    #login-box {
      background-color: #fefbf1;
      padding: 30px;
      margin: 80px auto;
      border-radius: 20px;
      @include cardBoxShadow;
      border: 2px solid color(backgroundColor, recipe);
      width: 350px;
      h2 {
        text-align: center;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.1rem;
      }
      #btn_login {
        margin-top: 50px;
        width: 100%;
        border-radius: 20px;
        height: 50px;
        // border: 1px solid color(button, main);
        border: none;
        background: color(button, main);
        color: color(text, light);
        font-size: 20px;
        cursor: pointer;
        &:hover {
          background: color(backgroundColor, recipe);
        }
      }
    }
    .copyright {
      padding-bottom: 30px;
      text-align: center;
      color: color(text, base);
      .tibame__link {
        color: color(text, base);
      }
    }
    /* 彈窗樣式 */
    .noSuccess,
    .showSuccess {
      position: fixed;
      top: 110px;
      left: 50%;
      transform: translateX(-50%);
      background: #ccc;
      color: color(text, dark);
      padding: 0.6em 1.2em;
      border-radius: 20px;
      font-size: 20px;
      pointer-events: none;
      z-index: 1;
    }
    .showSuccess {
      background: color(button, main);
      color: color(text, light);
    }

    /* 淡入淡出動畫 */
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
  }
</style>
