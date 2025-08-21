import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE;//*

export const useAuthStore = defineStore('auth', () => {
  //state
  const user = ref(null);

  //getters
  const isLogin = computed(() => !!user.value);

  // actions
  // ✅ 檢查後端 Session 狀態的函式
  const checkSession = async () => {
    try {
      const API_URL = `${apiBase}/users/admin_check_session.php`; // 💡 假設你有一個檢查 Session 的 API
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      // 如果後端回傳登入狀態
      if (response.data.is_logged_in) {
        user.value = response.data.user;
        // isLogin.value = true;
        return true;
      } else {
        user.value = null;
        // isLogin.value = false;
        return false;
      }
    } catch (error) {
      user.value = null;
      // isLogin.value = false;
      return false;
    }
  };

  const login = async (account, password) => {
    try {
      const API_URL = `${apiBase}/users/admin_login.php`;
      const response = await axios.post(
        API_URL,
        { account, password },
        {
          withCredentials: true,
        }
      );
      
      // 💡 登入成功時，更新 Pinia 狀態
      if (response.status === 200) {
        // 登入成功後，立刻檢查 Session 並更新狀態
        user.value = response.data.user; 
        return { success: true, message: response.data.message };
      }

    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data.message };
      }
      return { success: false, message: '登入失敗，請稍後再試。' };
    }
  };

  const logout = async () => {
    try {
      const API_URL = `${apiBase}users/admin_logout.php`; // 💡 假設你有一個登出 API
      await axios.get(API_URL, {
        withCredentials: true,
      });
      user.value = null;
      // isLogin.value = false;
      return { success: true, message: '登出成功！' };
    } catch (error) {
      return { success: false, message: '登出失敗。' };
    }
  };

  // 💡 在應用程式啟動時，檢查一次 Session
  // checkSession();

  return {
    user,
    isLogin,
    login,
    logout,
    checkSession,
  }
})
