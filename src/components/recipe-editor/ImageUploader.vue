<template>
  <div
    class="upload-zone"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <!-- 
      【✅ 核心修正 ✅】
      現在有三種顯示狀態
    -->

    <!-- 狀態一：審核模式 (有初始圖片，且使用者未選擇新圖) -->
    <div
      v-if="initialImageUrl && !previewUrl"
      class="image-container"
    >
      <img
        :src="initialImageUrl"
        alt="食譜圖片"
        class="image-preview"
      />
      <!-- 在審核模式下，可以選擇不顯示任何按鈕，或者顯示一個不可點擊的提示 -->
      <!-- 如果您的 .is-review-readonly CSS 作用於此，按鈕會自動禁用 -->
      <BaseButton
        @click="triggerFile"
        class="change-button-override"
      >
        更換圖片
      </BaseButton>
    </div>

    <!-- 狀態二：新增/編輯模式 (使用者已選擇新圖) -->
    <div
      v-else-if="previewUrl"
      class="image-container"
    >
      <img
        :src="previewUrl"
        alt="新圖片預覽"
        class="image-preview"
      />
      <BaseButton
        @click="removeImage"
        variant="secondary"
        class="remove-button-override"
      >
        移除
      </BaseButton>
    </div>

    <!-- 狀態三：新增/編輯模式 (還未選圖) -->
    <div
      v-else
      class="placeholder-content"
      @click="triggerFile"
    >
      <BaseButton class="upload-button-override">選擇食譜圖片</BaseButton>
    </div>

    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      accept="image/*"
      style="display: none"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import BaseButton from '@/components/common/BaseButton.vue';

  const props = defineProps({
    modelValue: { type: File, default: null }, // v-model:file
    initialImageUrl: { type: String, default: null },
  });

  const emit = defineEmits(['update:modelValue']);

  const previewUrl = ref(null);
  const fileInput = ref(null);

  // 當父層傳來的 initialImageUrl 變化時，清空本地的預覽
  watch(
    () => props.initialImageUrl,
    () => {
      previewUrl.value = null;
    },
    { immediate: true },
  );

  const triggerFile = () => fileInput.value?.click();

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      previewUrl.value = URL.createObjectURL(file);
      emit('update:modelValue', file);
    }
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => processFile(e.dataTransfer.files[0]);

  function removeImage() {
    previewUrl.value = null;
    emit('update:modelValue', null);
    if (fileInput.value) fileInput.value.value = '';
  }
</script>

<style lang="scss" scoped>
  /* 桌面版樣式 */
  .upload-zone {
    position: relative;
    height: 400px;
    width: 480px;
    background-color: #fff7ed;
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin 由父層的 gap 控制，這裡不需要 */
    border-radius: 20px;
  }

  .image-preview {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
    opacity: 0.4;
  }

  .upload-content {
    z-index: 1;
  }

  .file-input {
    display: none;
  }

  .upload-button-override {
    width: 225px;
  }

  /* 
    FIX: 這是完整的 RWD 樣式修正
  */
  @media (max-width: 768px) {
    .upload-zone {
      /* 1. 將固定寬度改為 100%，讓它自動填滿父層容器 */
      width: 100%;
      /* 2. 縮小高度以適應手機螢幕 */
      height: 300px;
    }

    .upload-button-override {
      /* 3. 也可以稍微縮小按鈕，讓視覺更協調 */
      width: 200px;
      height: 50px;
      font-size: 20px;
    }
  }
</style>
