<template>
  <el-table
    :data="tableData"
    max-height="75vh"
    style="width: 100%"
  >
    <el-table-column
      v-for="(col, index) in columns"
      :key="index"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
    >
      <!-- ✨ [修正] 將所有顯示邏輯合併到同一個 #default 插槽中，避免渲染錯誤 -->
      <template #default="scope">
        <!-- 情況一：如果是按鈕類型 -->
        <div v-if="col.type === 'button'">
          <slot
            :name="col.prop"
            :row="scope.row"
          >
            <!-- 預設顯示的圖示按鈕 -->
            <!-- ✨ [關鍵] 1. 為圖示加上 @click 事件 -->
            <!-- ✨ [修正] 2. 將 id="icon" 改為 class="detail-icon"，避免 ID 重複 -->
            <icon
              icon-name="detail"
              class="detail-icon"
              @click="handleIconClick(scope.row)"
            />
          </slot>
        </div>

        <!-- 情況二：如果是狀態開關類型 -->
        <div v-else-if="col.type === 'status'">
          <slot
            :name="col.prop"
            :row="scope.row"
          >
            <!-- 預設顯示的開關 -->
            <switch_el />
          </slot>
        </div>

        <!-- 情況三：其他所有一般文字欄位 -->
        <span v-else>{{ scope.row[col.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
  import icon from '@/components/common/Icon.vue';
  import switch_el from '@/components/Switch.vue';

  defineProps({
    tableData: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
  });

  // ✨ [關鍵] 3. 聲明這個元件會發送一個名為 'button-click' 的事件
  const emit = defineEmits(['button-click']);

  // ✨ [關鍵] 4. 當預設的圖示按鈕被點擊時，觸發這個函式
  function handleIconClick(rowData) {
    // 發送事件，並將該行的完整資料(rowData)作為參數傳出去
    emit('button-click', rowData);
  }
</script>

<style lang="scss" scoped>
  /* ✨ [修正] 3. 將 #id 選擇器改為 .class 選擇器 */
  .detail-icon {
    font-size: 20px;
    &:hover {
      cursor: pointer;
    }
  }

  ::v-deep(.el-table__header) {
    th {
      background-color: #d6b59c !important;
      color: #fef9ec !important;
      font-size: 14px;
    }
  }

  ::v-deep(.el-table__row) {
    td {
      background-color: #fefbf1;
      color: #333;
      font-size: 14px;
    }
  }
  ::v-deep(.el-table__body tr:hover > td) {
    background-color: #ffffff !important; /* ← 你想要的 hover 顏色 */
  }

  ::v-deep(.el-table__cell) {
    text-align: center;
  }
</style>
