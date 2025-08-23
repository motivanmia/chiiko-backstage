<template>
  <div class="form-section ingredients-manager-component">
    <div class="title-group">
      <label class="form-label">所需食材</label>
      <span class="helper-text">食材15字以內，份量10字以內</span>
    </div>

    <!--
      ===== 關鍵修改 1 of 3 =====
      在 item-row 上綁定 class，當 draggedIndex 等於目前項目的 index 時，
      賦予 'is-dragging' class，觸發高亮樣式。
    -->
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="item-row"
      :class="{ 'is-dragging': draggedIndex === index }"
      @dragover.prevent
      @drop="drop(index)"
    >
      <div class="inputs-container">
        <input
          v-model="item.name"
          placeholder="食材"
          class="input-name"
          maxlength="15"
        />
        <input
          v-model="item.amount"
          placeholder="份量"
          class="input-amount"
          maxlength="10"
        />
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
          ===== 關鍵修改 2 of 3 =====
          在拖曳按鈕上新增 @dragend 事件監聽。
          這是確保無論拖曳成功或取消，高亮效果都能被清除的關鍵。
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

    <div class="add-button-wrapper">
      <BaseButton @click="add">
        <Icon icon-name="plus" />
        新增食材
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import Icon from '@/components/common/Icon.vue';
  import BaseButton from '@/components/common/BaseButton.vue';

  const props = defineProps({ modelValue: Array });
  const emit = defineEmits(['update:modelValue']);

  const add = () => emit('update:modelValue', [...props.modelValue, { name: '', amount: '' }]);

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
  //  不論拖曳成功 (drop) 或失敗 (取消)，只要一結束拖曳就會觸發此函式，
  //  確保高亮狀態 (draggedIndex) 一定會被清除。
  const dragEnd = () => {
    draggedIndex.value = null;
  };

  const drop = (dropIndex) => {
    // 檢查是否為有效拖放
    if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
      return;
    }

    const list = [...props.modelValue];
    const draggedItem = list.splice(draggedIndex.value, 1)[0];
    list.splice(dropIndex, 0, draggedItem);
    emit('update:modelValue', list);

    // 注意：原先在 drop 後才清空 draggedIndex 的邏輯已移至 dragEnd，
    // 這樣才能處理拖曳被取消的狀況。
  };

  // --- END: 拖曳邏輯 ---
</script>

<style lang="scss" scoped>
  /* ... 您既有的樣式維持不變 ... */
  .form-section {
    width: 800px;
    max-width: 100%;
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
  .item-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    align-items: center;
    border-radius: 20px; /* 為了讓高亮背景色有圓角，新增此行 */
    transition: background-color 0.2s ease-in-out; /* 讓背景色變化更平滑 */
  }
  .inputs-container {
    display: flex;
    flex-grow: 1;
    gap: 12px;
  }
  .input-name,
  .input-amount {
    height: 60px;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 20px;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    transition: background-color 0.2s ease; /* 讓輸入框顏色變化更平滑 */
  }

  /* 
    ===== 關鍵修改 3 of 3 =====
    這個樣式會選取到擁有 'is-dragging' class 的 .item-row 元素，
    並將其內部的兩個 input 輸入框的背景色改變，產生高亮效果。
  */
  .item-row.is-dragging .input-name,
  .item-row.is-dragging .input-amount {
    background-color: rgba(0, 0, 0, 0.15); /* 您可以調整成喜歡的高亮顏色 */
  }

  .input-name {
    flex: 4;
  }
  .input-amount {
    flex: 3;
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
  .add-button-wrapper {
    margin-top: 30px;
  }
  .add-button-wrapper > :deep(button) {
    width: 100%;
  }

  @media (max-width: 768px) {
    .form-label {
      font-size: 20px;
    }
    .helper-text {
      font-size: 14px;
    }
    .item-row {
      gap: 10px;
    }
    .inputs-container {
      display: flex;
      flex-grow: 1;
      gap: 10px;
      min-width: 0;
    }
    .input-name {
      flex: 3;
      min-width: 0;
    }
    .input-amount {
      flex: 1;
      min-width: 0;
    }
    .actions-container {
      gap: 0px;
    }
  }
</style>
