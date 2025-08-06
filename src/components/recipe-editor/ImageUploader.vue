<template>
  <div
    class="upload-zone"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <img
      v-if="previewUrl"
      :src="previewUrl"
      class="image-preview"
    />
    <div class="upload-content">
      <BaseButton
        @click="triggerFile"
        class="upload-button-override"
      >
        新增食譜圖片
      </BaseButton>
    </div>
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      class="file-input"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import BaseButton from '@/components/common/BaseButton.vue';

  const previewUrl = ref('');
  const fileInput = ref(null);

  const triggerFile = () => fileInput.value?.click();

  const updatePreview = (file) => {
    if (file) {
      previewUrl.value = URL.createObjectURL(file);
      // You can emit the file to the parent component here if needed
      // emit('file-updated', file);
    }
  };

  const handleFileChange = (e) => updatePreview(e.target.files[0]);
  const handleDrop = (e) => updatePreview(e.dataTransfer.files[0]);
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
