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

    <!-- 根據 isTextarea prop 決定渲染 input 還是 textarea -->
    <!-- 關鍵：:placeholder 綁定了我們在 script 中定義的動態 computed 屬性 -->
    <textarea
      v-if="isTextarea"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="dynamicPlaceholder"
      :maxlength="maxLength"
      class="form-input form-textarea"
    ></textarea>
    <input
      v-else
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="dynamicPlaceholder"
      :maxlength="maxLength"
      class="form-input"
    />

    <span
      v-if="maxLength"
      class="char-counter"
    >
      {{ modelValue.length }} / {{ maxLength }}
    </span>
  </div>
</template>

<script setup>
  // 1. 引入所需方法
  import { ref, computed, onMounted, onUnmounted } from 'vue';

  // 2. 定義元件的 props
  const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    label: String,
    maxLength: Number,
    warning: String,
    isTextarea: { type: Boolean, default: false },

    // ✨ 新增的兩個 props，用來接收不同版本的 placeholder 文字
    placeholderDesktop: { type: String, default: '' },
    placeholderMobile: { type: String, default: '' },
  });

  defineEmits(['update:modelValue']);

  // --- 3. 加入 RWD placeholder 邏輯 ---
  const windowWidth = ref(window.innerWidth);

  const dynamicPlaceholder = computed(() => {
    if (props.placeholderMobile && windowWidth.value <= 768) {
      return props.placeholderMobile;
    }
    return props.placeholderDesktop;
  });

  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  // 4. 生命週期掛鉤
  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
</script>

<style lang="scss" scoped>
  /* 這裡應該放您 FormField 原本的樣式 */
  .form-field {
    width: 800px;
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
  .warning-text {
    color: red;
  }
  .form-input {
    width: 100%;
    min-height: 60px;
    padding: 0.75rem 1.5rem;
    border-radius: 20px;
    border: none;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    font-size: 20px;
    box-sizing: border-box;
  }
  .form-textarea {
    height: 120px;
    resize: vertical;
  }
  .char-counter {
    position: absolute;
    bottom: 12px;
    right: 20px;
    color: #888;
  }
</style>
