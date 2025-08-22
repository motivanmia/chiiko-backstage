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

    <textarea
      ref="textareaRef"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :maxlength="maxLength"
      class="form-textarea"
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
  import { ref, watch, onMounted, nextTick } from 'vue';

  const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, required: true },
    placeholder: { type: String, default: '請輸入內容' },
    maxLength: Number,
    warning: String,
    initialHeight: { type: Number, default: 62 },
  });

  defineEmits(['update:modelValue']);

  const textareaRef = ref(null);

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
    () => {
      nextTick(adjustHeight);
    },
  );

  onMounted(adjustHeight);
</script>

<style lang="scss" scoped>
  .form-field {
    /* ⭐️ 關鍵修正：恢復您原本的寬度設定 ⭐️ */
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
  .form-textarea {
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
