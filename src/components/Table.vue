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
      <template #default="scope">
        <!-- 按鈕類型 -->
        <!-- 查看詳細類型 -->
        <div v-if="col.type === 'button-detail'">
          <Icon
            icon-name="detail"
            class="icon"
            @click="handleIconClick(scope.row)"
          />
        </div>

        <!-- 編輯類型 -->
        <div v-else-if="col.type === 'button-edit'">
          <Icon
            icon-name="edit"
            class="icon"
            @click="handleIconClick(scope.row)"
          />
        </div>

        <!-- 刪除按鈕 -->
        <div v-else-if="col.type === 'button-del'">
          <Icon
            icon-name="del"
            class="icon"
            @click="handleIconClick(scope.row)"
          />
        </div>

        <!-- 狀態開關類型 -->
        <div v-else-if="col.type === 'status'">
          <switch_el />
        </div>

        <!-- 圖片類型 -->
        <div v-else-if="col.type === 'image'">
          <img
            :src="scope.row[col.prop]"
            alt=""
            style="width: 100px; height: 100px; border-radius: 4px; object-fit: contain"
          />
        </div>

        <!-- 一般文字 -->
        <span
          v-else
          class="text"
        >
          {{ scope.row[col.prop] }}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
  import Icon from '@/components/common/Icon.vue';
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
  .icon {
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
  ::v-deep(.el-table__cell .text) {
    @include ellipsis($line: 1);
  }
</style>
