import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const show = ref(false);
  const message = ref('');
  const type = ref('success'); // 'success' | 'error'
  const duration = ref(2000);

  const showToast = (msg, toastType = 'success', time = 2000) => {
    message.value = msg;
    type.value = toastType;
    duration.value = time;
    show.value = true;

    setTimeout(() => {
      show.value = false;
    }, duration.value);
  };

  return { show, message, type, duration, showToast };
});
