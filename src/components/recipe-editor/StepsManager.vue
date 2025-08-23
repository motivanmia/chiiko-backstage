<template>
  <div class="form-section">
    <label class="form-label">料理步驟</label>

    <div
      v-for="(step, index) in modelValue"
      :key="index"
      class="item-row"
      :class="{ 'is-dragging': draggedIndex === index }"
      @dragover.prevent
      @drop="drop(index)"
    >
      <div class="inputs-container">
        <div class="step-field">
          <label class="step-label">{{ formatStepLabel(index + 1) }}</label>
          <textarea
            v-model="modelValue[index]"
            placeholder="請輸入步驟內容"
            class="step-input"
          ></textarea>
        </div>
      </div>

      <div class="actions-container">
        <button
          @click="remove(index)"
          :disabled="modelValue.length === 1"
          class="icon-button"
          title="至少保留一筆"
        >
          <Icon icon-name="remove" />
        </button>
        <!-- 
          ===== 關鍵修正 =====
          之前的版本缺少了 @dragend 事件，這是導致高亮無法消失的根本原因。
        -->
        <button
          class="icon-button"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragend="dragEnd"
          title="拖曳換位置"
        >
          <Icon icon-name="drag" />
        </button>
      </div>
    </div>

    <BaseButton
      @click="add"
      class="add-button-override"
    >
      <Icon icon-name="plus" />
      新增步驟
    </BaseButton>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import Icon from '@/components/common/Icon.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  const props = defineProps({ modelValue: Array });
  const emit = defineEmits(['update:modelValue']);

  const add = () => emit('update:modelValue', [...props.modelValue, '']);
  const remove = (index) => {
    if (props.modelValue.length > 1)
      emit(
        'update:modelValue',
        props.modelValue.filter((_, i) => i !== index),
      );
  };

  // --- START: 完整且正確的拖曳邏輯 ---

  const draggedIndex = ref(null);

  const dragStart = (index) => {
    draggedIndex.value = index;
  };

  // 【最重要的函式】
  //  不論拖曳成功或失敗，只要一結束就觸發此函式，確保高亮狀態一定會被清除。
  const dragEnd = () => {
    draggedIndex.value = null;
  };

  const drop = (dropIndex) => {
    if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
      return;
    }
    const list = [...props.modelValue];
    const draggedItem = list.splice(draggedIndex.value, 1)[0];
    list.splice(dropIndex, 0, draggedItem);
    emit('update:modelValue', list);
  };

  // --- END: 拖曳邏輯 ---

  const numberToChinese = (num) => {
    if (typeof num !== 'number' || num < 1) return num;
    const singleDigits = '一二三四五六七八九';
    const ten = '十';
    if (num <= 10) return num === 10 ? ten : singleDigits[num - 1];
    if (num > 10 && num < 20) return ten + singleDigits[(num % 10) - 1];
    const tensDigit = Math.floor(num / 10);
    const unitDigit = num % 10;
    if (unitDigit === 0) return singleDigits[tensDigit - 1] + ten;
    return singleDigits[tensDigit - 1] + ten + singleDigits[unitDigit - 1];
  };

  const formatStepLabel = (num) => {
    return '步驟' + numberToChinese(num);
  };
</script>

<style lang="scss" scoped>
  .form-section {
    width: 800px;
    max-width: 100%;
    margin: 105px auto 1.5rem;
  }
  .form-label {
    display: block;
    font-size: 28px;
    margin-bottom: 35px;
  }

  .item-row {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 30px;
  }

  .inputs-container {
    flex-grow: 1;
  }
  .step-field {
    width: 100%;
  }
  .step-label {
    display: block;
    margin-bottom: 15px;
    font-size: 24px;
  }
  .step-input {
    width: 100%;
    height: 100px;
    padding: 12px;
    border: none;
    border-radius: 20px;
    resize: vertical;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    font-size: 20px;
    transition: background-color 0.2s ease;
  }

  /* 
    關鍵樣式：
    這個樣式會讓被拖曳的項目 (擁有 is-dragging class) 
    內部的輸入框 (.step-input) 改變背景色。
  */
  .item-row.is-dragging .step-input {
    background-color: rgba(0, 0, 0, 0.25);
  }

  .actions-container {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    width: 60px;
  }
  .icon-button {
    font-size: 20px;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .add-button-override {
    margin-top: 30px;
  }

  @media (max-width: 768px) {
    .item-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      row-gap: 8px;
    }
    .inputs-container,
    .step-field {
      display: contents;
    }
    .step-label {
      order: 1;
    }
    .actions-container {
      order: 2;
    }
    .step-input {
      order: 3;
      width: 100%;
      height: 120px;
      box-sizing: border-box;
    }
    .add-button-override {
      width: 100%;
    }
  }
</style>
