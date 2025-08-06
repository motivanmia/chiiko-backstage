<template>
  <div class="form-section">
    <label class="form-label">料理步驟</label>

    <div
      v-for="(step, index) in modelValue"
      :key="index"
      class="item-row"
      @dragover.prevent
      @drop="drop(index)"
    >
      <div class="inputs-container">
        <div class="step-field">
          <label class="step-label">步驟 {{ numberToChinese(index + 1) }}</label>
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
        <button
          class="icon-button"
          draggable="true"
          @dragstart="dragStart(index)"
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
  const draggedIndex = ref(null);
  const dragStart = (index) => {
    draggedIndex.value = index;
  };
  const drop = (dropIndex) => {
    if (draggedIndex.value === null) return;
    const list = [...props.modelValue];
    const draggedItem = list.splice(draggedIndex.value, 1)[0];
    list.splice(dropIndex, 0, draggedItem);
    emit('update:modelValue', list);
    draggedIndex.value = null;
  };
  const numberToChinese = (num) => '一二三四五六七八九十'[num - 1] || num;
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
    /* FIX #1: 料理步驟與步驟一的間距為 35px */
    margin-bottom: 35px;
  }

  /* FIX #2: 使用 align-items: center 來讓整行垂直居中對齊 */
  .item-row {
    display: flex;
    gap: 16px;
    align-items: center; /* 魔法在這裡！ */
    /* FIX #3: 輸入框與下一個步驟的間距為 30px */
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
    /* FIX #4: 步驟一和輸入框的間距為 15px */
    margin-bottom: 15px;
    font-size: 28px;
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
  }

  /* FIX #5: 讓按鈕區和 IngredientsManager 的完全一樣 */
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

  /* FIX #6: 新增步驟與上面的元件的間距為 30px */
  .add-button-override {
    margin-top: 30px;
  }

  @media (max-width: 768px) {
    /* 1. 設定每一列 (item-row) 為 Flex 容器 */
    .item-row {
      display: flex;
      flex-wrap: wrap; /* 允許內容換行 */
      justify-content: space-between; /* 將第一行的元素推向左右兩側 */
      align-items: center; /* 讓第一行的元素垂直置中 */
      row-gap: 8px; /* 設定第一行 (標題+按鈕) 和第二行 (輸入框) 之間的間距 */
    }

    /* 2. 關鍵修正：讓這兩個容器在排版上「消失」，
     使其內部的子元素可以參與 item-row 的 Flex 排版 */
    .inputs-container,
    .step-field {
      display: contents;
    }

    /* 3. 現在可以正確地使用 order 重新定義視覺順序 */

    /* 「步驟一」標籤，視覺上排第一 (左上角) */
    .step-label {
      order: 1;
    }

    /* 右側按鈕區塊，視覺上排第二 (右上角) */
    .actions-container {
      order: 2;
    }

    /* 文字輸入框，視覺上排第三，並強制它佔滿一整行換到下一行 */
    .step-input {
      order: 3;
      width: 100%; /* 寬度 100%，使其強制換行 */
      height: 120px; /* 您可以自訂需要的高度 */
      box-sizing: border-box;
    }

    /* (可選) 為了整體視覺一致性，也讓「新增步驟」按鈕在手機上滿版 */
    .add-button-override {
      width: 100%;
    }
  }
</style>
