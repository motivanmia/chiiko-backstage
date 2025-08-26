<template>
  <div
    class="modal-overlay"
    @click.self="handleClose"
  >
    <div class="recipe-editor">
      <div
        class="form-content-wrapper"
        :class="{ 'is-review-readonly': isReviewMode }"
      >
        <h1 class="recipe-editor__title">{{ modalTitle }}</h1>

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
            取消食譜
          </BaseButton>

          <template v-if="isReviewMode">
            <el-dropdown @command="form.status = $event">
              <BaseButton
                variant="primary"
                class="action-button-override"
              >
                {{ form.status === 1 ? '通過審核' : form.status === 2 ? '駁回 (下架)' : '未審核' }}
              </BaseButton>
              <template #dropdown>
                <el-dropdown-menu class="status-dropdown-btn">
                  <el-dropdown-item
                    :command="0"
                    class="font"
                  >
                    未審核
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="1"
                    class="font"
                  >
                    通過審核
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="2"
                    class="font"
                  >
                    駁回 (下架)
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <BaseButton
              @click="submitReview"
              variant="primary"
              class="action-button-override"
            >
              提交審核
            </BaseButton>
          </template>

          <template v-else-if="isEditingOwnRecipe">
            <BaseButton
              @click="submitUpdate"
              variant="primary"
              class="action-button-override"
            >
              修改食譜
            </BaseButton>
          </template>

          <template v-else>
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
          </template>
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
    onMounted,
    onUnmounted,
    defineProps,
    watch,
  } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import BaseButton from '@/components/common/BaseButton.vue';
  import ImageUploader from '@/components/recipe-editor/ImageUploader.vue';
  import TagInput from '@/components/recipe-editor/TagInput.vue';
  import RecipeMeta from '@/components/recipe-editor/RecipeMeta.vue';
  import IngredientsManager from '@/components/recipe-editor/IngredientsManager.vue';
  import StepsManager from '@/components/recipe-editor/StepsManager.vue';

  const STATUS = { PENDING: 0, ON: 1, OFF: 2, DRAFT: 3 };
  const REVIEW_UI = { APPROVE: 1, REJECT: 2 };
  const uiToBackendStatus = (uiVal) => {
    if (uiVal === REVIEW_UI.APPROVE) return STATUS.ON;
    if (uiVal === REVIEW_UI.REJECT) return STATUS.OFF;
    return STATUS.PENDING;
  };
  const backendToUiStatus = (status) => {
    if (status === STATUS.ON) return REVIEW_UI.APPROVE;
    if (status === STATUS.OFF) return REVIEW_UI.REJECT;
    return null;
  };

  const props = defineProps({
    initialData: { type: Object, default: null },
  });

  const emit = defineEmits(['close', 'save-success']);
  const handleClose = () => emit('close');

  const router = useRouter();
  const isAdmin = ref(true);
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
    status: null,
  });

  const isEditing = computed(() => !!props.initialData);

  // 【✅ 唯一的小優化 ✅】
  // 增加對 props.initialData.recipe 的可選鏈檢查，讓程式碼更穩健
  const isMemberRecipe = computed(() => {
    const u = props.initialData?.recipe?.user_id;
    return u !== undefined && u !== null;
  });

  const isReviewMode = computed(() => isAdmin.value && isEditing.value && isMemberRecipe.value);
  const isEditingOwnRecipe = computed(
    () => isAdmin.value && isEditing.value && !isMemberRecipe.value,
  );

  const modalTitle = computed(() => {
    if (isReviewMode.value) return '審核食譜';
    if (isEditingOwnRecipe.value) return '修改食譜';
    return '新增食譜';
  });

  const titleWarning = computed(() => (form.title.length > 15 ? '標題不能超過 15 字喔！' : ''));
  const descriptionWarning = computed(() =>
    form.description.length > 40 ? '內文太長囉，麻煩請幫我濃縮在40字以內！' : '',
  );

  watch(
    () => props.initialData,
    (newData) => {
      const recipe = newData?.recipe;
      const ingredients = newData?.ingredients;
      const steps = newData?.steps;

      if (recipe) {
        form.title = recipe.name || '';
        form.description = recipe.content || '';
        form.tags = recipe.tag ? recipe.tag.split('#').filter(Boolean) : [];
        const foundCategory = categories.find((c) => c.id === recipe.recipe_category_id);
        form.category = foundCategory ? foundCategory.value : 'single';
        form.time = recipe.cooked_time || '5~10';
        form.servings = recipe.serving || '1~2';
        form.status = backendToUiStatus(recipe.status);
        form.ingredients =
          Array.isArray(ingredients) && ingredients.length
            ? ingredients.map((item) => ({ name: item.name, amount: item.serving }))
            : [{ name: '', amount: '' }];
        form.steps =
          Array.isArray(steps) && steps.length ? steps.map((s) => s.content || '') : [''];
        initialImageUrl.value = recipe.image || null;
        file.value = null;
      } else {
        Object.assign(form, {
          title: '',
          description: '',
          tags: [],
          category: 'single',
          time: '5~10',
          servings: '1~2',
          ingredients: [{ name: '', amount: '' }],
          steps: [''],
          status: null,
        });
        file.value = null;
        initialImageUrl.value = null;
      }
    },
    { immediate: true, deep: true },
  );

  const submitRecipe = async (statusCode) => {
    const isPublishingAction = [STATUS.PENDING, STATUS.ON].includes(statusCode);
    if (isPublishingAction) {
      const errors = [];
      if (!form.title.trim()) errors.push('請輸入食譜名稱。');
      if (!form.description.trim()) errors.push('請輸入簡介。');
      if (!file.value && !initialImageUrl.value) errors.push('請上傳一張食譜圖片。');
      if (form.tags.length === 0) errors.push('請至少新增一個食譜標籤。');
      if (form.ingredients.some((item) => !item.name.trim() || !item.amount.trim()))
        errors.push('所有「所需食材」和「份量」都必須填寫。');
      if (form.steps.some((step) => !step.trim())) errors.push('所有「料理步驟」都必須填寫內容。');
      if (errors.length > 0) {
        alert('發布前請修正以下問題：\n\n- ' + errors.join('\n- '));
        return;
      }
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      let imagePath = '';
      if (isEditing.value && initialImageUrl.value) {
        imagePath = initialImageUrl.value.split('/').pop();
      }
      if (file.value) {
        const formData = new FormData();
        formData.append('image', file.value);
        const imageRes = await axios.post(`${apiBase}/admin/recipe/upload_image.php`, formData, {
          withCredentials: true,
        });
        if (imageRes.data.status !== 'success')
          throw new Error(imageRes.data.message || '圖片上傳失敗');
        imagePath = imageRes.data.imagePath;
      }

      const getLoggedInUserId = () => 1;
      const getLoggedInAdminId = () => 1;
      const selectedCategory = categories.find((c) => c.value === form.category);

      const recipePayload = {
        recipe_id: isEditing.value ? props.initialData.recipe.recipe_id : null,
        user_id: isAdmin.value ? null : getLoggedInUserId(),
        manager_id: isAdmin.value ? getLoggedInAdminId() : null,
        recipe_category_id: selectedCategory ? selectedCategory.id : null,
        name: form.title,
        content: form.description,
        serving: form.servings,
        image: imagePath,
        cooked_time: form.time,
        status: statusCode,
        tag: form.tags.map((t) => `#${t}`).join(''),
      };

      const apiEndpoint = isEditing.value
        ? `${apiBase}/admin/recipe/update_recipe.php`
        : `${apiBase}/admin/recipe/create_recipe.php`;
      const { data: recipeRes } = await axios.post(apiEndpoint, recipePayload, {
        withCredentials: true,
      });
      const recipeId = isEditing.value ? props.initialData.recipe.recipe_id : recipeRes.recipe_id;
      if (!recipeId) throw new Error('後端未回傳 recipe_id');

      const ingredientsPayload = {
        recipe_id: recipeId,
        ingredients: form.ingredients
          .filter((i) => i.name && i.amount)
          .map((i) => ({ ingredient_id: i.ingredient_id ?? null, name: i.name, amount: i.amount })),
        mode: isEditing.value ? 'replace' : 'append',
      };
      await axios.post(`${apiBase}/admin/recipe/post_ingredients.php`, ingredientsPayload, {
        withCredentials: true,
      });

      const stepsPayload = {
        recipe_id: recipeId,
        steps: form.steps.filter((s) => s && s.trim()),
        mode: isEditing.value ? 'replace' : 'append',
      };
      await axios.post(`${apiBase}/admin/recipe/post_steps.php`, stepsPayload, {
        withCredentials: true,
      });

      alert(isPublishingAction ? '🎉 食譜已成功發布/更新！' : '✅ 草稿已儲存！');
      emit('save-success');
      handleClose();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || '發生未知錯誤';
      console.error('發布/儲存錯誤:', error);
      alert(`操作失敗：\n${message}`);
    }
  };

  const saveDraft = () => submitRecipe(STATUS.DRAFT);
  const publishRecipe = () => {
    const finalStatusCode = isAdmin.value ? STATUS.ON : STATUS.PENDING;
    submitRecipe(finalStatusCode);
  };

  const submitReview = async () => {
    if (!props.initialData?.recipe) return;
    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      const nextStatus = uiToBackendStatus(form.status);
      const payload = {
        recipe_id: props.initialData.recipe.recipe_id,
        status: nextStatus,
      };
      await axios.post(`${apiBase}/admin/recipe/update_recipe_status.php`, payload, {
        withCredentials: true,
      });
      alert('✅ 審核結果已更新！');
      emit('save-success');
      handleClose();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || '更新審核結果時發生錯誤';
      console.error('審核錯誤：', error);
      alert(`審核失敗：\n${message}`);
    }
  };

  const submitUpdate = () => {
    const keepStatus = props.initialData?.recipe?.status ?? STATUS.ON;
    submitRecipe(keepStatus);
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
