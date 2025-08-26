<template>
  <div class="form-field">
    <div class="title-group">
      <label class="form-label">{{ label }}</label>
      <span
        v-if="warning"
        class="warning-text"
      >
        {{ warning }}
      </span>
    </div>

    <!-- 
      模板部分完全不需要修改，
      它現在可以正確地找到 script 中定義的 dynamicPlaceholder
    -->
    <textarea
      ref="textareaRef"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="dynamicPlaceholder"
      :maxlength="maxLength"
      class="form-input-autosize"
      rows="1"
    ></textarea>

    <span
      v-if="maxLength"
      class="char-counter"
    >
      {{ modelValue.length }} / {{ maxLength }}
    </span>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, nextTick, computed } from 'vue'; // ✅ 引入 computed

  const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, required: true },
    maxLength: Number,
    warning: String,
    placeholderDesktop: { type: String, default: '請輸入內容' },
    placeholderMobile: { type: String, default: '' }, // ✅ 增加 mobile 的 prop
    initialHeight: { type: Number, default: 62 },
  });

  defineEmits(['update:modelValue']);

  // 【✅ 核心修正 ✅】
  // 我們在這裡定義了模板中需要的 dynamicPlaceholder 變數
  const dynamicPlaceholder = computed(() => {
    // 檢查 window 物件是否存在 (避免在 SSR 等非瀏覽器環境出錯)
    if (typeof window !== 'undefined') {
      // 如果視窗寬度大於 768px，使用桌面版的 placeholder
      // 否則，優先使用行動版，如果行動版沒提供，就還是用桌面版
      return window.innerWidth > 768
        ? props.placeholderDesktop
        : props.placeholderMobile || props.placeholderDesktop;
    }
    // 預設情況下，回傳桌面版
    return props.placeholderDesktop;
  });

  const textareaRef = ref(null);

  // 您現有的高度自動調整邏輯非常棒，完全保持不變
  const adjustHeight = () => {
    const textarea = textareaRef.value;
    if (textarea) {
      const minHeight = props.initialHeight;
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`;
    }
  };

  watch(
    () => props.modelValue,
    async () => {
      await nextTick();
      adjustHeight();
    },
  );

  onMounted(() => {
    adjustHeight();
  });
</script>

<style lang="scss" scoped>
  .form-field {
    width: 800px;
    max-width: 100%;
    position: relative;
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

  .form-input-singleline {
    white-space: nowrap;
    overflow: hidden;
  }

  .form-input-autosize {
    width: 100%;
    padding: 1rem 1.5rem;
    padding-right: 85px;
    border-radius: 20px;
    border: 1px solid #ccc;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 20px;
    line-height: 1.5;
    box-sizing: border-box;

    /* 
    ⭐️ 關鍵 3: CSS 的調整
    我們不再需要寫死的 min-height，因為這個值現在完全由 JavaScript 根據
    initialHeight prop 來動態控制，這樣更加靈活。
  */
    resize: none;
    overflow: hidden;

    white-space: normal;
    overflow-wrap: break-word;

    transition: height 0.1s ease-in-out;

    &:focus {
      outline: none;
      border-color: #5b9dd9;
      box-shadow: 0 0 8px rgba(91, 157, 217, 0.5);
    }
  }

  .char-counter {
    position: absolute;
    bottom: 15px;
    right: 25px;
    font-size: 16px;
    color: #888;
    user-select: none;
    background-color: white;
  }
</style>
