<template>
  <div
    class="modal-overlay"
    @click.self="handleClose"
  >
    <div class="recipe-editor">
      <div class="form-content-wrapper">
        <h1 class="recipe-editor__title">{{ pageTitle }}</h1>

        <ImageUploader
          v-model:file="file"
          :initial-image-url="initialImageUrl"
        />

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
          :categories="categories"
          v-model:category="form.category"
          v-model:time="form.time"
          v-model:servings="form.servings"
        />
        <IngredientsManager v-model="form.ingredients" />
        <StepsManager v-model="form.steps" />

        <div class="action-group">
          <BaseButton
            @click="handleClose"
            variant="secondary"
            class="action-button-override"
          >
            取消
          </BaseButton>
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
    </div>
  </div>
</template>

<script setup>
  import {
    ref,
    reactive,
    computed,
    defineEmits,
    defineProps,
    watch,
    onMounted,
    onUnmounted,
  } from 'vue';
  import axios from 'axios';
  import BaseButton from '@/components/common/BaseButton.vue';
  import ImageUploader from '@/components/recipe-editor/ImageUploader.vue';
  import TagInput from '@/components/recipe-editor/TagInput.vue';
  import RecipeMeta from '@/components/recipe-editor/RecipeMeta.vue';
  import IngredientsManager from '@/components/recipe-editor/IngredientsManager.vue';
  import StepsManager from '@/components/recipe-editor/StepsManager.vue';
  import FormField from '@/components/recipe-editor/InputSingleline.vue';

  const STATUS = { PENDING: 0, ON: 1, OFF: 2, DRAFT: 3 };

  const props = defineProps({
    initialData: { type: Object, default: null },
  });

  const emit = defineEmits(['close', 'save-success']);
  const handleClose = () => emit('close');

  const initialImageUrl = ref(null);
  const file = ref(null);

  const categories = [
    { value: 'single', label: '一人料理', id: 1 },
    { value: 'family', label: '家庭聚餐', id: 2 },
    { value: 'romantic', label: '浪漫晚餐', id: 3 },
    { value: 'outdoor', label: '戶外料理', id: 4 },
    { value: 'lazy', label: '懶人快煮', id: 5 },
    { value: 'fitness', label: '健身/減糖餐', id: 6 },
    { value: 'budget', label: '低預算料理', id: 7 },
    { value: 'festival', label: '慶生/節慶料理', id: 8 },
  ];

  const form = reactive({
    title: '',
    description: '',
    tags: [],
    category: 'single',
    time: '5~10',
    servings: '1~2',
    ingredients: [{ name: '', amount: '' }],
    steps: [''],
    status: STATUS.DRAFT,
  });

  const isEditing = computed(() => !!props.initialData);
  const pageTitle = computed(() => (isEditing.value ? '編輯食譜' : '新增食譜'));

  const titleWarning = computed(() => (form.title.length > 15 ? '標題不能超過 15 字喔！' : ''));
  const descriptionWarning = computed(() =>
    form.description.length > 40 ? '內文太長囉，麻煩請幫我濃縮在40字以內！' : '',
  );

  watch(
    () => props.initialData,
    (newData) => {
      if (!newData) return;
      const recipe = newData.recipe;
      const ingredients = newData.ingredients;
      const steps = newData.steps;

      if (recipe) {
        form.title = recipe.name || '';
        form.description = recipe.content || '';
        form.tags = recipe.tag ? recipe.tag.split('#').filter(Boolean) : [];
        const foundCategory = categories.find((c) => c.id === recipe.recipe_category_id);
        form.category = foundCategory ? foundCategory.value : 'single';
        form.time = recipe.cooked_time || '5~10';
        form.servings = recipe.serving || '1~2';
        form.status = recipe.status ?? STATUS.DRAFT;
        form.ingredients =
          Array.isArray(ingredients) && ingredients.length
            ? ingredients.map((i) => ({ name: i.name, amount: i.serving }))
            : [{ name: '', amount: '' }];
        form.steps = Array.isArray(steps) && steps.length ? steps.map((s) => s.content) : [''];
        initialImageUrl.value = recipe.image
          ? `${import.meta.env.VITE_API_BASE}/uploads/${recipe.image}`
          : null;
      }
    },
    { immediate: true, deep: true },
  );

  // ✅ **【邏輯同步核心】**
  // 整個 submitRecipe 函式採用前台的「統合式」設計
  const submitRecipe = async (statusCode) => {
    // 步驟 1: 前端驗證
    const errors = [];
    if ([STATUS.PENDING, STATUS.ON].includes(statusCode)) {
      if (!form.title.trim()) errors.push('請輸入食譜名稱。');
      if (!form.description.trim()) errors.push('請輸入簡介。');
      if (!file.value && !initialImageUrl.value) errors.push('請上傳一張食譜圖片。');
      // ... 其他驗證可以視需求加入 ...
    }
    if (errors.length > 0) {
      alert('發布前請修正以下問題：\n\n- ' + errors.join('\n- '));
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      let finalImageName = '';

      // 步驟 2: 處理圖片
      if (file.value) {
        const formData = new FormData();
        formData.append('image', file.value);
        // 注意：後台的上傳 API 路徑可能不同，請確認為 /admin/recipe/upload_image.php
        const imageRes = await axios.post(`${apiBase}/admin/recipe/upload_image.php`, formData, {
          withCredentials: true,
        });
        if (imageRes.data.status === 'success' && imageRes.data.imagePath) {
          finalImageName = imageRes.data.imagePath;
        } else {
          throw new Error(imageRes.data.message || '圖片上傳失敗');
        }
      } else if (isEditing.value && initialImageUrl.value) {
        finalImageName = initialImageUrl.value.split('/').pop();
      }

      if (!finalImageName && [STATUS.PENDING, STATUS.ON].includes(statusCode)) {
        throw new Error('請上傳一張食譜圖片。');
      }

      // 步驟 3: 將所有資料打包成一個 Payload
      const managerId = 1; // 後台發布，寫死管理員 ID
      const selectedCategory = categories.find((c) => c.value === form.category);

      const recipePayload = {
        recipe_id: isEditing.value ? props.initialData.recipe.recipe_id : null,
        user_id: null, // 後台發布，user_id 為 null
        manager_id: managerId,
        recipe_category_id: selectedCategory ? selectedCategory.id : null,
        name: form.title,
        content: form.description,
        serving: form.servings,
        image: finalImageName,
        cooked_time: form.time,
        status: statusCode,
        tag: form.tags.map((t) => `#${t}`).join(''),
        // **【關鍵】** 將食材和步驟一起打包
        ingredients: form.ingredients.filter((i) => i.name && i.amount),
        steps: form.steps
          .map((step, index) => ({ content: step, order: index + 1 }))
          .filter((s) => s.content && s.content.trim()),
      };

      // 步驟 4: 一次性提交到後台的 post_recipe.php
      // 注意：這裡的 API Endpoint 應為後台專用的路徑
      const apiEndpoint = isEditing.value
        ? `${apiBase}/recipe/update_recipe.php` // 編輯的 API 請自行替換
        : `${apiBase}/recipe/post_recipe.php`;

      await axios.post(apiEndpoint, recipePayload, {
        withCredentials: true,
      });

      // 步驟 5: 成功回饋
      alert(statusCode === STATUS.DRAFT ? '✅ 草稿已儲存！' : '🎉 食譜已成功發布！');
      emit('save-success');
      handleClose();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || '發生未知錯誤';
      console.error('操作錯誤:', error);
      alert(`操作失敗：\n${message}`);
    }
  };

  const saveDraft = () => submitRecipe(STATUS.DRAFT);
  const publishRecipe = () => submitRecipe(STATUS.ON);

  onMounted(() => {
    document.body.style.overflow = 'hidden';
  });
  onUnmounted(() => {
    document.body.style.overflow = '';
  });
