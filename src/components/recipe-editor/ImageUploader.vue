<template>
  <div
    class="upload-zone"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <!-- 為了更好的使用者體驗，我們將點擊事件加在整個預覽圖上 -->
    <label
      for="file-input"
      class="image-preview-label"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="image-preview"
      />
      <!-- 新增一個預設的 placeholder 狀態 -->
      <div
        v-else
        class="placeholder-content"
      ></div>
    </label>

    <!-- 將按鈕放在外部，或者您可以將它完全移除，讓使用者直接點擊預覽區 -->
    <div class="upload-button-container">
      <BaseButton
        @click="triggerFile"
        class="upload-button-override"
      >
        選擇食譜圖片
      </BaseButton>
    </div>

    <!-- 真正用來選擇檔案的 input 元素，保持隱藏 -->
    <input
      type="file"
      ref="fileInput"
      id="file-input"
      accept="image/*"
      class="file-input"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import BaseButton from '@/components/common/BaseButton.vue';

  // ⭐️ 核心修改 1: 宣告這個元件會發出一個叫做 `update:file` 的事件
  const emit = defineEmits(['update:file']);

  const previewUrl = ref('');
  const fileInput = ref(null);

  // 當使用者點擊「選擇圖片」按鈕時，觸發隱藏的 input 點擊事件
  const triggerFile = () => fileInput.value?.click();

  // 統一處理檔案更新的函式
  const processFile = (file) => {
    // 驗證是否有檔案，以及檔案是否為圖片類型
    if (file && file.type.startsWith('image/')) {
      // 產生一個暫時的 URL，用來在畫面上預覽圖片
      previewUrl.value = URL.createObjectURL(file);

      // ⭐️ 核心修改 2: 【最關鍵的一步】
      //    觸發 'update:file' 事件，並將使用者選擇的檔案物件 (file)
      //    當作「包裹」一起發送給父層 (RecipeEditPage.vue)
      emit('update:file', file);
    } else {
      // 如果選擇的不是圖片或取消選擇，就清空
      previewUrl.value = '';
      emit('update:file', null);
      alert('請選擇有效的圖片檔案 (jpg, png, gif)。');
    }
  };

  // 當使用者透過「點擊」選擇檔案時觸發
  const handleFileChange = (e) => processFile(e.target.files[0]);

  // 當使用者透過「拖曳」放入檔案時觸發
  const handleDrop = (e) => processFile(e.dataTransfer.files[0]);
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
