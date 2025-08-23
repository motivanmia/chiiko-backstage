<template>
  <div
    class="modal-overlay"
    @click.self="handleClose"
  >
    <div class="recipe-editor">
      <div class="form-content-wrapper">
        <h1 class="recipe-editor__title">編輯食譜</h1>
        <ImageUploader v-model:file="file" />
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
            取消食譜
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
  import { ref, reactive, computed, defineEmits, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import BaseButton from '@/components/common/BaseButton.vue';
  import ImageUploader from '@/components/recipe-editor/ImageUploader.vue';
  import TagInput from '@/components/recipe-editor/TagInput.vue';
  import RecipeMeta from '@/components/recipe-editor/RecipeMeta.vue';
  import IngredientsManager from '@/components/recipe-editor/IngredientsManager.vue';
  import StepsManager from '@/components/recipe-editor/StepsManager.vue';

  const emit = defineEmits(['close', 'save-success']);
  const handleClose = () => {
    emit('close');
  };

  const router = useRouter();
  const isAdmin = ref(true);

  // ✅ 恢復：將 categories 陣列定義在元件內部，確保數據源穩定
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

  // ✅ 恢復：form 物件的結構回到最原始、穩定的版本
  const form = reactive({
    title: '',
    description: '',
    tags: [],
    category: 'single', // 使用字串 'single' 作為 v-model 的值
    time: '5~10',
    servings: '1~2',
    ingredients: [{ name: '', amount: '' }],
    steps: [''],
  });

  const file = ref(null);
  const titleWarning = computed(() => (form.title.length > 15 ? '標題不能超過 15 字喔！' : ''));
  const descriptionWarning = computed(() =>
    form.description.length > 40 ? '內文太長囉，麻煩請幫我濃縮在40字以內！' : '',
  );

  const submitRecipe = async (statusCode) => {
    const isPublishingAction = statusCode === 0 || statusCode === 1;
    if (isPublishingAction) {
      const errors = [];
      if (!form.title.trim()) errors.push('請輸入食譜名稱。');
      if (!form.description.trim()) errors.push('請輸入簡介。');
      if (!file.value) errors.push('請上傳一張食譜圖片。');
      if (form.tags.length === 0) errors.push('請至少新增一個食譜標籤。');
      if (form.ingredients.some((item) => !item.name.trim() || !item.amount.trim()))
        errors.push('所有「所需食材」和「份量」的欄位都必須填寫。');
      if (form.steps.some((step) => !step.trim())) errors.push('所有「料理步驟」都必須填寫內容。');
      if (errors.length > 0) {
        alert('發布前請修正以下問題：\n\n- ' + errors.join('\n- '));
        return;
      }
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      let imagePath = '';

      if (file.value) {
        const formData = new FormData();
        formData.append('image', file.value);
        const imageRes = await axios.post(`${apiBase}/recipe/upload_image.php`, formData);

        if (imageRes.data.status !== 'success') {
          throw new Error(imageRes.data.message || '圖片上傳失敗');
        }
        imagePath = imageRes.data.imagePath;
      }

      const getLoggedInUserId = () => 1;
      const getLoggedInAdminId = () => 1;

      // ✅ 恢復：在提交前，根據 form.category 的字串值，從內部的靜態陣列中查找對應的 ID
      const selectedCategory = categories.find((c) => c.value === form.category);

      const recipePayload = {
        user_id: isAdmin.value ? null : getLoggedInUserId(),
        manage_id: isAdmin.value ? getLoggedInAdminId() : null,
        recipe_category_id: selectedCategory ? selectedCategory.id : null,
        name: form.title,
        content: form.description,
        serving: form.servings,
        image: imagePath,
        cooked_time: form.time,
        status: statusCode,
        tag: form.tags.map((t) => `#${t}`).join(''),
      };

      const jsonHeaders = { headers: { 'Content-Type': 'application/json' } };

      const { data: recipeRes } = await axios.post(
        `${apiBase}/recipe/post_recipe.php`,
        recipePayload,
        jsonHeaders,
      );

      const newRecipeId = recipeRes.recipe_id;
      if (!newRecipeId) throw new Error('後端未回傳 recipe_id');

      const ingredientsPayload = {
        recipe_id: newRecipeId,
        ingredients: form.ingredients.filter((i) => i.name && i.amount),
      };
      await axios.post(`${apiBase}/recipe/post_ingredients.php`, ingredientsPayload, jsonHeaders);

      const stepsPayload = {
        recipe_id: newRecipeId,
        steps: form.steps.filter((s) => s && s.trim()),
      };
      await axios.post(`${apiBase}/recipe/post_steps.php`, stepsPayload, jsonHeaders);

      alert(isPublishingAction ? '🎉 食譜已成功發布！' : '✅ 草稿已儲存！');
      emit('save-success');
      handleClose();
      if (statusCode === 0) router.push('/');
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || '發生未知錯誤，請檢查主控台';
      console.error('發布/儲存錯誤:', error);
      alert(`操作失敗：\n${message}`);
    }
  };

  const saveDraft = () => submitRecipe(3);
  const publishRecipe = () => {
    const finalStatusCode = isAdmin.value ? 1 : 0;
    submitRecipe(finalStatusCode);
  };

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
    /* 讓遮罩層自己產生滾動條 */
    overflow-y: auto;
    /* 使用 display: flex 來輕鬆實現垂直和水平置中 */
    display: flex;
    justify-content: center; /* 水平置中 */
    align-items: center; /* 垂直置中 */
    /* 為了讓內容在滾動時有呼吸空間，使用 padding */
    padding: 5vh 20px;
    box-sizing: border-box; /* 確保 padding 不會讓寬度溢出 */
  }

  /* 
    FIX 2: 我們不再需要 .modal-content，
    直接對 .recipe-editor 進行樣式調整，
    讓它在 flex 容器中能正確顯示。
  */
  .recipe-editor {
    width: 1200px;
    max-width: 100%;
    background-color: #ead7c4;
    padding: 32px;
    border-radius: 20px;
    box-sizing: border-box;
    /* 
      因為父層 align-items: center 會讓內容垂直置中，
      如果內容超長需要滾動，我們需要讓它從頂部對齊。
      margin-top: auto 和 margin-bottom: auto 可以在 flex 容器中創造奇效。
    */
    margin-top: auto;
    margin-bottom: auto;
  }

  /* 移除不再需要的 .page-container */
  /* .page-container { ... } */

  /* --- 以下是您原本的樣式，大部分維持不變 --- */
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
</style>