</script>

<style lang="scss" scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5vh 20px;
    box-sizing: border-box;
  }

  .recipe-editor {
    width: 1200px;
    max-width: 100%;
    background-color: #ead7c4;
    padding: 32px;
    border-radius: 20px;
    box-sizing: border-box;
    margin-top: auto;
    margin-bottom: auto;
  }

  .back-button {
    display: none;
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
    width: 220px;
    font-size: 32px;
  }

  @media (max-width: 1500px) {
    .recipe-editor {
      width: 95vw;
      padding: 20px 15px;
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
    .action-group {
      flex-direction: row;
      width: 100%;
      gap: 10px;
      margin-top: 40px;
    }
    .action-button-override {
      width: 100%;
      font-size: 18px;
      padding: 12px 0;
    }
  }

  .status-dropdown-btn {
    display: inline-block;
    width: 200px;
    height: 140px;
    border-radius: 20px;
    text-align: center;
    line-height: 60px;
  }

  :deep(.el-dropdown-menu__item.font) {
    font-size: 32px;
    padding: 10px 0;
  }

  .is-review-readonly
    :where(
      input,
      textarea,
      select,
      label,
      .el-input,
      .el-input__wrapper,
      .el-select,
      .el-select__wrapper,
      .el-tag,
      .el-upload,
      .el-button,
      button,
      [contenteditable]
    ) {
    pointer-events: none !important;
    user-select: none !important;
  }

  .is-review-readonly .action-group,
  .is-review-readonly .action-group * {
    pointer-events: auto !important;
    user-select: auto !important;
    opacity: 1 !important;
  }
</style>
