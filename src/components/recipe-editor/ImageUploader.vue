<template>
  <div
    class="upload-zone"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <label
      for="file-input"
      class="image-preview-label"
    >
      <!-- 直接使用 previewUrl 來顯示圖片 -->
      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="image-preview"
      />
      <div
        v-else
        class="placeholder-content"
      >
        <!-- 可以放一些提示文字或圖示 -->
      </div>
    </label>

    <div class="upload-button-container">
      <BaseButton
        @click="triggerFile"
        class="upload-button-override"
      >
        {{ previewUrl ? '更換圖片' : '選擇食譜圖片' }}
      </BaseButton>
    </div>

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
  import { ref, computed } from 'vue';
  import BaseButton from '@/components/common/BaseButton.vue';

  // ✅ 步驟 1: 修正 props 定義，與父組件的用法完全匹配
  const props = defineProps({
    // 用來接收 v-model:file 的 File 物件
    file: {
      type: Object, // File 物件
      default: null,
    },
    // 用來接收 :initial-image-url 的字串
    initialImageUrl: {
      type: String,
      default: '',
    },
  });

  // ✅ 步驟 2: 定義 emit，這是 v-model:file 能夠工作的關鍵
  const emit = defineEmits(['update:file']);

  const fileInput = ref(null);
  // 新增一個 ref 來儲存本地產生的預覽 URL
  const localPreviewUrl = ref('');

  // ✅ 步驟 3: 簡化 computed 邏輯
  const previewUrl = computed(() => {
    // 優先顯示本地新選擇的圖片預覽
    if (localPreviewUrl.value) {
      return localPreviewUrl.value;
    }
    // 其次顯示從父層傳入的既有圖片 URL (編輯模式)
    if (props.initialImageUrl) {
      return props.initialImageUrl;
    }
    // 都沒有就返回空
    return '';
  });

  const triggerFile = () => fileInput.value?.click();

  // 統一處理檔案更新的函式
  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      // 產生本地預覽 URL
      localPreviewUrl.value = URL.createObjectURL(selectedFile);
      // ✅ 透過 emit 通知父組件，更新 file ref
      emit('update:file', selectedFile);
    } else {
      // 如果使用者取消選擇或選擇了無效檔案
      // 注意：我們不清空 localPreviewUrl，讓預覽圖維持在舊的狀態
      // 並且通知父組件檔案為 null
      emit('update:file', null);
    }
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);
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
