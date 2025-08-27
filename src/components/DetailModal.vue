<template>
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="modal-overlay"
      @click.self="$emit('close')"
    >
      <div class="modal-container">
        <h2 class="modal-header">{{ dynamicTitle }}</h2>

        <div class="modal-body">
          <!-- =================== 通知詳情 (Notification) =================== -->
          <div v-if="type === 'notification'">
            <div class="info-row">
              <label>通知編號</label>
              <p>{{ data.notification_id || 'N/A' }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>發送日期</label>
              <p>{{ data.sent_date || 'N/A' }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>通知類型</label>
              <p>{{ data.notification_type || 'N/A' }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>接收會員</label>
              <p>{{ data.recipient_id || 'N/A' }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>狀態</label>
              <p>{{ data.is_read ? '已讀取' : '未讀取' }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>通知內容</label>
              <p class="content-text">{{ data.content || '無' }}</p>
            </div>
          </div>

          <!-- =================== 檢舉詳情 (Report) =================== -->
          <div v-else-if="type === 'report'">
            <div class="info-row">
              <label>檢舉日期</label>
              <p>{{ data.report_date || 'N/A' }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>檢舉會員編號</label>
              <p>{{ data.reporter_user_id ? `U${data.reporter_user_id}` : 'N/A' }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>檢舉類型</label>
              <p>{{ mapReportType(data.report_type) }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>留言會員編號</label>
              <p>{{ data.offender_user_id ? `U${data.offender_user_id}` : 'N/A' }}</p>
            </div>
            <hr />
            <div class="info-row">
              <label>留言內容</label>
              <p class="content-text">{{ data.comment_content || '無' }}</p>
            </div>
            <hr />
            <div class="info-row status-row">
              <label>處理狀況</label>
              <select
                v-model="localStatus"
                class="status-select"
              >
                <option
                  v-for="option in reportStatusOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- =================== 食譜詳情 (Recipe) =================== -->
          <div v-else-if="type === 'recipe'">
            <div
              v-if="data && data.recipe"
              class="recipe-details"
            >
              <div class="info-row image-row">
                <label>食譜圖片</label>
                <img
                  v-if="data.recipe.image"
                  :src="data.recipe.image"
                  alt="食譜圖片"
                  class="detail-image"
                />
                <p v-else>無圖片</p>
              </div>
              <hr />
              <div class="info-row">
                <label>食譜編號</label>
                <p>{{ data.recipe.recipe_id || 'N/A' }}</p>
              </div>
              <hr />
              <div class="info-row">
                <label>作者</label>
                <p>{{ data.recipe.author_name || 'N/A' }}</p>
              </div>
              <hr />
              <div class="info-row">
                <label>食譜分類</label>
                <p>{{ data.recipe.category_name || 'N/A' }}</p>
              </div>
              <hr />
              <div class="info-row">
                <label>新增日期</label>
                <p>{{ data.recipe.created_at || 'N/A' }}</p>
              </div>
              <hr />
              <div class="info-row-flex">
                <div class="info-item">
                  <label>烹飪時間</label>
                  <p>{{ data.recipe.cooked_time || 'N/A' }}</p>
                </div>
                <div class="info-item">
                  <label>料理份數</label>
                  <p>{{ data.recipe.serving || 'N/A' }}</p>
                </div>
              </div>
              <hr />
              <div class="info-row">
                <label>食譜標籤</label>
                <p>{{ data.recipe.tag || '無' }}</p>
              </div>
              <hr />
              <div class="info-row">
                <label>內文</label>
                <p class="content-text">{{ data.recipe.content || '無' }}</p>
              </div>
              <hr />
              <div
                class="info-row"
                v-if="data.ingredients && data.ingredients.length > 0"
              >
                <label>所需食材</label>
                <ul class="item-list">
                  <li
                    v-for="(item, index) in data.ingredients"
                    :key="`ing-${index}`"
                  >
                    <span>{{ item.name }}</span>
                    <span>{{ item.amount }}</span>
                  </li>
                </ul>
              </div>
              <hr v-if="data.ingredients && data.ingredients.length > 0" />
              <div
                class="info-row"
                v-if="data.steps && data.steps.length > 0"
              >
                <label>料理步驟</label>
                <ol class="item-list">
                  <li
                    v-for="(step, index) in data.steps"
                    :key="`step-${index}`"
                  >
                    {{ step }}
                  </li>
                </ol>
              </div>
              <hr />
              <div class="info-row status-row">
                <label>食譜狀態</label>
                <select
                  v-model="localStatus"
                  class="status-select"
                >
                  <option
                    v-for="option in recipeStatusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
            <div v-else><p>無法載入食譜詳細資料。</p></div>
          </div>
        </div>

        <div class="action-buttons">
          <TheButton
            @click="$emit('close')"
            type="cancel"
            :text="type === 'report' ? '取消' : '關閉'"
          />
          <template v-if="type === 'report' || type === 'recipe'">
            <TheButton
              @click="handleSave"
              :text="type === 'report' ? '儲存' : '確定'"
            />
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import axios from 'axios';
  import TheButton from '@/components/common/TheButton.vue';

  const props = defineProps({
    show: { type: Boolean, required: true },
    type: {
      type: String,
      required: true,
      validator: (value) => ['report', 'notification', 'recipe'].includes(value),
    },
    title: { type: String, default: '詳細資訊' },
    data: { type: Object, default: () => ({}) },
  });

  // ✅ 核心修改 1: 擴充 emit 定義，新增 'update-success' 事件
  const emit = defineEmits(['close', 'save', 'update-success']);

  const dynamicTitle = computed(() => {
    if (props.type === 'recipe' && props.data?.recipe?.name) {
      return props.data.recipe.name;
    }
    return props.title;
  });

  const localStatus = ref(null);

  // --- 「檢舉」類型用的 computed ---
  const reportStatusOptions = computed(() => {
    if (props.type !== 'report' || typeof props.data?.status === 'undefined') return [];
    switch (props.data.status) {
      case 0:
        return [
          { value: 0, label: '待處理' },
          { value: 1, label: '已下架' },
          { value: 2, label: '已上架' },
        ];
      case 1:
        return [
          { value: 1, label: '已下架' },
          { value: 2, label: '已恢復' },
        ];
      case 2:
        return [
          { value: 2, label: '已上架' },
          { value: 1, label: '已下架' },
        ];
      default:
        return [];
    }
  });

  // --- 「食譜」類型用的狀態和 computed ---
  const recipeStatusMap = { 0: '待審核', 1: '已上架', 2: '已下架', 3: '草稿' };
  const recipeStatusOptions = computed(() => {
    if (props.type !== 'recipe' || !props.data?.recipe) return [];
    const currentStatus = props.data.recipe.status;
    switch (currentStatus) {
      case 0:
        return [
          { value: 0, label: '待審核' },
          { value: 1, label: '已上架' },
          { value: 2, label: '已下架' },
        ];
      case 1:
        return [
          { value: 1, label: '已上架' },
          { value: 2, label: '已下架' },
        ];
      case 2:
        return [
          { value: 2, label: '已下架' },
          { value: 1, label: '已上架' },
        ];
      default:
        return [{ value: currentStatus, label: recipeStatusMap[currentStatus] || '未知' }];
    }
  });

  // --- watch (會同時處理三種 type) ---
  watch(
    () => props.data,
    (newData) => {
      if (props.type === 'report' && newData) {
        localStatus.value = newData.status;
      } else if (props.type === 'recipe' && newData?.recipe) {
        localStatus.value = newData.recipe.status;
      }
    },
    { immediate: true, deep: true },
  );

  // ==========================================================
  //           【✅ 核心修改 2：升級 handleSave 函式】
  // ==========================================================
  async function handleSave() {
    // --- 處理「檢舉」的邏輯 (保持不變) ---
    if (props.type === 'report') {
      let payload = { id: props.data.report_id, newStatus: localStatus.value };
      if (payload.id !== null && localStatus.value !== null) {
        // 維持原有功能：向父層發出 'save' 事件
        emit('save', payload);
      } else {
        console.error('儲存失敗：找不到 ID 或未選擇新狀態。');
        alert('請先從下拉選單中選擇一個處理狀態。');
      }
      return; // 結束函式
    }

    // --- 處理「食譜」的邏輯 (新增 API 呼叫) ---
    if (props.type === 'recipe') {
      const recipeId = props.data?.recipe?.recipe_id;
      const originalStatus = props.data?.recipe?.status;

      if (!recipeId || localStatus.value === null) {
        alert('無法更新：缺少食譜 ID 或新的狀態。');
        return;
      }

      if (localStatus.value === originalStatus) {
        emit('close'); // 狀態未變更，直接關閉
        return;
      }

      try {
        const apiBase = import.meta.env.VITE_API_BASE;
        const response = await axios.post(
          `${apiBase}/recipe/patch_recipe_status.php`,
          {
            id: recipeId,
            newStatus: localStatus.value,
          },
          {
            withCredentials: true,
          },
        );

        if (response.data.status === 'success') {
          alert('食譜狀態已成功更新！');
          // 觸發 'update-success' 事件，通知父層刷新列表
          emit('update-success');
          // 關閉自己
          emit('close');
        } else {
          alert('更新失敗：' + response.data.message);
        }
      } catch (error) {
        console.error('更新食譜狀態時發生錯誤:', error);
        const errorMessage = error.response?.data?.message || '操作失敗，請稍後再試。';
        alert(errorMessage);
      }
    }
  }

  // --- Helper 函式 (保持不變) ---
  function mapReportType(type) {
    const types = { 1: '仇恨言論', 2: '謾罵和騷擾', 3: '暴力言論', 4: '侵犯隱私', 5: '垃圾內容' };
    return types[type] || '未知';
  }
</script>

<style scoped lang="scss">
  /* 【✅ 核心修正 1 ✅】 */
  /* 讓遮罩層自己具備滾動能力 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start; /* 改為從頂部對齊 */
    z-index: 1000;
    overflow-y: auto; /* 【最關鍵的一步】允許遮罩層滾動 */
    padding: 10vh 20px; /* 給予上下內邊距，讓燈箱有呼吸空間 */
    box-sizing: border-box;
  }

  /* 【✅ 核心修正 2 ✅】 */
  /* 移除燈箱容器的高度限制 */
  .modal-container {
    width: 550px;
    background-color: #fefbf1;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 40px;
    box-sizing: border-box;
    /* display: flex; 和 flex-direction: column; 已經是正確的，保持 */
    display: flex;
    flex-direction: column;

    /* 移除 max-height，讓燈箱的高度可以自由地被內容撐開 */
    /* max-height: 90vh; */
  }

  /* 【✅ 核心修正 3 ✅】 */
  /* 確保 modal-body 不會自己產生滾動條 */
  .modal-body {
    /* flex-grow: 1; */ /* 移除這兩個屬性 */
    /* overflow-y: auto; */
  }

  /* ========================================================== */
  /* --- 以下所有樣式，都與您提供的完全一致，保持不變 --- */
  /* ========================================================== */

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  .modal-header {
    font-size: 28px;
    font-weight: 600;
    text-align: left;
    margin-bottom: 32px;
    flex-shrink: 0;
  }
  .info-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .info-row label {
    font-size: 18px;
    font-weight: 500;
  }
  .info-row p {
    font-size: 18px;
    margin-left: 10px;
  }
  .comment-content {
    line-height: 1.6;
    white-space: pre-wrap;
  }
  hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 20px 0;
  }
  .status-row {
    position: relative;
  }
  .status-row label {
    font-size: 16px;
    color: #888;
    margin-bottom: 8px;
  }
  .status-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    box-sizing: border-box;
    height: 48px;
    border: 1px solid #ccc;
    border-radius: 12px;
    font-size: 18px;
    background-color: white;
    padding: 0 48px 0 16px;
  }
  .status-row::after {
    content: '';
    position: absolute;
    right: 20px;
    top: 70%;
    width: 10px;
    height: 10px;
    border: solid #333;
    border-width: 0 3px 3px 0;
    transform: translateY(-50%) rotate(45deg);
    pointer-events: none;
  }
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 32px;
    flex-shrink: 0;
  }
  .btn {
    padding: 12px 48px;
    border-radius: 20px;
    border: 1px solid transparent;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
  }
  .btn-save {
    background-color: #d97c48;
    color: white;
    border-color: #d97c48;
  }
  .btn-cancel {
    background-color: #fefbf1;
    color: #d97c48;
    border-color: #ccc;
  }
  .btn:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
  }
</style>
