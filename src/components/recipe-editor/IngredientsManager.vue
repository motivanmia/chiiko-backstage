<template>
  <div class="form-section ingredients-manager-component">
    <div class="title-group">
      <label class="form-label">所需食材</label>
      <span class="helper-text">食材15字以內，份量10字以內</span>
    </div>

    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="item-row"
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

    <div class="add-button-wrapper">
      <BaseButton @click="add">
        <Icon icon-name="plus" />
        新增食材
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
  // ... 您的 script 內容完全不需要修改 ...
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
</script>

<style lang="scss" scoped>
  /* 桌面版樣式 */
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

  /* 
    FIX: 讓「新增食材」按鈕寬度變為 100%，使其對齊上方輸入框 
    使用 :deep() 來確保能選取到 BaseButton 元件內的根元素
  */
  .add-button-wrapper > :deep(button) {
    width: 100%;
  }

  /* RWD 樣式修正 */
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
