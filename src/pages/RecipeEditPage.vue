<template>
  <div class="page-container">
    <RouterLink
      to="/home"
      tag="button"
      class="back-button"
      @click="goBack"
    >
      <Icon icon-name="leftA" />
      回前頁
    </RouterLink>

    <div class="recipe-editor">
      <div class="form-content-wrapper">
        <h1 class="recipe-editor__title">編輯食譜</h1>
        <ImageUploader />
        <FormField
          label="輸入食譜名稱"
          v-model="form.title"
          :maxLength="15"
          :warning="titleWarning"
          :placeholder-desktop="'例：香煎豆腐卷（最多15字）'"
          :placeholder-mobile="'例：三色豆（15字內）'"
        />
        <FormField
          label="簡介"
          v-model="form.description"
          :maxLength="40"
          :warning="descriptionWarning"
        >
          <textarea
            v-model="form.description"
            placeholder="請輸入食譜描述（最多40字）"
            maxlength="40"
          ></textarea>
        </FormField>
        <TagInput v-model="form.tags" />
        <RecipeMeta
          v-model:category="form.category"
          v-model:time="form.time"
          v-model:servings="form.servings"
        />
        <IngredientsManager v-model="form.ingredients" />
        <StepsManager v-model="form.steps" />
      </div>
    </div>

    <div class="action-group">
      <BaseButton
        @click="saveDraft"
        variant="secondary"
        class="action-button-override"
      >
        暫存草稿
      </BaseButton>
      <BaseButton
        @click="publishRecipe"
        variant="primary"
        class="action-button-override"
      >
        發布食譜
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
  // 您的 script 內容完全不需要修改
  import { reactive, computed } from 'vue';
  import Icon from '@/components/common/Icon.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  import ImageUploader from '@/components/recipe-editor/ImageUploader.vue';
  import FormField from '@/components/recipe-editor/FormField.vue';
  import TagInput from '@/components/recipe-editor/TagInput.vue';
  import RecipeMeta from '@/components/recipe-editor/RecipeMeta.vue';
  import IngredientsManager from '@/components/recipe-editor/IngredientsManager.vue';
  import StepsManager from '@/components/recipe-editor/StepsManager.vue';
  const form = reactive({
    title: '',
    description: '',
    tags: [],
    category: 'single',
    time: 5,
    servings: 2,
    ingredients: [{ name: '', amount: '' }],
    steps: [''],
  });
  const titleWarning = computed(() => (form.title.length > 15 ? '標題不能超過 15 字喔！' : ''));
  const descriptionWarning = computed(() =>
    form.description.length > 40 ? '內文太長囉，麻煩請幫我濃縮在40字以內！' : '',
  );
  const saveDraft = () => alert('草稿已儲存');
  const publishRecipe = () => {
    const errors = [];
    if (!form.title.trim()) {
      errors.push('請輸入食譜名稱。');
    }
    if (!form.description.trim()) {
      errors.push('請輸入簡介。');
    }
    if (form.tags.length === 0) {
      errors.push('請至少新增一個食譜標籤。');
    }
    if (form.ingredients.some((item) => !item.name.trim() || !item.amount.trim())) {
      errors.push('所有「所需食材」和「份量」的欄位都必須填寫。');
    }
    if (form.steps.some((step) => !step.trim())) {
      errors.push('所有「料理步驟」都必須填寫內容。');
    }
    if (errors.length > 0) {
      alert('請修正以下問題：\n\n- ' + errors.join('\n- '));
      return;
    }
    alert('🎉 食譜已成功發布！');
  };
</script>

<style lang="scss" scoped>
  /* This style block contains the complete and final layout logic. */
  .page-container {
    position: relative;
    padding: 100px 32px 180px 32px;
  }

  .back-button {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(calc(-600px - 150px)); /* (Card Width / 2) + Gap */
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #d6b59c;
    border: none;
    border-radius: 20px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #d8c9b8;
    }
  }

  .recipe-editor {
    width: 1200px;
    max-width: 100%;
    background-color: #ead7c4;
    padding: 32px;
    border-radius: 20px;
    box-sizing: border-box;
    margin: 0 auto;
  }

  .form-content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
  .form-content-wrapper > * {
    margin: 0;
  }
  input,
  textarea {
    font-size: 20px;
  }
  :deep(.tag-input-component) + :deep(.recipe-meta-component) {
    margin-top: 15px;
  }
  :deep(.recipe-meta-component) + :deep(.ingredients-manager-component) {
    margin-top: 70px;
  }

  .recipe-editor__title {
    font-size: 32px;
    text-align: center;
    font-weight: bold;
  }

  .action-group {
    display: flex;
    justify-content: space-between;
    width: 800px;
    max-width: 100%;
    margin: 100px auto 0;
  }

  .action-button-override {
    width: 320px;
    font-size: 32px;
  }

  /* This is the complete and final RWD block */
  @media (max-width: 1500px) {
    .page-container {
      padding: 20px 10px 80px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .back-button {
      position: static;
      transform: none;
      margin: 0 0 20px 0;
      align-self: flex-start;
    }

    .recipe-editor {
      width: 100%;
      padding: 20px 10px;
    }

    .recipe-editor__title {
      font-size: 28px;
    }

    :deep(.form-field),
    :deep(.form-section),
    :deep(.meta-row) {
      width: 100% !important;
      max-width: 100% !important;
    }

    /* 
      FIX: 這裡是唯一的修改點
      我們將 flex-direction 改為 row，並讓按鈕平分寬度
    */
    .action-group {
      flex-direction: row; /* 改回水平排列 */
      width: 100%;
      gap: 16px; /* 按鈕之間的間距 */
      margin-top: 40px;
    }
    .action-button-override {
      width: 100%; /* 讓 flexbox 自動計算寬度 */
      font-size: 24px;
    }
  }

  .back-button {
    text-decoration: none; /* 去掉底線 */
  }
</style>
