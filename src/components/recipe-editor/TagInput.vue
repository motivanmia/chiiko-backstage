<template>
  <div class="form-section tag-input-component">
    <div class="form-section">
      <div class="title-group">
        <label class="form-label">食譜標籤</label>
        <span class="helper-text">最多可新增3個標籤</span>
      </div>
      <div class="input-wrapper">
        <div class="tag-container">
          <span
            v-for="(tag, index) in tags"
            :key="index"
            class="tag-item"
          >
            #{{ tag }}
          </span>
          <input
            v-model="newTag"
            @keydown.enter.prevent="addTag"
            @keydown.backspace="handleBackspace"
            :placeholder="dynamicPlaceholder"
            class="tag-input"
            maxlength="6"
          />
        </div>
        <span class="char-counter">{{ newTag.length }} / 6</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  // ✨ 修改點：從 vue 引入更多需要的方法
  import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

  // --- 您原有的程式碼 (完全保留) ---
  const props = defineProps({ modelValue: Array });
  const emit = defineEmits(['update:modelValue']);
  const newTag = ref('');
  const tags = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (newValue) => {
      tags.value = newValue;
    },
  );

  const addTag = () => {
    const tag = newTag.value.trim();
    if (tags.value.length >= 3) {
      alert('最多只能輸入 3 個標籤喔～');
      return;
    }
    if (tag && !tags.value.includes(tag)) {
      const newTags = [...tags.value, tag];
      emit('update:modelValue', newTags);
      newTag.value = '';
    }
  };

  const handleBackspace = () => {
    if (newTag.value === '' && tags.value.length > 0) {
      const newTags = tags.value.slice(0, -1);
      emit('update:modelValue', newTags);
    }
  };

  // --- ✨ 新增的 RWD placeholder 邏輯 ---

  // 1. 建立一個 ref 來儲存當前視窗寬度
  const windowWidth = ref(window.innerWidth);

  // 2. 建立一個 computed 屬性，根據視窗寬度決定 placeholder 文字
  const dynamicPlaceholder = computed(() => {
    if (windowWidth.value <= 768) {
      // 手機版 (RWD) 顯示的文字
      return '按下輸入，每個標籤限6字';
    } else {
      // 桌面版顯示的文字
      return '按下 Enter 新增標籤，每個標籤限6字';
    }
  });

  // 3. 定義一個更新視窗寬度的方法
  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  // 4. 在元件掛載時，新增 resize 事件監聽
  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  // 5. 在元件卸載時，移除監聽，避免記憶體洩漏
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
</script>

<style lang="scss" scoped>
  /* 您的 CSS 樣式完全不需要修改 */
  .form-section {
    width: 800px;
    margin: 0 auto 45px;
  }
  .title-group {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 10px;
  }
  .form-label {
    font-size: 28px;
  }
  .helper-text {
    font-size: 20px;
    color: #828282;
  }
  .input-wrapper {
    position: relative;
  }
  .tag-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-height: 60px;
    padding: 0.75rem 1.5rem;
    border-radius: 20px;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  }
  .tag-item {
    background-color: #eee;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .tag-input {
    flex-grow: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 20px;
  }
  .char-counter {
    position: absolute;
    bottom: 12px;
    right: 20px;
    color: #888;
  }
</style>
