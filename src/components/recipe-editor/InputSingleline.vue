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

    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :maxlength="maxLength"
      class="form-input"
      @keydown.enter.prevent
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
  defineProps({
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, required: true },
    placeholder: { type: String, default: '請輸入內容' },
    maxLength: Number,
    warning: String,
  });

  defineEmits(['update:modelValue']);
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
  .form-input {
    width: 100%;
    height: 62px;
    padding: 1rem 1.5rem;
    padding-right: 85px;
    border-radius: 20px;
    border: 1px solid #ccc;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 20px;
    line-height: 1.5;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;

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
