<template>
  <div class="meta-row recipe-meta-component">
    <div class="meta-item meta-item-full">
      <label class="form-label">食譜分類</label>
      <select
        :value="category"
        @input="$emit('update:category', $event.target.value)"
        class="form-select"
      >
        <option
          v-for="c in categories"
          :key="c.value"
          :value="c.value"
        >
          {{ c.label }}
        </option>
      </select>
    </div>
    <div class="meta-item meta-item-half">
      <label class="form-label">
        烹調時間
        <span class="unit-label">（分鐘）</span>
      </label>
      <select
        :value="time"
        @input="$emit('update:time', $event.target.value)"
        class="form-select"
      >
        <option
          v-for="t in timeOptions"
          :key="t.value"
          :value="t.value"
        >
          {{ t.label }}
        </option>
      </select>
    </div>
    <div class="meta-item meta-item-half">
      <label class="form-label">
        料理份數
        <span class="unit-label">（人份）</span>
      </label>
      <select
        :value="servings"
        @input="$emit('update:servings', $event.target.value)"
        class="form-select"
      >
        <option
          v-for="s in servingOptions"
          :key="s.value"
          :value="s.value"
        >
          {{ s.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
  // Script 內容完全不需修改
  defineProps(['category', 'time', 'servings']);
  defineEmits(['update:category', 'update:time', 'update:servings']);
  const categories = [
    { value: 'single', label: '一人料理' },
    { value: 'family', label: '家庭聚餐' },
    { value: 'romantic', label: '浪漫晚餐' },
    { value: 'outdoor', label: '戶外料理' },
    { value: 'lazy', label: '懶人快煮' },
    { value: 'fitness', label: '健身/減糖餐' },
    { value: 'budget', label: '低預算料理' },
    { value: 'festival', label: '慶生/節慶料理' },
  ];
  const servingOptions = [
    { value: '2', label: '1~2' },
    { value: '4', label: '3~4' },
    { value: '6', label: '5~6' },
    { value: '8', label: '7~8' },
    { value: '10', label: '9+' },
  ];
  const timeOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
    { value: '45', label: '45' },
    { value: '60', label: '60' },
    { value: '90', label: '90' },
    { value: '120', label: '120' },
    { value: '180+', label: '180+' },
  ];
</script>

<style lang="scss" scoped>
  /* =================================================================== */
  /*                      桌面版樣式 (含排版修正)                        */
  /* =================================================================== */
  .meta-row {
    width: 800px;
    max-width: 100%;
    display: flex;
    /* ✨ 修改點：原本的 space-between 不再需要，改用 gap 控制間距 */
    gap: 50px;
  }

  /* 為下拉選單的「父層容器」加上相對定位 */
  .meta-item {
    position: relative;

    /* ✨ 修改點：移除舊的、有問題的 flex 規則 */
    /* &.meta-item-full { ... } */
    /* &.meta-item-half { ... } */

    /* ✨ 新增：定義 2:1:1 的比例 */
    &.meta-item-full {
      flex: 1.5; /* 佔據 2 個單位空間 */
    }
    &.meta-item-half {
      flex: 1; /* 各佔據 1 個單位空間 */
    }
  }

  .form-label {
    display: block;
    margin-bottom: 15px;
    font-size: 28px;
  }
  .unit-label {
    font-size: 20px;
    color: #828282;
  }

  .form-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    height: 60px;
    border: none;
    border-radius: 20px;
    font-size: 24px;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    padding: 0.75rem 48px 0.75rem 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }

  /* V 形箭頭的樣式 (保持不變) */
  .meta-item::after {
    content: '';
    position: absolute;
    right: 28px;
    top: 70%;
    width: 10px;
    height: 10px;
    border: solid #333;
    border-width: 0 3px 3px 0;
    transform: translateY(-50%) rotate(45deg);
    pointer-events: none;
  }

  /* =================================================================== */
  /*                      手機版樣式 (完全不受影響)                      */
  /* =================================================================== */
  @media (max-width: 768px) {
    .meta-row {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 16px;
    }

    .meta-item {
      /* 手機版：讓 full 恢復佔滿一行 */
      &.meta-item-full {
        flex-basis: 100%;
      }
      /* 手機版：讓 half 恢復各佔一半 */
      &.meta-item-half {
        flex-basis: calc(50% - 8px);
      }
    }

    .form-label {
      font-size: 20px;
    }
    .unit-label {
      font-size: 16px;
    }
  }
</style>
