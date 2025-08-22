<script setup>
  import logo from '@/assets/image/logo.svg';
  import InputField from '@/components/login/InputField.vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/Auth';

  const router = useRouter();
  const authStore = useAuthStore();

  const emit = defineEmits(['close', 'login-success']);

  const account = ref('');
  const password = ref('');
  const formError = ref('');
  const isError = ref(false); // 判斷是否為錯誤訊息，用來切換樣式

  const login = async () => {
    formError.value = '';
    isError.value = false;
    
    const result = await authStore.login(account.value, password.value);

    if (result.success) {
      // 登入成功
      formError.value = result.message;
      isError.value = false;

      // 💡 透過 Pinia 的狀態來判斷是否導向
      // if (authStore.isLogin) {
      //   router.push('/');
      // }

      // 你也可以直接在這裡導向，因為 login 成功就會更新 isLogin
      if (authStore.user?.role === 0){
        setTimeout(() => {
        router.push('/');
        emit('login-success');
        }, 1000);
      } else {
        setTimeout(()=> {
          router.push('/member');
          emit('login-success')
        }, 1000)
      }
      
    } else {
      // 登入失敗
      formError.value = result.message;
      isError.value = true;
      
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
        v-if="formError"
        class="toast"
        :class="{ 'is-error': isError }"
      >
        {{ formError }}
        <!-- 帳號或密碼錯誤！ -->
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
    .toast {
      position: fixed;
      top: 110px;
      left: 50%;
      transform: translateX(-50%);
      background: color(button, main);
      color: color(text, light);
      padding: 0.6em 1.2em;
      border-radius: 20px;
      font-size: 20px;
      pointer-events: none;
      z-index: 999;
    }
    .is-error {
      background: #ccc;
      color: color(text, dark);
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
